import {FakeSnippetOperations} from "../mock/fakeSnippetOperations.ts";
import {BACKEND_URL} from "../constants.ts";
import {PaginatedUsers} from "../users.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {createAuthenticatedHttpClient} from "./authenticatedHttpClient.ts";
import {RulesHttpOperations} from "./rulesHttpOperations.ts";
import {SnippetsHttpOperations} from "./snippetsHttpOperations.ts";
import {UsersHttpOperations} from "./usersHttpOperations.ts";

export class HttpSnippetOperations extends FakeSnippetOperations {
  private readonly snippets: SnippetsHttpOperations
  private readonly users: UsersHttpOperations
  private readonly rules: RulesHttpOperations

  constructor(getToken: () => Promise<string>, baseUrl: string = BACKEND_URL) {
    super()
    const http = createAuthenticatedHttpClient(getToken, baseUrl)
    this.snippets = new SnippetsHttpOperations(http)
    this.users = new UsersHttpOperations(http)
    this.rules = new RulesHttpOperations(http)
  }

  override listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
    return this.snippets.list(page, pageSize, snippetName)
  }

  override createSnippet(snippet: CreateSnippet): Promise<Snippet> {
    return this.snippets.create(snippet)
  }

  override getSnippetById(id: string): Promise<Snippet> {
    return this.snippets.getById(id)
  }

  override updateSnippetById(id: string, snippet: UpdateSnippet): Promise<Snippet> {
    return this.snippets.update(id, snippet)
  }

  override deleteSnippet(id: string): Promise<string> {
    return this.snippets.delete(id)
  }

  override getFileTypes(): Promise<FileType[]> {
    return this.snippets.getFileTypes()
  }

  override getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
    return this.users.search(name, page, pageSize)
  }

  override shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    return this.users.share(snippetId, userId)
  }

  override getLintingRules(): Promise<Rule[]> {
    return this.rules.get("lint")
  }

  override modifyLintingRule(rules: Rule[]): Promise<Rule[]> {
    return this.rules.update("lint", rules)
  }

  override getFormatRules(): Promise<Rule[]> {
    return this.rules.get("format")
  }

  override modifyFormatRule(rules: Rule[]): Promise<Rule[]> {
    return this.rules.update("format", rules)
  }
}
