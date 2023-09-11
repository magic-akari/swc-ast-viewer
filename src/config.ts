import { loader } from "@monaco-editor/react";
import { editor, languages } from "monaco-editor";
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
	});

	monaco.languages.registerFoldingRangeProvider("swc-ast", {
		provideFoldingRanges(model) {
			const text = model.getValue();
			const result: languages.FoldingRange[] = [];
			const lines = text.split("\n");
			const stack = [];

			for (let index = 0; index < lines.length; index++) {
				const start = index + 1;
				const line = lines[index];
				const trimmed = line.trimStart();
				if (trimmed === "span: Span {") {
					result.push({
						start,
						end: start + 8,
						kind: languages.FoldingRangeKind.Comment,
					});
					index += 7;
					continue;
				}

				const indent = line.length - trimmed.length;
				const token = trimmed.slice(-1);
				switch (token) {
					case "{":
					case "[":
					case "(":
						stack.push({ start, indent, token });
						break;
					case ",": {
						const top = stack[stack.length - 1];
						if (top?.indent !== top.indent) {
							continue;
						}
						const end = start;
						const lookup = trimmed.slice(-2, -1);
						if (
							(top.token === "{" && lookup === "}") ||
							(top.token === "[" && lookup === "]") ||
							(top.token === "(" && lookup === ")")
						) {
							result.push({
								start: top.start,
								end,
								kind: languages.FoldingRangeKind.Region,
							});
							stack.pop();
						}
						break;
					}

					default:
						continue;
				}
			}

			const last = stack.pop();
			if (last) {
				result.push({
					start: last.start,
					end: lines.length,
					kind: languages.FoldingRangeKind.Region,
				});
			}

			return result;
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
		jsx: monaco.languages.typescript.JsxEmit.Preserve,
		lib: ["esnext", "dom", "dom.iterable"],
	});

	monaco.editor.addKeybindingRule({
		keybinding:
			monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
		command: "editor.action.quickCommand",
	});
});
