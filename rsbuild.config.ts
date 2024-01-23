import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { presets, tagBuilder } from "gen_dep_tag";

const tag = tagBuilder({ sri: true });

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
		title: "SWC AST Viewer",
		tags: [
			tag(presets.react),
			tag(presets["react-dom"]),
			tag({
				name: "@monaco-editor/loader",
				entry: "lib/umd/monaco-loader.min.js",
			}),
		].map(htmlTag),
	},
});

function htmlTag(meta: ReturnType<typeof tag>) {
	const { url, integrity } = meta;
	return {
		tag: "script",
		attrs: {
			src: url,
			integrity,
			crossorigin: "anonymous",
		},
	};
}
