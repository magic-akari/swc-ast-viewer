import Editor, { Monaco } from "@monaco-editor/react";
import init, {
	ast,
	version,
} from "crates/swc_ast_viewer/pkg/swc_ast_viewer.js";
import wasm_url from "crates/swc_ast_viewer/pkg/swc_ast_viewer_bg.wasm?url";
import type { editor } from "monaco-editor";
import { use } from "react";

const wasm_init = init(wasm_url);

wasm_init.then(() => {
	console.log("swc version", version());
});

type IProps = {
	code: string;
};
export const Output: React.FC<IProps> = (props) => {
	use(wasm_init);

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
