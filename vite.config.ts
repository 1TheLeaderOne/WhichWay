import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import info from "./info.json";
import path from "node:path";

/**
 * WW_SKIP_STATIC_COPY=1 时跳过静态资源复制。
 * 全量复制 3400+ 个静态文件约需 3~4 分钟，跳过时约 4 秒——仅用于快速核对打包结果
 * （此时产物不含 audio/image/json/font/dynamicSkin/css 等资源，不可直接游玩）。
 */
const skipStaticCopy = process.env.WW_SKIP_STATIC_COPY === "1";

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
		outDir: `../../../apps/core/extension/${info.name}`,
		/**
		 * 必须保持 false：构建时**不能**先清空输出目录。
		 *
		 * 该扩展的产物目录同时承载音频/图片等海量静态资源（audio 下 2200+ 个文件），
		 * 静态复制是逐个文件写回的。若先整体删除再复制，一旦游戏正在运行或刚刷新，
		 * 音频目录就会处于「部分文件存在、部分还不存在」的中间状态 —— 而引擎
		 * `game.tryAudio` 的 `onError: play` + `refresh` 只要遇到「部分缺失」的候选列表
		 * 就会无限重试（听感是「一句配音播完又随机播另一句、永不停歇」）。
		 * 产物 JS 都是带 hash 的 chunk，旧的残留文件不会被引用，因此不清空是安全的。
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
				// 其余 chunk 带 hash（避免重名互相覆盖），并按源码路径起名。
				// 不做这件事的话，大量动态入口都叫 `index`，产物里会是一堆
				// index-<hash>.js，堆栈里完全无法定位。
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
					return `chunks/${name || chunkInfo.name}-[hash].js`;
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
