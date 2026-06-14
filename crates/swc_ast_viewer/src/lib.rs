use anyhow::Result;
use std::sync::Arc;
use swc_core::{
    self,
    common::{FileName, GLOBALS, Globals, Mark, SourceMap, errors::ColorConfig},
    ecma::{
        ast::*,
        parser::{EsSyntax, Lexer, Parser, StringInput, Syntax, TsSyntax, unstable::Capturing},
        transforms::base::resolver,
        visit::VisitMutWith,
    },
};
use swc_error_reporters::handler::{HandlerOpts, try_with_handler};

use wasm_bindgen::prelude::wasm_bindgen;

static FILE_NAME: &str = "main.mtsx";

#[wasm_bindgen]
pub fn parse(input: &str, file_name: Option<String>) -> Result<Vec<String>, String> {
    let file_name = file_name.unwrap_or_else(|| FILE_NAME.to_string());
    let mut iter = file_name.rsplit('.');
    let ext = iter.next();

    let is_jsx = ext.is_some_and(|e| {
        e == "jsx" || e == "tsx" || e == "mjsx" || e == "cjsx" || e == "mtsx" || e == "ctsx"
    });

    let is_esm = ext.is_some_and(|e| e == "mjs" || e == "mts" || e == "mjsx" || e == "mtsx");

    let is_cjs = ext.is_some_and(|e| e == "cjs" || e == "cts" || e == "cjsx" || e == "ctsx");

    let is_ts = ext.is_some_and(|e| {
        e == "ts" || e == "tsx" || e == "mts" || e == "cts" || e == "mtsx" || e == "ctsx"
    });

    let is_d_ts = ext == Some("ts") && (iter.next() == Some("d") || iter.next() == Some("d"));

    let cm: Arc<SourceMap> = Default::default();
    let fm = cm.new_source_file(Arc::new(FileName::Anon), input.to_string());

    let syntax = if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_jsx,
            dts: is_d_ts,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            ..Default::default()
        })
    };
    let target = EsVersion::latest();

    let lexer = Capturing::new(Lexer::new(syntax, target, StringInput::from(&*fm), None));

    let mut parser = Parser::new_from(lexer);

    let program = if is_esm {
        parser.parse_module().map(Program::Module)
    } else if is_cjs {
        parser.parse_commonjs().map(Program::Script)
    } else {
        parser.parse_program()
    };

    let mut ast = try_with_handler(
        cm,
        HandlerOpts {
            color: ColorConfig::Never,
            ..Default::default()
        },
        |handler| {
            for err in parser.take_errors() {
                err.into_diagnostic(handler).emit();
            }

            program.map_err(|err| {
                err.into_diagnostic(handler).emit();
                anyhow::anyhow!("Failed to parse the input")
            })
        },
    )
    .map_err(swc_error_reporters::TWithDiagnosticArray::to_pretty_string)?;

    let tokens = parser.input_mut().iter_mut().take();

    GLOBALS.set(&Globals::default(), || {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        ast.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, is_ts));

        Ok(vec![format!("{ast:#?}"), format!("{tokens:#?}")])
    })
}

#[wasm_bindgen]
#[must_use]
pub fn version() -> String {
    swc_core::SWC_CORE_VERSION.into()
}
