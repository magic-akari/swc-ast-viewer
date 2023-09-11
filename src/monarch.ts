import type { languages } from "monaco-editor";

export default {
	// Set defaultToken to invalid to see what you do not tokenize yet
	defaultToken: "invalid",

	keywords: ["true", "false", "None", "Some"],

	operators: ["="],

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes:
		/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	digits: /\d+(_+\d+)*/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],

		common: [
			[/\#\d+/, "meta.module-reference"],
			// identifiers and keywords
			[
				/[a-z_$][\w$]*/,
				{
					cases: {
						"@keywords": "keyword",
						"@default": "identifier",
					},
				},
			],
			[
				/[A-Z][\w\$]*/,
				{
					cases: {
						"@keywords": "keyword",
						"@default": "type.identifier",
					},
				},
			],

			// whitespace
			{ include: "@whitespace" },

			// delimiters and operators
			[/[()\[\]]/, "@brackets"],
			[
				/@symbols/,
				{
					cases: {
						"@operators": "delimiter",
						"@default": "",
					},
				},
			],

			[/(@digits)/, "number"],

			// delimiter: after number because of .\d floats
			[/[;,.]/, "delimiter"],

			// strings
			[/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
			[/'([^'\\]|\\.)*$/, "string.invalid"], // non-teminated string
			[/"/, "string", "@string_double"],
			[/'/, "string", "@string_single"],
		],

		whitespace: [[/[ \t\r\n]+/, ""]],

		string_double: [
			[/[^\\"]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/"/, "string", "@pop"],
		],

		string_single: [
			[/[^\\']+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/'/, "string", "@pop"],
		],
	},
} satisfies languages.IMonarchLanguage;
