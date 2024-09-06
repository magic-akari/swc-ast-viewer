use anyhow::Result;
use std::{str::FromStr, sync::Arc};
use swc_core::{
    self,
    common::{errors::HANDLER, FileName, Globals, Mark, SourceFile, SourceMap, GLOBALS},
    ecma::{
        ast::*,
        parser::{
            error::Error as SWCError, parse_file_as_program, EsSyntax, PResult, Syntax, TsSyntax,
        },
        transforms::base::resolver,
        visit::VisitMutWith,
    },
};
use swc_error_reporters::handler::try_with_handler;
use wasm_bindgen::prelude::wasm_bindgen;

fn typescript(fm: &SourceFile, errors: &mut Vec<SWCError>, tsx: bool) -> PResult<Program> {
    parse_file_as_program(
        &fm,
        Syntax::Typescript(TsSyntax {
            tsx,
            decorators: true,
            ..Default::default()
        }),
        EsVersion::EsNext,
        None,
        errors,
    )
}

fn javascript(fm: &SourceFile, errors: &mut Vec<SWCError>, jsx: bool) -> PResult<Program> {
    parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax {
            jsx,
            decorators: true,
            ..Default::default()
        }),
        EsVersion::EsNext,
        None,
        errors,
    )
}

#[wasm_bindgen(typescript_custom_section)]
const TS_FileType: &'static str = r#"type FileType = "js" | "jsx" | "ts" | "tsx";"#;

#[derive(Default, PartialEq)]
enum FileType {
    JavaScript,
    JavaScriptReact,
    TypeScript,
    #[default]
    TypeScriptReact,
}

impl FileType {
    fn is_ts(&self) -> bool {
        self == &Self::TypeScript || self == &Self::TypeScriptReact
    }
}

impl FromStr for FileType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        match s {
            "js" => Ok(Self::JavaScript),
            "jsx" => Ok(Self::JavaScriptReact),
            "ts" => Ok(Self::TypeScript),
            "tsx" => Ok(Self::TypeScriptReact),
            _ => Err(anyhow::anyhow!("Invalid file type: {}", s)),
        }
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "FileType")]
    pub type File;
}

#[wasm_bindgen]
pub fn ast(input: &str, file_type: Option<File>) -> Result<String, String> {
    let file_type: FileType = file_type
        .and_then(|file_type| file_type.as_string())
        .and_then(|s| s.parse().ok())
        .unwrap_or_default();

    let cm: Arc<SourceMap> = Default::default();
    let fm = cm.new_source_file(Arc::new(FileName::Anon), input.into());
    let mut errors: Vec<swc_core::ecma::parser::error::Error> = Default::default();

    let ast = try_with_handler(cm, Default::default(), |handler| {
        GLOBALS.set(&Globals::default(), || {
            HANDLER.set(handler, || {
                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();

                let mut program = match file_type {
                    FileType::JavaScript => javascript(&fm, &mut errors, false),
                    FileType::JavaScriptReact => javascript(&fm, &mut errors, true),
                    FileType::TypeScript => typescript(&fm, &mut errors, false),
                    FileType::TypeScriptReact => typescript(&fm, &mut errors, true),
                }
                .map_err(|err| anyhow::anyhow!("{err:?}"))?;

                program.visit_mut_with(&mut resolver(
                    unresolved_mark,
                    top_level_mark,
                    file_type.is_ts(),
                ));
                Ok(program)
            })
        })
    })
    .map_err(|err| format!("{err:?}"))?;

    if !errors.is_empty() {
        return Err(format!("{errors:?}"));
    }

    Ok(format!("{ast:#?}"))
}

#[wasm_bindgen]
pub fn version() -> String {
    swc_core::SWC_CORE_VERSION.into()
}
