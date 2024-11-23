import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet'
import {PaginatedUsers} from "./users.ts";
import {TestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";

export interface SnippetOperations {
  listSnippetDescriptors(page: number,pageSize: number,sippetName?: string): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<Snippet>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet>

  getUserFriends(name?: string,page?: number,pageSize?: number): Promise<PaginatedUsers>

  shareSnippet(snippetId: string,userId: string): Promise<Snippet>

  getFormatRules(): Promise<Rule[]>

  getLintingRules(): Promise<Rule[]>

  getTestCases(snippetId: string): Promise<TestCase[]>

  formatSnippet(id: string): Promise<string>

  postTestCase(testCase: Partial<TestCase>, snippetId: string): Promise<TestCase>

  removeTestCase(id: string, snippetId: string): Promise<string>

  deleteSnippet(id: string): Promise<string>

  testSnippet(testCase: Partial<TestCase>, snippetId: string): Promise<TestCaseResult>

  getFileTypes(): Promise<FileType[]>

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]>

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]>
}
