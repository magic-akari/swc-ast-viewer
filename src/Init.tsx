import init, { version } from "#swc_ast_viewer";
import { use } from "react";

const wasm_init = init();

wasm_init.then(() => {
	console.log("swc version", version());
});

export const Init: React.FC = () => {
	use(wasm_init);

	return null;
};
