import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'

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

  listSnippetDescriptors(): Promise<PaginatedSnippets> {
    const response: PaginatedSnippets = {
      page: 0,
      page_size: 10,
      count: 20,
      snippets: this.fakeStore.listSnippetDescriptors()
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
}
