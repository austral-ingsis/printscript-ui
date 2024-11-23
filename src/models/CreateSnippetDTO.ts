import { CreateSnippet } from "../utils/snippet";

class CreateSnippetDTO {
  constructor(
    readonly name: string,
    readonly content: string,
    readonly language: string,
    readonly extension: string
  ) {}

  static fromCreateSnippet(snippet: CreateSnippet): CreateSnippetDTO {
    return new CreateSnippetDTO(
      snippet.name,
      snippet.content,
      snippet.language,
      snippet.extension
    );
  }
}

export default CreateSnippetDTO;
