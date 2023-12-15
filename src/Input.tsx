import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";

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
			onChange={onChange}
			onMount={onMount}
		/>
	);
};

const onMount: OnMount = (editor) => {
	editor.createContextKey("share_available", navigator.share !== undefined);
};
