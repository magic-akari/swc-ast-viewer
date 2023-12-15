import type { Monaco } from "@monaco-editor/react";
import { reportIssue, shareMarkdown, shareURL } from "../share";

export function copy_as_url(monaco: Monaco) {
	monaco.editor.addEditorAction({
		id: "swc-ast-viewer.copy-as-url",
		label: "Copy as URL",
		precondition: "!editorReadonly",
		contextMenuOrder: 5,
		contextMenuGroupId: "9_cutcopypaste",
		run(editor) {
			const code = editor.getValue();
			const result = shareURL(code);
			navigator.clipboard.writeText(result);
		},
	});
}

export function copy_as_markdown(monaco: Monaco) {
	monaco.editor.addEditorAction({
		id: "swc-ast-viewer.copy-as-markdown",
		label: "Copy as Markdown Link",
		precondition: "!editorReadonly",
		contextMenuOrder: 5.1,
		contextMenuGroupId: "9_cutcopypaste",
		run(editor) {
			const code = editor.getValue();
			const result = shareMarkdown(code);
			navigator.clipboard.writeText(result);
		},
	});
}

export function open_issue(monaco: Monaco) {
	monaco.editor.addEditorAction({
		id: "swc-ast-viewer.open-issue",
		label: "Open issue in SWC repository",
		precondition: "!editorReadonly",
		contextMenuOrder: 3,
		contextMenuGroupId: "issue",
		run(editor) {
			const code = editor.getValue();
			const result = reportIssue(code);
			window.open(result);
		},
	});
}
