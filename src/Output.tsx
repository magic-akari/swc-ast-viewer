import Editor, { Monaco } from "@monaco-editor/react";
import { ast } from "crates/swc_ast_viewer/pkg/swc_ast_viewer.js";
import type { editor } from "monaco-editor";

type IProps = {
	code: string;
};
export const Output: React.FC<IProps> = (props) => {
	const [value, language] = getAST(props.code);

	return (
		<Editor
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

function onMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
	editor.addAction({
		id: "swc.fold_span",
		label: "Fold Span",
		keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.BracketLeft],
		contextMenuGroupId: "navigation",
		contextMenuOrder: 1,
		run(editor) {
			editor.trigger("swc.fold_span", "editor.foldAllBlockComments", {});
		},
	});

	editor.addAction({
		id: "swc.unfold_span",
		label: "Unfold Span",
		keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.BracketRight],
		contextMenuGroupId: "navigation",
		contextMenuOrder: 2,
		run(editor) {
			editor.trigger("swc.unfold_span", "editor.unfoldAll", {});
		},
	});
}
