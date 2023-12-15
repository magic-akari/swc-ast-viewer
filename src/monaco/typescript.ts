import type { Monaco } from "@monaco-editor/react";

export function config_typescript(monaco: Monaco) {
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
}
