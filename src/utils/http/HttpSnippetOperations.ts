import axios, {AxiosInstance, AxiosResponse} from "axios";
import {CreateSnippet, ComplianceEnum, LintViolation, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {DownloadedSnippet, RevalidationRun, SnippetOperations} from "../snippetOperations.ts";
import {PaginatedUsers, User} from "../users.ts";
import {TestCase, TestRunResult, TestStatus} from "../../types/TestCase.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";

/** Language the rules screen works with. The backend supports more, the UI only shows PrintScript. */
const RULES_LANGUAGE = "printscript";

/** Shapes returned by snippet-handler (see snippet-handler/README.md). */
type SnippetDto = {
  id: string
  name: string
  description?: string | null
  language: string
  version: string
  ownerId: string
  compliance: "PENDING" | "COMPLIANT" | "NOT_COMPLIANT" | "FAILED"
  lintViolations?: LintViolation[]
  content?: string
}

type PageDto<T> = {
  content: T[]
  totalElements: number
  number: number
  size: number
}

type RuleViewDto = { name: string, description: string, enabled: boolean, value: string | null }

type TestCaseViewDto = {
  id: string
  name: string
  inputs: string[]
  expectedOutputs: string[]
  lastStatus: TestStatus
}

type TestRunResultDto = {
  testId: string | null
  status: TestStatus
  outputs: string[]
  expectedOutputs: string[]
  errors: string[]
}

type LanguageInfoDto = { name: string, versions: string[], fileExtension: string }

type RevalidationRunDto = {
  id: string
  language: string
  version: string
  status: "RUNNING" | "COMPLETED"
  total: number
  processed: number
  failed: number
}

const COMPLIANCE: Record<SnippetDto["compliance"], ComplianceEnum> = {
  PENDING: "pending",
  COMPLIANT: "compliant",
  NOT_COMPLIANT: "not-compliant",
  FAILED: "failed",
}

/** Compliance as the backend's enum, for filtering the listing. */
const COMPLIANCE_FILTER: Record<ComplianceEnum, SnippetDto["compliance"]> = {
  pending: "PENDING",
  compliant: "COMPLIANT",
  "not-compliant": "NOT_COMPLIANT",
  failed: "FAILED",
}

const toSnippet = (dto: SnippetDto, content = ""): Snippet => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? undefined,
  language: dto.language,
  version: dto.version,
  content: dto.content ?? content,
  compliance: COMPLIANCE[dto.compliance],
  author: dto.ownerId,
  lintViolations: dto.lintViolations,
})

const toRule = (dto: RuleViewDto): Rule => ({
  id: dto.name,
  name: dto.name,
  isActive: dto.enabled,
  value: dto.value,
})

const toTestCase = (dto: TestCaseViewDto): TestCase => ({
  id: dto.id,
  name: dto.name,
  input: dto.inputs,
  output: dto.expectedOutputs,
  lastStatus: dto.lastStatus,
})

const toTestRunResult = (dto: TestRunResultDto): TestRunResult => ({
  testId: dto.testId ?? undefined,
  status: dto.status,
  outputs: dto.outputs,
  expectedOutputs: dto.expectedOutputs,
  errors: dto.errors,
})

const toRevalidationRun = (dto: RevalidationRunDto): RevalidationRun => dto

/** Filename from a Content-Disposition header, e.g. attachment; filename*=UTF-8''name.ps */
const filenameOf = (header: string | undefined, fallback: string): string => {
  if (!header) return fallback
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (encoded) return decodeURIComponent(encoded[1])
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain ? plain[1] : fallback
}

/** Error carrying the HTTP status, so callers can tell a 404 apart from other failures. */
export class HttpError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

const errorMessage = (error: unknown): HttpError => {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail
    return new HttpError(detail ?? error.message, error.response?.status)
  }
  return error instanceof HttpError ? error : new HttpError(String(error))
}

/**
 * Talks to snippet-handler. Every request carries the Auth0 access token obtained through the
 * given function, so the backend can authenticate the user.
 */
export class HttpSnippetOperations implements SnippetOperations {
  private readonly http: AxiosInstance

  constructor(baseURL: string, getAccessToken: () => Promise<string>) {
    this.http = axios.create({baseURL})
    this.http.interceptors.request.use(async (config) => {
      config.headers.Authorization = `Bearer ${await getAccessToken()}`
      return config
    })
  }

