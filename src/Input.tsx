import { Editor, type OnChange } from "@monaco-editor/react";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

type IProps = {
	defaultValue: string;
	onChange: OnChange;
};

export const Input: React.FC<IProps> = (props) => {
	const { defaultValue, onChange } = props;

	return (
		<Editor
			defaultValue={defaultValue}
			path="app.tsx"
			language="typescript"
			loading={<VSCodeProgressRing />}
			onChange={onChange}
		/>
	);
};
