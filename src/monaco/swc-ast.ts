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
		comments: {
			blockComment: ["span: Span {", "},"],
		},
	});
}

export function swc_ast_code_len(monaco: Monaco) {
	monaco.languages.registerCodeLensProvider("swc-ast", {
		provideCodeLenses() {
			return {
				lenses: [
					{
						range: {
							startLineNumber: 1,
							startColumn: 1,
							endLineNumber: 2,
							endColumn: 1,
						},
						id: "swc.fold_span_code_lens",
						command: {
							id: "editor.foldAllBlockComments",
							title: "Fold Span",
						},
					},
					{
						range: {
							startLineNumber: 1,
							startColumn: 2,
							endLineNumber: 2,
							endColumn: 1,
						},
						id: "swc.unfold_span_code_lens",
						command: {
							id: "editor.unfoldAll",
							title: "Unfold Span",
						},
					},
				],
				dispose() {},
			};
		},
	});
}

export function swc_ast_monarch(monaco: Monaco) {
	monaco.languages.setMonarchTokensProvider("swc-ast", monarch);
}
