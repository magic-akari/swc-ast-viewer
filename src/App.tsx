import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { Suspense, useCallback, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./App.css";
import { Init } from "./Init";
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
		<Suspense fallback={<VSCodeProgressRing className="loading" />}>
			<Init />
			<PanelGroup direction="horizontal">
				<Panel defaultSizePercentage={50} minSizePercentage={33} maxSizePercentage={66}>
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
