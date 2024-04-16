import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from './snippet'

export interface SnippetOperations {
  listSnippetDescriptors(page: number,pageSize: number): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<SnippetDescriptor>
}
