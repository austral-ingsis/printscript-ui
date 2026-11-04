import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet'
import {PaginatedUsers} from "./users.ts";
import {TestCase, TestRunResult} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";

export type DownloadedSnippet = {
  blob: Blob
  filename: string
}

export type RevalidationRun = {
  id: string
  language: string
  version: string
  status: 'RUNNING' | 'COMPLETED'
  total: number
  processed: number
  failed: number
}

export interface SnippetOperations {
  listSnippetDescriptors(page: number, pageSize: number, snippetName?: string, compliance?: ComplianceEnum): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<Snippet>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet>

  getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers>

  shareSnippet(snippetId: string, userId: string): Promise<Snippet>

  getFormatRules(): Promise<Rule[]>

  getLintingRules(): Promise<Rule[]>

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]>

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]>

  formatSnippet(snippetContent: string, language: string, version: string): Promise<string>

  getTestCases(snippetId: string): Promise<TestCase[]>

  postTestCase(snippetId: string, testCase: Partial<TestCase>): Promise<TestCase>

  removeTestCase(snippetId: string, testId: string): Promise<string>

  testSnippet(snippetId: string, testCase: Partial<TestCase>): Promise<TestRunResult>

  deleteSnippet(id: string): Promise<string>

  downloadSnippet(id: string, formatted: boolean): Promise<DownloadedSnippet>

  getFileTypes(): Promise<FileType[]>

  startRevalidation(language: string, version: string): Promise<RevalidationRun>

  getRevalidation(runId: string): Promise<RevalidationRun>
}
