import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";
import { useCallback } from "react";
import { type Span } from "./swc-ast-parser";

type IProps = {
	defaultValue: string;
	onChange: OnChange;
	onSelect: (selection: Span) => void;
};

export const Input: React.FC<IProps> = (props) => {
	const { defaultValue, onChange, onSelect } = props;

	const onMount = useCallback<OnMount>((editor) => {
		editor.createContextKey("share_available", navigator.share !== undefined);
		const module = editor.getModel()!;

		const { dispose } = editor.onDidChangeCursorSelection((e) => {
			const start = module.getOffsetAt(e.selection.getStartPosition());
			const end = module.getOffsetAt(e.selection.getEndPosition());

			const lo = start + 1;
			const hi = end + 1;

			onSelect({ lo, hi });
		});

		return dispose;
	}, [onSelect]);

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
