import init, { version } from "#swc_ast_viewer";
import wasm_url from "#swc_ast_viewer/swc_ast_viewer_bg.wasm?url";
import { use } from "react";

const wasm_init = init(wasm_url);

wasm_init.then(() => {
	console.log("swc version", version());
});

export const Init: React.FC = () => {
	use(wasm_init);

	return null;
};
