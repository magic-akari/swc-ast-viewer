import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";
import { useCallback } from "react";
import { type Span } from "./swc-ast-parser";

type IProps = {
	defaultValue: string;
	filename: string;
	onChange: OnChange;
	onRename: (name: string) => void;
	onSelect: (selection: Span) => void;
};

export const Input: React.FC<IProps> = (props) => {
	const { defaultValue, filename, onChange, onSelect, onRename } = props;

	const onMount = useCallback<OnMount>(
		(editor) => {
			editor.createContextKey(
				"share_available",
				navigator.share !== undefined,
			);
			const module = editor.getModel()!;

			const { dispose } = editor.onDidChangeCursorSelection((e) => {
				const start = module.getOffsetAt(
					e.selection.getStartPosition(),
				);
				const end = module.getOffsetAt(e.selection.getEndPosition());

				const lo = start + 1;
				const hi = end + 1;

				onSelect({ lo, hi });
			});

			return dispose;
		},
		[onSelect],
	);

	return (
		<>
			<header>
				<input
					className="filename"
					name="filename"
					placeholder="<input>"
					defaultValue={filename}
					onInput={(e) => onRename(e.currentTarget.value)}
					list="filename-presets"
				/>
			</header>
			<datalist id="filename-presets">
				<option value="main.js"></option>
				<option value="main.ts"></option>
				<option value="main.jsx"></option>
				<option value="main.tsx"></option>
				<option value="main.mjs"></option>
				<option value="main.cjs"></option>
				<option value="main.mts"></option>
				<option value="main.cts"></option>
				<option value="main.mjsx"></option>
				<option value="main.cjsx"></option>
				<option value="main.mtsx"></option>
				<option value="main.ctsx"></option>
			</datalist>
			<Editor
				defaultValue={defaultValue}
				path="app.tsx"
				language="typescript"
				onChange={onChange}
				onMount={onMount}
			/>
		</>
	);
};
