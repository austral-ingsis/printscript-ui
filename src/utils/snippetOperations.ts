import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from './snippet'
import {PaginatedUsers} from "./users.ts";

export interface SnippetOperations {
  listSnippetDescriptors(page: number,pageSize: number): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<SnippetDescriptor>

  getUserFriends(name?: string,page?: number,pageSize?: number): Promise<PaginatedUsers>
}
