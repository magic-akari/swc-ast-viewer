import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { Suspense, useCallback, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./App.css";
import { Input } from "./Input";
import { Output } from "./Output";

interface IAppProps {
	code: string;
}
export const App: React.FC<IAppProps> = (props) => {
	const [code, setCode] = useState(props.code);

	const onChange = useCallback((value?: string) => {
		if (typeof value !== "undefined") {
			setCode(value);
		}
	}, []);

	return (
		<PanelGroup direction="horizontal">
			<Panel defaultSize={50} minSize={33} maxSize={66}>
				<Input defaultValue={props.code} onChange={onChange} />
			</Panel>
			<PanelResizeHandle className="divider" />
			<Panel>
				<Suspense fallback={<VSCodeProgressRing />}>
					<Output code={code} />
				</Suspense>
			</Panel>
		</PanelGroup>
	);
};
