import { loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import monarch from "./monarch";
import github_dark from "./themes/github_dark.json" assert { type: "json" };
import github_light from "./themes/github_light.json" assert { type: "json" };

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
		}
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
		jsx: monaco.languages.typescript.JsxEmit.Preserve,
		lib: ["esnext", "dom", "dom.iterable"],
	});

	monaco.editor.addKeybindingRule({
		keybinding:
			monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
		command: "editor.action.quickCommand",
	});
});
