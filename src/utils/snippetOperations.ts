import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet'
import {PaginatedUsers} from "./users.ts";
import {TestCase, TestSnippetParams} from "../types/TestCase.ts";
import {TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";
import { FormatRule, LintRule } from '../types/Rule.ts';

export interface SnippetOperations {
  listSnippetDescriptors(page: number,pageSize: number,sippetName?: string): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<Snippet>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, content: string , name: string): Promise<Snippet>

  runSnippet(snippet: Snippet): Promise<string[]>

  getUserFriends(snippetId: string, name?: string,page?: number,pageSize?: number): Promise<PaginatedUsers>

  shareSnippet(snippetId: string,userId: string, userName: string): Promise<Snippet>

  getFormatRules(): Promise<FormatRule[]>

  getLintingRules(): Promise<LintRule[]>

  getTestCases(snippetId: string): Promise<TestCase[]>

  formatSnippet(snippet: Snippet): Promise<string>

  postTestCase(testCase: TestSnippetParams): Promise<TestCase>

  removeTestCase(id: string): Promise<string>

  deleteSnippet(id: string): Promise<string>

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult>

  getFileTypes(): Promise<FileType[]>

  modifyFormatRule(newRules: FormatRule[]): Promise<FormatRule[]>

  modifyLintingRule(newRules: LintRule[]): Promise<LintRule[]>
}
