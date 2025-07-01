import { parse } from "#swc_ast_viewer";
import Editor, { type OnMount } from "@monaco-editor/react";
import { VscodeTabHeader, VscodeTabs } from "@vscode-elements/react-elements";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parse_swc_ast, type Span } from "./swc-ast-parser";

type IProps = {
	code: string;
	filename: string;
	selection: Span;
};

export const Output: React.FC<IProps> = (props) => {
	const { code, filename, selection } = props;
	const [viewMode, setViewMode] = useState<0 | 1>(0);

	const result = useMemo(() => {
		return getResult(code, filename);
	}, [code, filename]);

	const [value, language] = useMemo(() => {
		if (result.type === "error") {
			return [result.message, "error"] as const;
		}

		return [
			viewMode === 0 ? result.ast : result.tokens,
			"swc-ast",
		] as const;
	}, [result, viewMode]);

	const ref = useRef<editor.IStandaloneCodeEditor>(null!);

	const onMount = useCallback<OnMount>((editor) => {
		ref.current = editor;
	}, []);

	const section_list = useMemo(() => {
		if (language === "error") {
			return [];
		}
		return parse_swc_ast(value);
	}, [language, value]);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		if (language === "error") {
			return;
		}

		const section = section_list
			.filter((section) => {
				return (
					section.span.lo <= selection.lo
					&& selection.hi <= section.span.hi
				);
			})
			.sort((a, b) => b.level - a.level)[0];

		if (section) {
			ref.current.setSelection(section.range);
			ref.current.revealRangeInCenterIfOutsideViewport(section.range);
		}
	}, [language, selection, section_list]);

	return (
		<VscodeTabs
			onVscTabsSelect={(e) => setViewMode(e.detail.selectedIndex as 0 | 1)}
		>
			<VscodeTabHeader slot="header">AST</VscodeTabHeader>
			<VscodeTabHeader slot="header">Token</VscodeTabHeader>
			<Editor
				path={"output" + [".ast", ".token"][viewMode]}
				onMount={onMount}
				language={language}
				value={value}
				options={{ readOnly: true }}
			/>
		</VscodeTabs>
	);
};

function getResult(
	code: string,
	path: string,
):
	| { type: "error"; message: string }
	| { type: "result"; ast: string; tokens: string }
{
	try {
		const [ast, tokens] = parse(code, path);
		return {
			type: "result",
			ast,
			tokens,
		};
	} catch (error) {
		return {
			type: "error",
			message: error as string,
		};
	}
}
