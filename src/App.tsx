import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./App.css";
import { Input } from "./Input";
import { Output } from "./Output";
import { Suspense, useCallback, useState } from "react";

export const App = () => {
	const [code, setCode] = useState("");

	const onChange = useCallback((value?: string) => {
		if (typeof value !== "undefined") {
			setCode(value);
		}
	}, []);

	return (
		<PanelGroup direction="horizontal">
			<Panel defaultSize={50} minSize={33} maxSize={66}>
				<Input onChange={onChange} />
			</Panel>
			<PanelResizeHandle className="divider" />
			<Panel>
				<Suspense fallback={"loading"}>
					<Output code={code} />
				</Suspense>
			</Panel>
		</PanelGroup>
	);
};
