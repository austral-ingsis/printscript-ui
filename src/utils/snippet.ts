export type ComplianceEnum =
    'pending' |
    'failed' |
    'not-compliant' |
    'compliant'


export type SnippetDescriptor = {
  id: string
  name: string
  compliance: ComplianceEnum
}

export type CreateSnippet = {
  name: string;
  content: string
}

export type UpdateSnippet = {
  content: string
}

export type Snippet = CreateSnippet & {
  id: string
}
