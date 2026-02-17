import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import info from "./info.json";

export default defineConfig(({ mode }) => ({
	define: {
		"process.env.NODE_ENV": JSON.stringify(mode),
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
				{ src: "readme.md", dest: "" },
			],
		}) as PluginOption,
	],
	build: {
		sourcemap: true,
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
