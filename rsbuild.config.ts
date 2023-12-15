import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { libPreset } from "vite-plugin-external-globals";
import { transformIndexHtml } from "vite-plugin-external-globals/lib/transform_index_html";

export default defineConfig({
	plugins: [pluginReact()],
	output: {
		assetPrefix: "./",
		polyfill: "off",
		externals: {
			"react": "React",
			"react-dom": "ReactDOM",
			"@monaco-editor/loader": "monaco_loader",
		},
	},
	html: {
		tags: transformIndexHtml({
			integrity: true,
			crossorigin: "anonymous",
			entry: [
				libPreset("react"),
				libPreset("react-dom"),
				{
					name: "@monaco-editor/loader",
					var: "monaco_loader",
					path: "lib/umd/monaco-loader.min.js",
				},
			],
		}),
	},
	tools: {
		bundlerChain(chain) {
			chain.module
				.rule("wasm-url")
				.test(/\.wasm$/)
				.type("asset/resource");
		},
	},
});
