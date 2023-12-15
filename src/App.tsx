import { Suspense, useCallback, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./App.css";
import { Init } from "./Init";
import { Input } from "./Input";
import { Output } from "./Output";
import { localStore } from "./share";

interface IAppProps {
	code: string;
}
export const App: React.FC<IAppProps> = (props) => {
	const [code, setCode] = useState(props.code);

	const onChange = useCallback((value?: string) => {
		if (typeof value !== "undefined") {
			setCode(value);
			localStore.code = value;
		}
	}, []);

	return (
		<Suspense fallback={"Loading..."}>
			<Init />
			<PanelGroup direction="horizontal" className="app-main">
				<Panel defaultSize={50} minSize={33} maxSize={66}>
					<Input defaultValue={props.code} onChange={onChange} />
				</Panel>
				<PanelResizeHandle className="divider" />
				<Panel>
					<Output code={code} />
				</Panel>
			</PanelGroup>
		</Suspense>
	);
};
