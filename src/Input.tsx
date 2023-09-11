import { Editor, type OnChange } from "@monaco-editor/react";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

type IProps = {
	onChange: OnChange;
};

export const Input: React.FC<IProps> = (props) => {
	const { onChange } = props;

	return (
		<Editor
			path="app.tsx"
			language="typescript"
			loading={<VSCodeProgressRing />}
			onChange={onChange}
		/>
	);
};
