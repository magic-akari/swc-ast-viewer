import fs from "fs/promises";
import path from "path";
import init, { ast, version } from "./swc_ast_viewer_node.js";

await init();

process.stderr.write(`swc@${version()}\n\n`);

const files = process.argv.slice(2);

for (const file of files) {
	const code = await fs.readFile(file, "utf8");
	const file_type = path.extname(file).toLowerCase();
	const output = ast(code, file_type);
	process.stderr.write(`[${file}]\n`);
	console.log(output);
}
