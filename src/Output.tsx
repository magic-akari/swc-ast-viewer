import { ast } from "#swc_ast_viewer";
import Editor, { type OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { parse_swc_ast, type Span } from "./swc-ast-parser";

type IProps = {
	code: string;
	selection: Span;
};

export const Output: React.FC<IProps> = (props) => {
	const { selection, code } = props;
	const [value, language] = getAST(code);
	const ref = useRef<editor.IStandaloneCodeEditor>(null!);

	const onMount = useCallback<OnMount>((editor, monaco) => {
		ref.current = editor;

		const fold = editor.addAction({
			id: "swc.fold_span",
			label: "Fold Span",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.BracketLeft],
			contextMenuGroupId: "navigation",
			contextMenuOrder: 1,
			run(editor) {
				editor.trigger("swc.fold_span", "editor.foldAllBlockComments", {});
			},
		});

		const unfold = editor.addAction({
			id: "swc.unfold_span",
			label: "Unfold Span",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.BracketRight],
			contextMenuGroupId: "navigation",
			contextMenuOrder: 2,
			run(editor) {
				editor.trigger("swc.unfold_span", "editor.unfoldAll", {});
			},
		});

		return () => {
			fold.dispose();
			unfold.dispose();
		};
	}, []);

	const section_list = useMemo(() => {
		if (language !== "swc-ast") {
			return [];
		}
		return parse_swc_ast(value);
	}, [language, value]);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		if (language !== "swc-ast") {
			return;
		}

		const section = section_list.filter((section) => {
			return section.span.lo <= selection.lo && selection.hi <= section.span.hi;
		}).sort((a, b) => b.level - a.level)[0];

		if (section) {
			ref.current.setSelection(section.range);
			ref.current.revealRange(section.range, editor.ScrollType.Smooth);
		}
	}, [language, selection, section_list]);

	return (
		<Editor
			path="output"
			onMount={onMount}
			language={language}
			value={value}
			options={{ readOnly: true }}
		/>
	);
};

function getAST(code: string): [code: string, language: string] {
	try {
		return [ast(code), "swc-ast"];
	} catch (error) {
		return [error as string, "error"];
	}
}
