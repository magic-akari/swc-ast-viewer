import init, { version } from "crates/swc_ast_viewer/pkg/swc_ast_viewer.js";
import wasm_url from "crates/swc_ast_viewer/pkg/swc_ast_viewer_bg.wasm?url";
import { use } from "react";

const wasm_init = init(wasm_url);

wasm_init.then(() => {
	console.log("swc version", version());
});


export const Init: React.FC = () => {
	use(wasm_init);

	return null;
};