  private async call<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    try {
      return (await request()).data
    } catch (error) {
      throw errorMessage(error)
    }
  }

  async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string, compliance?: ComplianceEnum): Promise<PaginatedSnippets> {
    const pageDto = await this.call(() => this.http.get<PageDto<SnippetDto>>("/snippets", {
      params: {
        relation: "ALL",
        page,
        size: pageSize,
        sort: "name,asc",
        ...(snippetName ? {name: snippetName} : {}),
        ...(compliance ? {compliance: COMPLIANCE_FILTER[compliance]} : {}),
      },
    }))
    return {
      page: pageDto.number,
      page_size: pageDto.size,
      count: pageDto.totalElements,
      snippets: pageDto.content.map((dto) => toSnippet(dto)),
    }
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    if (!createSnippet.version) {
      throw new Error("Choose a language version before saving")
    }
    const dto = await this.call(() => this.http.post<SnippetDto>("/snippets", {
      name: createSnippet.name,
      description: createSnippet.description ?? null,
      language: createSnippet.language,
      version: createSnippet.version,
      content: createSnippet.content,
    }))
    return toSnippet(dto, createSnippet.content)
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    try {
      const dto = await this.call(() => this.http.get<SnippetDto>(`/snippets/${id}`))
      return toSnippet(dto)
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) return undefined
      throw error
    }
  }

  async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
    const dto = await this.call(() => this.http.put<SnippetDto>(`/snippets/${id}`, {content: updateSnippet.content}))
    return toSnippet(dto, updateSnippet.content)
  }

  async getUserFriends(name: string = "", page: number = 0, pageSize: number = 10): Promise<PaginatedUsers> {
    const users = await this.call(() => this.http.get<{id: string, name: string}[]>("/users", {
      params: {query: name, page, size: pageSize},
    }))
    const mapped: User[] = users.map((u) => ({id: u.id, name: u.name}))
    return {page, page_size: pageSize, count: mapped.length, users: mapped}
  }

  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    await this.call(() => this.http.post(`/snippets/${snippetId}/share`, {userId}))
    const snippet = await this.getSnippetById(snippetId)
    if (!snippet) throw new Error("Snippet not found after sharing")
    return snippet
  }

  async getFormatRules(): Promise<Rule[]> {
    const rules = await this.call(() => this.http.get<RuleViewDto[]>("/rules/format", {params: {language: RULES_LANGUAGE}}))
    return rules.map(toRule)
  }

  async getLintingRules(): Promise<Rule[]> {
    const rules = await this.call(() => this.http.get<RuleViewDto[]>("/rules/lint", {params: {language: RULES_LANGUAGE}}))
    return rules.map(toRule)
  }

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    return this.saveRules("/rules/format", newRules)
  }

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return this.saveRules("/rules/lint", newRules)
  }

  private async saveRules(path: string, rules: Rule[]): Promise<Rule[]> {
    const saved = await this.call(() => this.http.put<RuleViewDto[]>(path, rules.map((rule) => ({
      name: rule.name,
      enabled: rule.isActive,
      value: rule.value == null ? null : String(rule.value),
    })), {params: {language: RULES_LANGUAGE}}))
    return saved.map(toRule)
  }

  async formatSnippet(snippetContent: string, language: string, version: string): Promise<string> {
    const result = await this.call(() => this.http.post<{content: string}>("/snippets/format", {
      language,
      version,
      content: snippetContent,
    }))
    return result.content
  }

  async getTestCases(snippetId: string): Promise<TestCase[]> {
    const tests = await this.call(() => this.http.get<TestCaseViewDto[]>(`/snippets/${snippetId}/tests`))
    return tests.map(toTestCase)
  }

  async postTestCase(snippetId: string, testCase: Partial<TestCase>): Promise<TestCase> {
    const body = {
      name: testCase.name ?? "",
      inputs: testCase.input ?? [],
      expectedOutputs: testCase.output ?? [],
    }
    const dto = testCase.id
      ? await this.call(() => this.http.put<TestCaseViewDto>(`/snippets/${snippetId}/tests/${testCase.id}`, body))
      : await this.call(() => this.http.post<TestCaseViewDto>(`/snippets/${snippetId}/tests`, body))
    return toTestCase(dto)
  }

  async removeTestCase(snippetId: string, testId: string): Promise<string> {
    await this.call(() => this.http.delete(`/snippets/${snippetId}/tests/${testId}`))
    return testId
  }

  async testSnippet(snippetId: string, testCase: Partial<TestCase>): Promise<TestRunResult> {
    const dto = testCase.id
        ? await this.call(() => this.http.post<TestRunResultDto>(`/snippets/${snippetId}/tests/${testCase.id}/run`))
        : await this.call(() => this.http.post<TestRunResultDto>(`/snippets/${snippetId}/tests/preview`, {
          name: testCase.name ?? "draft",
          inputs: testCase.input ?? [],
          expectedOutputs: testCase.output ?? [],
        }))
    return toTestRunResult(dto)
  }

  async deleteSnippet(id: string): Promise<string> {
    await this.call(() => this.http.delete(`/snippets/${id}`))
    return id
  }

  async downloadSnippet(id: string, formatted: boolean): Promise<DownloadedSnippet> {
    const response = await this.http.get<Blob>(`/snippets/${id}/download`, {
      params: {formatted},
      responseType: "blob",
    }).catch((error) => {
      throw errorMessage(error)
    })
    return {
      blob: response.data,
      filename: filenameOf(response.headers["content-disposition"], `${id}.txt`),
    }
  }

  async getFileTypes(): Promise<FileType[]> {
    const languages = await this.call(() => this.http.get<LanguageInfoDto[]>("/languages"))
    return languages.map((l) => ({language: l.name, extension: l.fileExtension, versions: l.versions}))
  }

  async startRevalidation(language: string, version: string): Promise<RevalidationRun> {
    const dto = await this.call(() => this.http.post<RevalidationRunDto>(
        `/languages/${language}/versions/${version}/revalidate`
    ))
    return toRevalidationRun(dto)
  }

  async getRevalidation(runId: string): Promise<RevalidationRun> {
    const dto = await this.call(() => this.http.get<RevalidationRunDto>(`/languages/revalidations/${runId}`))
    return toRevalidationRun(dto)
  }
}
