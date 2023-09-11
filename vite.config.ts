import { swc } from "rollup-plugin-swc3";
import { defineConfig } from "vite";
import externalGlobals, { libPreset } from "vite-plugin-external-globals";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
	plugins: [
		Inspect({
			build: true,
			outputDir: ".vite-inspect",
		}),
		swc({
			tsconfig: false,
		}),
		externalGlobals({
			apply: "build",
			injectTo: "body",
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
	],
	base: "./",
	resolve: {
		alias: {
			crates: "./crates",
		},
	},
});
