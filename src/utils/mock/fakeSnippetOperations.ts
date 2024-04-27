import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {PaginatedUsers} from "../users.ts";

const DELAY: number = 1000

export class FakeSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore()

  constructor() {
    autoBind(this)
  }

  createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.createSnippet(createSnippet)), DELAY)
    })
  }

  getSnippetById(id: string): Promise<Snippet | undefined> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getSnippetById(id)), DELAY)
    })
  }

  listSnippetDescriptors(page: number,pageSize: number): Promise<PaginatedSnippets> {
    const response: PaginatedSnippets = {
      page: page,
      page_size: pageSize,
      count: 20,
      snippets: page == 0 ? this.fakeStore.listSnippetDescriptors().splice(0,pageSize) : this.fakeStore.listSnippetDescriptors().splice(1,2)
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(response), DELAY)
    })
  }

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<SnippetDescriptor> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.updateSnippet(id, updateSnippet)), DELAY)
    })
  }

  getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getUserFriends(name,page,pageSize)), DELAY)
    })
  }

  shareSnippet(snippetId: string): Promise<Snippet> {
    return new Promise(resolve => {
      // @ts-expect-error, it will always find it in the fake store
      setTimeout(() => resolve(this.fakeStore.getSnippetById(snippetId)), DELAY)
    })
  }
}
