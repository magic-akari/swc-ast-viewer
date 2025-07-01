import { VscodeSplitLayout } from "@vscode-elements/react-elements";
import { Suspense, useCallback, useState } from "react";
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
	const [filename, rename] = useState("main.mtsx");
	const [selection, setSelection] = useState({ lo: 0, hi: 0 });

	const onChange = useCallback((value?: string) => {
		if (value !== undefined) {
			setCode(value);
			localStore.code = value;
		}
	}, []);

	return (
		<Suspense fallback={"Loading..."}>
			<Init />
			<VscodeSplitLayout className="app-main">
				<div className="split-panel" slot="start">
					<Input
						defaultValue={props.code}
						filename={filename}
						onChange={onChange}
						onRename={rename}
						onSelect={setSelection}
					/>
				</div>
				<div className="split-panel" slot="end">
					<Output code={code} selection={selection} filename={filename} />
				</div>
			</VscodeSplitLayout>
		</Suspense>
	);
};
