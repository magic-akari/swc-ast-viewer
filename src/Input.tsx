import { Editor, type OnChange } from "@monaco-editor/react";

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
		/>
	);
};
