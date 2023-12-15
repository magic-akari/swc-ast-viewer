import { decompressFromEncodedURIComponent } from "lz-string";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { localStore } from "./share";

import("./config");

let init_code = "";
if (location.hash.startsWith("#code/")) {
	const code = location.hash.replace("#code/", "").trim();
	localStore.code = init_code = decompressFromEncodedURIComponent(code);
} else {
	init_code = localStore.code;
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App code={init_code} />
	</StrictMode>,
);
