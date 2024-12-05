import {Snippet} from "../utils/snippet.ts";

export interface UpdateSnippetResponse {
    message: string,
    updatedSnippet? : Snippet
}