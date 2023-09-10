import Editor from "@monaco-editor/react";
import wasm_url from "crates/swc_ast_viewer/pkg/swc_ast_viewer_bg.wasm?url";
import init, { ast } from "crates/swc_ast_viewer/pkg/swc_ast_viewer.js";
import { use } from "react";

const wasm_init = init(wasm_url);

type IProps = {
	code: string;
};
export const Output: React.FC<IProps> = (props) => {
	const { code } = props;

	use(wasm_init);

	const result = getAST(code);

	return <Editor value={result} options={{ readOnly: true }} />;
};

function getAST(code: string): string {
	try {
		return ast(code);
	} catch (error) {
		return error as string;
	}
}
