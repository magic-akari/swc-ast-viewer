import { decompressFromEncodedURIComponent } from "lz-string";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

let init_code = "";
if (location.hash.startsWith("#code/")) {
	const code = location.hash.replace("#code/", "").trim();
	init_code = decompressFromEncodedURIComponent(code);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App code={init_code} />
	</StrictMode>,
);
