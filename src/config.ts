import { loader } from "@monaco-editor/react";
import { copy_as_markdown, copy_as_url, open_issue } from "./monaco/action";
import { config_fmt } from "./monaco/fmt";
import { swc_ast_code_len, swc_ast_config, swc_ast_monarch, swc_ast_register } from "./monaco/swc-ast";
import { config_theme } from "./monaco/theme";
import { config_typescript } from "./monaco/typescript";

loader.init().then((monaco) => {
	config_theme(monaco);
	config_typescript(monaco);

	swc_ast_register(monaco);
	swc_ast_config(monaco);
	swc_ast_code_len(monaco);
	swc_ast_monarch(monaco);

	config_fmt(monaco);

	copy_as_url(monaco);
	copy_as_markdown(monaco);
	open_issue(monaco);

	monaco.editor.addKeybindingRule({
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
		command: "editor.action.quickCommand",
	});
});
