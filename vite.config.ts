import { defineConfig, type Plugin, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import info from "./info.json";
import path from "node:path";
import fs from "node:fs";

/**
 * WW_SKIP_STATIC_COPY=1 时跳过静态资源复制。
 * 全量复制 3400+ 个静态文件约需 3~4 分钟，跳过时约 4 秒——仅用于快速核对打包结果
 * （此时产物不含 audio/image/json/font/dynamicSkin/css 等资源，不可直接游玩）。
 */
const skipStaticCopy = process.env.WW_SKIP_STATIC_COPY === "1";

/** WW_KEEP_OLD_CHUNKS=1 时不删除输出目录里过期的 chunk（排查产物对比时用）。 */
const keepOldChunks = process.env.WW_KEEP_OLD_CHUNKS === "1";

const outDir = `../../../apps/core/extension/${info.name}`;

/**
 * 构建写盘后，删掉 `<outDir>/chunks/` 里不属于本次产物的 `.js`。
 *
 * 为什么必须删：`emptyOutDir` 只能是 false（见 build 里的注释），也就是说构建从来不清空输出目录，
 * 而发布只是把产物按文件名覆盖过去。chunk 名一旦带 hash，每次构建都是「新增一批、旧的一个不删」，
 * 实测当前 `chunks/` 已堆了 38 个文件（历史上堆过 596 个，同名 `GloriousIdeal-battleOverlay-shared-*` 有 26 份），
 * 用户每次更新都在自己机器上多攒一批永远不会再被引用的死文件。
 * 现在 chunk 名固定（同名就地覆盖），本插件只负责回收 hash 时代留下的残留，
 * 以及日后 chunk 改名（模块在 chunk 之间迁移导致 `-shared` 名字变化）产生的孤儿。
 *
 * 删除范围严格限定在 `chunks/*.js`，绝不碰 audio/image/dynamicSkin 等静态资源。
 */
function pruneStaleChunks(): Plugin {
	const chunksDir = path.resolve(__dirname, outDir, "chunks");
	return {
		name: "whichWayPruneStaleChunks",
		apply: "build",
		writeBundle(_options, bundle) {
			const keep = new Set<string>();
			for (const [fileName, output] of Object.entries(bundle)) {
				if (output.type === "chunk") keep.add(path.basename(fileName));
			}
			//首次构建时输出目录还不存在
			if (!fs.existsSync(chunksDir)) return;
			for (const file of fs.readdirSync(chunksDir)) {
				if (!file.endsWith(".js") || keep.has(file)) continue;
				if (!fs.statSync(path.join(chunksDir, file)).isFile()) continue;
				fs.rmSync(path.join(chunksDir, file));
				console.log(`[WhichWay] 删除过期 chunk: chunks/${file}`);
			}
		},
	};
}

export default defineConfig(({ mode }) => ({
	define: {
		"process.env.NODE_ENV": JSON.stringify(mode),
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../../../apps/core/noname"),
		},
	},
	plugins: [
		vue() as PluginOption,
		...(keepOldChunks ? [] : [pruneStaleChunks()]),
		...(skipStaticCopy
			? []
			: [
					viteStaticCopy({
						targets: [
							{ src: "audio", dest: "" },
							{ src: "image", dest: "" },
							{ src: "info.json", dest: "" },
							{ src: "LICENSE", dest: "" },
							{ src: "json", dest: "" },
							{ src: "font", dest: "" },
							{ src: "dynamicSkin", dest: "" },
							{ src: "css", dest: "" },
							{ src: "./src/updateLog/updateContent.txt", dest: "./src/updateLog/" },
							{ src: "README.md", dest: "" },
							{ src: "vedio", dest: "" },
							{ src: ".gitignore", dest: "" },
						],
					}) as PluginOption,
				]),
	],
	/**
	 * 必须显式声明输出字符集为 utf8。
	 *
	 * esbuild 的 charset 默认是 ascii，开启压缩后会把本扩展的海量中文文本转义成 \uXXXX
	 * （每个中文字符 3 字节 → 6 字节），体积可能不降反增。
	 */
	esbuild: {
		charset: "utf8",
	},
	build: {
		// 关闭 sourcemap：产物不再生成 .js.map。
		sourcemap: false,
		// 生产构建压缩：packs 等 chunk 体积约 -50%，直接减少 dev 下 vite 的 transform
		// 开销与生产下的传输/解析开销。开发构建（build:watch --mode development）
		// 保持不压缩，保留可读堆栈便于调试。
		minify: mode === "development" ? false : "esbuild",
		lib: {
			entry: {
				extension: "extension.js",
			},
			formats: ["es"],
		},
		outDir,
		/**
		 * 必须保持 false：构建时**不能**先清空输出目录。
		 *
		 * 该扩展的产物目录同时承载音频/图片等海量静态资源（audio 下 2200+ 个文件），
		 * 静态复制是逐个文件写回的。若先整体删除再复制，一旦游戏正在运行或刚刷新，
		 * 音频目录就会处于「部分文件存在、部分还不存在」的中间状态 —— 而引擎
		 * `game.tryAudio` 的 `onError: play` + `refresh` 只要遇到「部分缺失」的候选列表
		 * 就会无限重试（听感是「一句配音播完又随机播另一句、永不停歇」）。
		 *
		 * 不清空之所以不会让产物目录无限膨胀，靠的是 chunk 文件名固定（同名覆盖）
		 * 加上面的 `pruneStaleChunks` 回收孤儿，而不是靠 hash —— hash 只会让残留永远删不掉。
		 */
		emptyOutDir: false,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			external: [/^noname(\/.*)?$/, "vue", "pinyin-pro"],
			output: {
				// 不再 preserveModules：产物从「一个模块一个文件（362 个）」变成
				// 「入口 + 按动态入口自然分包（约 25 个）」，启动期模块请求数大幅下降。
				// 入口固定叫 extension.js（宿主按 /extension/WhichWay/extension.js 加载）。
				entryFileNames: "[name].js",
				/**
				 * chunk 名字里**不能带 `[hash]`**（本文件顶部 `pruneStaleChunks` 的注释记录了带 hash 的实际后果：
				 * 不清空输出目录 + 按文件名覆盖发布 ⇒ 每次构建净增一批死文件，用户侧 `chunks/` 无限膨胀）。
				 * 名字仍按源码路径起，否则大量动态入口都叫 `index`，产物里会是一堆
				 * index-xxx.js，堆栈里完全无法定位。
				 *
				 * 万一两个 chunk 推出同一个名字（例如同时存在 `src/a.ts` 与 `src/a/index.ts`），
				 * rollup 会静默把后者改成 `chunks/a2.js`（已实测：既不报警也不覆盖，import 路径同步更新），
				 * 所以这里不需要自己再加 hash 去重名；真出现了就按日志里的文件名去调整 `derive` 的规则。
				 */
				chunkFileNames(chunkInfo) {
					const derive = id => {
						const matched = (id || "").replace(/\\/g, "/").match(/\/src\/(.+?)\.(?:ts|js|mjs|vue)$/);
						return matched ? matched[1].replace(/\/index$/, "").replace(/\//g, "-") : "";
					};
					// 优先用动态入口自身的路径；共享 chunk 没有 facade，退回其内部
					// 第一个源码模块（按 id 排序保证多次构建结果稳定）。
					let name = derive(chunkInfo.facadeModuleId);
					if (!name) {
						const inner = [...chunkInfo.moduleIds].sort().map(derive).find(Boolean);
						if (inner) name = `${inner}-shared`;
					}
					return `chunks/${name || chunkInfo.name}.js`;
				},
				// 必须保持这个名字：file.js#autoLoadCSS 会扫描整个 css/ 目录并按文件名注入，
				// 改名会导致样式重复或丢失。
				assetFileNames: "css/viteAutoCreateStyle[extname]",
				// 这里刻意不使用 manualChunks：
				// 干员/卡牌模块由 src/packs/index.ts 用 import.meta.glob(eager) 静态引入，
				// rollup 已自然把它们合并进 packs 这一动态 chunk（267 个模块 → 1 次请求）。
				// 若额外用 manualChunks 单独分组，rollup 会因为该组与入口共享核心模块而
				// 把整组提升为入口的静态依赖，导致干员模块在 start() 之前就被求值，
				// 破坏「干员只在 packs 阶段缓冲进 packHooks」的既有语义。
			},
		},
	},
}));
