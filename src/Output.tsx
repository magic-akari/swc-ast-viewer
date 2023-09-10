import Editor, { Monaco } from "@monaco-editor/react";
import init, { ast } from "crates/swc_ast_viewer/pkg/swc_ast_viewer.js";
import wasm_url from "crates/swc_ast_viewer/pkg/swc_ast_viewer_bg.wasm?url";
import { languages } from "monaco-editor";
import { use } from "react";

const wasm_init = init(wasm_url);

type IProps = {
	code: string;
};
export const Output: React.FC<IProps> = (props) => {
	use(wasm_init);

	const [value, language] = getAST(props.code);

	return (
		<Editor
			beforeMount={beforeMount}
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

function beforeMount(monaco: Monaco) {
	monaco.languages.register({ id: "swc-ast" });

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
}
