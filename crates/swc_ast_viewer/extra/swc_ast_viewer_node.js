import fs from "node:fs/promises";
import initAsync from "./swc_ast_viewer.js";

const wasm = new URL("./swc_ast_viewer_bg.wasm", import.meta.url);

export default function __wbg_init(init = { module_or_path: fs.readFile(wasm) }) {
	return initAsync(init);
}

export * from "./swc_ast_viewer.js";
