import { loader } from "@monaco-editor/react";
import biome_init, { format as biome_fmt } from "@wasm-fmt/biome_fmt";
import wasm_url from "@wasm-fmt/biome_fmt/biome_fmt_bg.wasm?url";
import type { editor } from "monaco-editor";
import monarch from "./monarch";
import github_dark from "./themes/github_dark.json" assert { type: "json" };
import github_light from "./themes/github_light.json" assert { type: "json" };

biome_init(wasm_url);
loader.init().then((monaco) => {
	monaco.languages.register({ id: "swc-ast" });

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

	monaco.languages.setMonarchTokensProvider("swc-ast", monarch);

	monaco.editor.defineTheme(
		"github-light",
		github_light as editor.IStandaloneThemeData,
	);
	monaco.editor.defineTheme(
		"github-dark",
		github_dark as editor.IStandaloneThemeData,
	);

	monaco.editor.setTheme("github-light");

	monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ESNext,
		module: monaco.languages.typescript.ModuleKind.ESNext,
		jsx: monaco.languages.typescript.JsxEmit.Preserve,
	});

	monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: true,
		noSuggestionDiagnostics: true,
	});

	monaco.languages.registerDocumentFormattingEditProvider(
		["javascript", "javascriptreact", "typescript", "typescriptreact"],
		{
			provideDocumentFormattingEdits(model, options) {
				const text = model.getValue();
				const indent_style = options.insertSpaces ? "space" : "tab";
				const indent_width = options.tabSize;

				try {
					const formatted = biome_fmt(text, model.uri.path, {
						indent_style,
						indent_width,
					});

					return [
						{
							range: model.getFullModelRange(),
							text: formatted,
						},
					];
				} catch (error) {
					console.error(error);
					return [];
				}
			},
		},
	);

	monaco.editor.addKeybindingRule({
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
		command: "editor.action.quickCommand",
	});
});
