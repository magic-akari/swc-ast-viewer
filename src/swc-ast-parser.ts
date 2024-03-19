import type { IRange } from "monaco-editor";

export interface Span {
	lo: number;
	hi: number;
}

interface SPanInStack {
	span: Span;
	level: number;
}

interface Section {
	level: number;
	span: Span;
	range: IRange;
}

interface Position {
	lineNumber: number;
	column: number;
}

interface PartialSection {
	type: "start" | "end";
	level: number;
	pos: Position;
}

const span_regex = /^span: (\d+)\.\.(\d+)#\d+,$/;

export function parse_swc_ast(source: string): Section[] {
	const lines = source.split("\n");
	const section_stack: PartialSection[] = [];
	const span_stack: SPanInStack[] = [];
	const result: Section[] = [];

	for (const [row, line] of lines.entries()) {
		const text = line.trimStart();
		const level = line.length - text.length;

		const span_match = span_regex.exec(text);
		if (span_match) {
			// span: 7..8#2,
			const lo = Number.parseInt(span_match[1]);
			const hi = Number.parseInt(span_match[2]);
			const span: Span = { lo, hi };
			span_stack.push({ span, level });
		}

		if (text.at(-1) === "{") {
			section_stack.push({ type: "start", level, pos: { lineNumber: row + 1, column: level + 1 } });
		} else if (text[0] === "}") {
			const top = section_stack.pop();
			if (!top || top.type !== "start" || level !== top.level) {
				throw Error("Invalid section");
			}

			if (top.level !== level) {
				continue;
			}

			const span_ref = span_stack.at(-1);
			if (!span_ref || level >= span_ref.level) {
				continue;
			}

			const { span } = span_stack.pop()!;

			const { lineNumber: startLineNumber, column: startColumn } = top.pos;
			const range = {
				startLineNumber,
				startColumn,
				endLineNumber: row + 1,
				endColumn: level + 1 + text.length,
			};
			result.push({ level, span, range });
		}
	}

	return result;
}
