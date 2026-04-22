import type { Monaco } from "@monaco-editor/react";
import biome_init, { format as biome_fmt } from "@wasm-fmt/biome_fmt/web";

biome_init();

export function config_fmt(monaco: Monaco) {
	monaco.languages.registerDocumentFormattingEditProvider(
		["javascript", "javascriptreact", "typescript", "typescriptreact"],
		{
			provideDocumentFormattingEdits(model, options) {
				const text = model.getValue();
				const indentStyle = options.insertSpaces ? "space" : "tab";
				const indentWidth = options.tabSize;

				try {
					const formatted = biome_fmt(text, model.uri.path, {
						indentStyle,
						indentWidth,
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
}
