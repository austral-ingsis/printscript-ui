import {ComplianceEnum, CreateSnippet, Snippet, SnippetDescriptor, UpdateSnippet} from '../snippet'
import {v4 as uuid} from 'uuid'
import {PaginatedUsers} from "../users.ts";

export type StoredSnippet = {
  id: string
  name: string
  content: string
  compliance: ComplianceEnum
  author: string
  language: string
}

export type Rule = {
  name: string,
  isActive: boolean,
  value?: string | number | null,
}

const INITIAL_SNIPPETS: StoredSnippet[] = [
  {
    id: '9af91631-cdfc-4341-9b8e-3694e5cb3672',
    name: 'Super Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'pending',
    author: 'John Doe',
    language: 'printscript'
  },
  {
    id: 'c48cf644-fbc1-4649-a8f4-9dd7110640d9',
    name: 'Extra cool Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'not-compliant',
    author: 'John Doe',
    language: 'printscript'
  },
  {
    id: '34bf4b7a-d4a1-48be-bb26-7d9a3be46227',
    name: 'Boaring Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript'
  }
]

const paginatedUsers: PaginatedUsers = {
  count: 5,
  page: 1,
  page_size: 10,
  users: [
    {
      name: "Chona",
      id: "1"
    },
    {
      name: "Fede",
      id: "2"
    },
    {
      name: "Mateo",
      id: "3"
    },
    {
      name: "Tomi",
      id: "4"
    },
    {
      name: "Berrets",
      id: "5"
    }
  ]
}

const formattingRules: Rule[] = [
  {
    name: "indentation",
    isActive: true,
    value: 3
  },
  {
    name: "open-if-block-on-same-line",
    isActive: false,
  },
  {
    name: "max-line-length",
    isActive: true,
    value: 100
  },
  {
    name: "no-trailing-spaces",
    isActive: false,
    value: null
  },
  {
    name: "no-multiple-empty-lines",
    isActive: false,
    value: null,
  }
]

const lintingRules: Rule[] = [
  {
    name: "no-expressions-in-print-line",
    isActive: true,
    value: null
  },
  {
    name: "no-unused-vars",
    isActive: true,
    value: null
  },
  {
    name: "no-undef-vars",
    isActive: false,
    value: null
  },
  {
    name: "no-unused-params",
    isActive: false,
    value: null
  },
]

export class FakeSnippetStore {
  private readonly snippetMap: Map<string, StoredSnippet> = new Map()

  constructor() {
    INITIAL_SNIPPETS.forEach(snippet => {
      this.snippetMap.set(snippet.id, snippet)
    })
  }

  listSnippetDescriptors(): SnippetDescriptor[] {
    return Array.from(this.snippetMap, ([, value]) => value)
  }

  createSnippet(createSnippet: CreateSnippet): SnippetDescriptor {
    const snippet: StoredSnippet = {
      id: uuid(),
      name: createSnippet.name,
      content: createSnippet.content,
      compliance: 'compliant',
      author: 'John Doe',
      language: 'printscript'
    }

    this.snippetMap.set(snippet.id, snippet)

    return snippet
  }

  getSnippetById(id: string): Snippet | undefined {
    return this.snippetMap.get(id)
  }

  updateSnippet(id: string, updateSnippet: UpdateSnippet): SnippetDescriptor {
    const existingSnippet = this.snippetMap.get(id)

    if (existingSnippet === undefined)
      throw Error(`Snippet with id ${id} does not exist`)

    const newSnippet = {
      ...existingSnippet,
      ...updateSnippet
    }
    this.snippetMap.set(id, newSnippet)

    return newSnippet
  }

  getUserFriends(name: string, page: number, pageSize: number) {
    return {
      ...paginatedUsers,
      page: page,
      pageSize: pageSize,
      users: paginatedUsers.users.filter(x => x.name.includes(name))
    };
  }

  getFormatRules(): Rule[] {
    return formattingRules
  }

  getLintingRules(): Rule[] {
    return lintingRules
  }

  formatSnippet(snippetContent: string): string {
    return `//Mocked format of snippet :) \n${snippetContent}`
  }
}
