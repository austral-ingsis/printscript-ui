import {CreateSnippet, Snippet, SnippetDescriptor, UpdateSnippet} from './snippet'

export interface SnippetOperations {
  listSnippetDescriptors(): Promise<SnippetDescriptor[]>

  createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<SnippetDescriptor>
}
