import { Snippet } from "../utils/snippet";

class SnippetDTO {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly content: string,
    readonly language: string,
    readonly compliance: string,
    readonly author: string
  ) {}

  static toSnippet(dto: SnippetDTO): Snippet {
    return {
      id: dto.id.toString(),
      name: dto.name,
      content: dto.content,
      language: dto.language,
      extension: dto.language,
      compliance: dto.compliance,
      author: dto.author,
    } as Snippet;
  }
}

export default SnippetDTO;
