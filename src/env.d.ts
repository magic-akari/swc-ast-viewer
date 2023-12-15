/// <reference types="react/canary" />

declare module "*.wasm" {
	const wasm: string;
	export default wasm;
}
