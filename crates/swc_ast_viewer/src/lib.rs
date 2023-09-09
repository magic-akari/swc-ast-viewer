use anyhow::Result;
use serde::Deserialize;
use std::{str::FromStr, sync::Arc};
use swc_core::{
    self,
    common::{errors::HANDLER, FileName, Globals, Mark, SourceFile, SourceMap, GLOBALS},
    ecma::{
        ast::*,
        parser::{
            error::Error as SWCError, parse_file_as_module, EsConfig, PResult, Syntax, TsConfig,
        },
        transforms::base::resolver,
        visit::VisitMutWith,
    },
};
use swc_error_reporters::handler::try_with_handler;
use wasm_bindgen::prelude::wasm_bindgen;

fn typescript(fm: &SourceFile, errors: &mut Vec<SWCError>, tsx: bool) -> PResult<Program> {
    parse_file_as_module(
        &fm,
        Syntax::Typescript(TsConfig {
            tsx,
            decorators: true,
            ..Default::default()
        }),
        EsVersion::EsNext,
        None,
        errors,
    )
    .map(Program::Module)
}

fn javascript(fm: &SourceFile, errors: &mut Vec<SWCError>, jsx: bool) -> PResult<Program> {
    parse_file_as_module(
        &fm,
        Syntax::Es(EsConfig {
            jsx,
            decorators: true,
            ..Default::default()
        }),
        EsVersion::EsNext,
        None,
        errors,
    )
    .map(Program::Module)
}

#[derive(Default, PartialEq, Deserialize)]
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
    #[wasm_bindgen(typescript_type = "Config")]
    pub type File;
}

#[wasm_bindgen]
pub fn ast(input: &str, file_type: Option<File>) -> Result<String, String> {
    let file_type: FileType = if let Some(file_type) = file_type {
        serde_wasm_bindgen::from_value(file_type.clone()).map_err(|op| op.to_string())?
    } else {
        Default::default()
    };

    let cm: Arc<SourceMap> = Default::default();
    let fm = cm.new_source_file(FileName::Anon, input.into());
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
