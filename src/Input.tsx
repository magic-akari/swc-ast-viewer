import { Editor, type OnChange } from "@monaco-editor/react";

type IProps = {
	onChange: OnChange;
};

export const Input: React.FC<IProps> = (props) => {
	const { onChange } = props;

	return <Editor onChange={onChange} />;
};
