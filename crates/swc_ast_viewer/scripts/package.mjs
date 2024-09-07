#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import init, { version } from "../pkg/swc_ast_viewer_node.js";

await init();

const pkg_path = path.resolve(process.cwd(), process.argv[2]);
const pkg_text = fs.readFileSync(pkg_path, { encoding: "utf-8" });
const pkg_json = JSON.parse(pkg_text);

delete pkg_json.files;

pkg_json.version = version();
pkg_json.main = pkg_json.module;
pkg_json.type = "module";
pkg_json.bin = {
	swc_ast_viewer: "viewer.js",
};
pkg_json.publishConfig = {
	access: "public",
};
pkg_json.exports = {
	".": {
		types: "./swc_ast_viewer.d.ts",
		node: "./swc_ast_viewer_node.js",
		default: "./swc_ast_viewer.js",
	},
	"./*": "./*",
};

fs.writeFileSync(pkg_path, JSON.stringify(pkg_json, null, "\t"));
