import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import info from "./info.json";
import path from "node:path";

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
				{ src: ".gitignore",dest:""}
			],
		}) as PluginOption,
	],
	build: {
		// 关闭 sourcemap：产物不再生成 .js.map，否则 getFileTree 扫目录时会把
		// .map 文件也列进来，removeExt("xxx.js.map") 得到 "xxx.js"，导致
		// 动态 import 拼出 "xxx.js.ts" 报 Unknown variable dynamic import。
		// 产物本身 minify:false，堆栈仍可读，调试影响很小。
		sourcemap: false,
		minify: false,
		lib: {
			entry: {
				extension: "extension.js",
			},
			formats: ["es"],
		},
		outDir: `../../../apps/core/extension/${info.name}`,
		emptyOutDir: true,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			external: [/^noname(\/.*)?$/, "vue", "pinyin-pro"],
			output: {
				preserveModules: true,
				preserveModulesRoot: "./",
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "css/viteAutoCreateStyle[extname]",
			},
		},
	},
}));
