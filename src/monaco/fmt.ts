import type { Monaco } from "@monaco-editor/react";
import biome_init, { format as biome_fmt } from "@wasm-fmt/biome_fmt";

biome_init();

export function config_fmt(monaco: Monaco) {
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
}
