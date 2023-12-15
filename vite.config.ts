import { defineConfig } from "vite";
import externalGlobals, { libPreset } from "vite-plugin-external-globals";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
	plugins: [
		Inspect({
			build: true,
			outputDir: ".vite-inspect",
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
});
