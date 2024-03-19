import type { Monaco } from "@monaco-editor/react";
import monarch from "./monarch";

export function swc_ast_register(monaco: Monaco) {
	monaco.languages.register({ id: "swc-ast" });
}

export function swc_ast_config(monaco: Monaco) {
	monaco.languages.setLanguageConfiguration("swc-ast", {
		colorizedBracketPairs: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
	});
}

export function swc_ast_monarch(monaco: Monaco) {
	monaco.languages.setMonarchTokensProvider("swc-ast", monarch);
}
