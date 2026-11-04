import {Pagination} from "./pagination.ts";
import {FileType} from "../types/FileType.ts";

export type ComplianceEnum =
    'pending' |
    'failed' |
    'not-compliant' |
    'compliant'

export type LintViolation = {
    rule: string
    message: string
    line: number
    column: number
}

export type CreateSnippet = {
  name: string;
  content: string;
  language: string;
  version?: string;
  description?: string;
  extension?: string;
}

export type CreateSnippetWithLang = CreateSnippet & { language: string }

export type UpdateSnippet = {
  content: string
}

export type Snippet = CreateSnippet & {
  id: string
  lintViolations?: LintViolation[]
} & SnippetStatus

type SnippetStatus = {
  compliance: ComplianceEnum;
  author: string;
}
export type PaginatedSnippets = Pagination & {
  snippets: Snippet[]
}

export const getFileLanguage = (fileTypes: FileType[], fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.extension == fileExt)
}

/** Latest version of a language, the one new snippets are written in by default. */
export const defaultVersion = (fileTypes: FileType[], language: string): string | undefined => {
  const versions = fileTypes.find(f => f.language === language)?.versions ?? []
  return versions.at(-1)
}
