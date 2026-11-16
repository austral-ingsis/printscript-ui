import axios, {AxiosInstance} from 'axios'
import autoBind from 'auto-bind'
import {SnippetOperations} from './snippetOperations'
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet} from './snippet'
import {PaginatedUsers} from './users.ts'
import {TestCase} from '../types/TestCase.ts'
import {TestCaseResult} from './queries.tsx'
import {FileType} from '../types/FileType.ts'
import {Rule} from '../types/Rule.ts'

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL || '/api'

// shortcut: only PrintScript 1.1 (the current version in snippet-service), add a language/version endpoint when there are more
const PRINTSCRIPT_VERSION = '1.1'
const FILE_TYPES: FileType[] = [{language: 'printscript', extension: 'prs'}]

const COMPLIANCE: Record<string, ComplianceEnum> = {
  PENDING: 'pending',
  VALID: 'compliant',
  INVALID: 'not-compliant',
}

type SnippetListItem = { id: string, ownerId: string, name: string, language: string, lintStatus: string }
type SnippetListResponse = { items: SnippetListItem[], page: number, size: number, total: number }
type SnippetDetailResponse = { id: string, name: string, language: string, content: string, lintStatus: string }

const toSnippet = (s: { id: string, name: string, language: string, lintStatus: string }, content = '', author = ''): Snippet => ({
  id: s.id,
  name: s.name,
  language: s.language,
  extension: FILE_TYPES.find(f => f.language === s.language)?.extension ?? 'txt',
  content,
  author,
  compliance: COMPLIANCE[s.lintStatus] ?? 'pending',
})

const notAvailable = (operation: string): Promise<never> =>
  Promise.reject(new Error(`${operation}: snippet-service does not expose this endpoint yet`))

export class SnippetServiceOperations implements SnippetOperations {
  private readonly http: AxiosInstance

  constructor(getAccessToken: () => Promise<string>) {
    autoBind(this)
    this.http = axios.create({baseURL: BACKEND_URL})
    this.http.interceptors.request.use(async config => {
      config.headers.Authorization = `Bearer ${await getAccessToken()}`
      return config
    })
  }

  async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
    // the backend rejects a blank name, so it is only sent when there is one
    const params = {page, size: pageSize, ...(snippetName?.trim() ? {name: snippetName.trim()} : {})}
    const {data} = await this.http.get<SnippetListResponse>('/snippets', {params})
    return {
      page: data.page,
      page_size: data.size,
      count: data.total,
      snippets: data.items.map(item => toSnippet(item, '', item.ownerId)),
    }
  }

  async getSnippetById(id: string): Promise<Snippet> {
    const {data} = await this.http.get<SnippetDetailResponse>(`/snippets/${id}`)
    return toSnippet(data, data.content)
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const form = new FormData()
    form.append('file', new Blob([createSnippet.content], {type: 'text/plain'}), `${createSnippet.name}.${createSnippet.extension}`)
    form.append('name', createSnippet.name)
    form.append('language', createSnippet.language)
    form.append('version', PRINTSCRIPT_VERSION)
    const {data} = await this.http.post<SnippetDetailResponse>('/snippets', form)
    return toSnippet(data, createSnippet.content)
  }

  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    await this.http.post(`/snippets/${snippetId}/shares`, {targetUserId: userId})
    return this.getSnippetById(snippetId)
  }

  getUserFriends(name: string = ''): Promise<PaginatedUsers> {
    // shortcut: there is no users endpoint, so the typed text is offered as the target user id (Auth0 sub); replace once a users service exists
    const users = name.trim() ? [{id: name.trim(), name: name.trim()}] : []
    return Promise.resolve({page: 0, page_size: users.length, count: users.length, users})
  }

  getFileTypes(): Promise<FileType[]> {
    return Promise.resolve(FILE_TYPES)
  }

  updateSnippetById(): Promise<Snippet> {
    return notAvailable('Update snippet')
  }

  deleteSnippet(): Promise<string> {
    return notAvailable('Delete snippet')
  }

  formatSnippet(): Promise<string> {
    return notAvailable('Format snippet')
  }

  getFormatRules(): Promise<Rule[]> {
    return notAvailable('Format rules')
  }

  getLintingRules(): Promise<Rule[]> {
    return notAvailable('Linting rules')
  }

  modifyFormatRule(): Promise<Rule[]> {
    return notAvailable('Modify format rules')
  }

  modifyLintingRule(): Promise<Rule[]> {
    return notAvailable('Modify linting rules')
  }

  getTestCases(): Promise<TestCase[]> {
    return notAvailable('Test cases')
  }

  postTestCase(): Promise<TestCase> {
    return notAvailable('Create test case')
  }

  removeTestCase(): Promise<string> {
    return notAvailable('Remove test case')
  }

  testSnippet(): Promise<TestCaseResult> {
    return notAvailable('Run test case')
  }
}
