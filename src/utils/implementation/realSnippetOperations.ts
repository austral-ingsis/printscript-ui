import {SnippetOperations} from "../snippetOperations.ts";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, ShareRole, Snippet, UpdateSnippet} from "../snippet.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {TestCase} from "../../types/TestCase.ts";
import {PaginatedUsers} from "../users.ts";
import type {TestCaseResult} from "../queries.tsx";
import {createApiClient} from "./apiClient.ts";
import {PERMISSIONS_URL} from "../constants.ts";
import {AxiosInstance} from "axios";
import {
    FormatRulesResponse,
    LintRulesResponse,
    UpdateLintRulesRequest,
    FormatJobAcceptedResponse,
    JobStatusResponse,
    UpdateFormatRulesRequest,
    ActiveFormatRulesResponse,
    SnippetResponse,
    CreateSnippetRequest,
    UpdateSnippetRequest,
    CreateSnippetTestRequest,
    SnippetTestResponse,
    TestListItemResponse,
    RunTestsRequest,
    RunTestsResponse,
    TestStatusResponse,
    PaginatedSnippetsResponse,
    SnippetSummaryResponse,
    PaginatedUsersResponse,
    ShareSnippetRequest,
    LanguageResponse,
} from "./apiResponses.ts";

const toComplianceEnum = (status: string): ComplianceEnum => {
    switch (status) {
        case "COMPLIANT": return "compliant";
        case "NON_COMPLIANT": return "not-compliant";
        case "FAILED": return "failed";
        default: return "pending";
    }
};

export class RealSnippetOperations implements SnippetOperations {
    private api: AxiosInstance;
    // snippet-service no expone todo: lo de permisos/usuarios vive en permissions-service,
    // detrás de otra base URL (en la VM, nginx lo enruta via /api/permissions/*).
    private permissionsApi: AxiosInstance;

    constructor(getAccessTokenSilently: () => Promise<string>) {
        this.api = createApiClient(getAccessTokenSilently)
        this.permissionsApi = createApiClient(getAccessTokenSilently, PERMISSIONS_URL)
    }

    private toSnippet(s: SnippetResponse, extension: string): Snippet {
        return {
            id: s.id,
            name: s.title,
            description: s.description ?? undefined,
            content: s.content,
            language: s.language,
            version: s.languageVersion,
            extension,
            author: s.ownerId,
            compliance: "pending",
        };
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const body: CreateSnippetRequest = {
            title: createSnippet.name,
            description: createSnippet.description,
            language: createSnippet.language,
            languageVersion: createSnippet.version,
            content: createSnippet.content,
        };
        const res = await this.api.post<SnippetResponse>('/snippet', body);
        return this.toSnippet(res.data, createSnippet.extension);
    }

    async deleteSnippet(id: string): Promise<string> {
        await this.api.delete(`/snippet/${id}`);
        return id;
    }

    async formatSnippet(snippetId: string): Promise<string> {
        // Formatea el contenido ya guardado en el backend, no lo que haya sin guardar en el editor;
        // si hay ediciones pendientes, se ignoran (se formatea la última versión persistida).
        const jobRes = await this.api.post<FormatJobAcceptedResponse>(`/format/${snippetId}`);
        const jobId = jobRes.data.jobId;

        for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(r => setTimeout(r, 1000));
            const res = await this.api.get<JobStatusResponse>(`/jobs/${jobId}`);
            if (res.data.status === "DONE") {
                const snippet = await this.getSnippetById(snippetId);
                if (!snippet) throw new Error(`Snippet ${snippetId} not found after formatting`);
                return snippet.content;
            }
            if (res.data.status === "FAILED") throw new Error("El formateo falló");
        }
        throw new Error("Timeout esperando el resultado del formateo");
    }

    async getFileTypes(): Promise<FileType[]> {
        const res = await this.api.get<LanguageResponse[]>('/languages');
        return res.data.flatMap((lang) =>
            lang.fileTypes.map((extension) => ({
                language: lang.language,
                extension,
            })),
        );
    }

    async getFormatRules(): Promise<Rule[]> {
        const res = await this.api.get<FormatRulesResponse>('format/rules')
        const activeByRuleId = new Map(res.data.activeRules.map(a => [a.ruleId, a.value]));
        return res.data.rules.map(r => ({
            id: String(r.id),
            name: r.name,
            isActive: activeByRuleId.has(r.id),
            value: activeByRuleId.has(r.id) ? activeByRuleId.get(r.id) : r.defaultValue,
        }));
    }

    async getLintingRules(): Promise<Rule[]> {
        const res = await this.api.get<LintRulesResponse>('lint/rules')
        const activeByRuleId = new Map(res.data.activeRules.map(a => [a.ruleId, a.value]));
        return res.data.rules.map(r => ({
            id: String(r.id),
            name: r.name,
            isActive: activeByRuleId.has(r.id),
            value: activeByRuleId.has(r.id) ? activeByRuleId.get(r.id) : r.defaultValue,
        }));
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const res = await this.api.get<SnippetResponse>(`/snippet/${id}`);
        return this.toSnippet(res.data, "ps"); // provisorio: confirmá el valor en fakeSnippetStore.ts
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const res = await this.api.get<TestListItemResponse[]>('/tests', {params: {snippetId}});
        return res.data.map((t) => ({
            id: t.id,
            name: t.name,
            input: t.inputs,
            output: t.outputs,
        }));
    }

    async getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        const res = await this.permissionsApi.get<PaginatedUsersResponse>('/users', {
            params: {name, page, pageSize},
        });
        return res.data;
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        const res = await this.api.get<PaginatedSnippetsResponse>('/snippet', {
            params: {page, pageSize, name: snippetName},
        });
        return {
            page: res.data.page,
            page_size: res.data.pageSize,
            count: res.data.total,
            snippets: res.data.snippets.map(this.toSnippetSummary),
        };
    }

    private toSnippetSummary(s: SnippetSummaryResponse): Snippet {
        return {
            id: s.snippetId,
            name: s.title,
            content: "",
            language: s.language,
            version: s.languageVersion,
            extension: "ps",
            author: s.author,
            compliance: toComplianceEnum(s.compliance),
        };
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const selections = newRules
            .filter(r => r.isActive)
            .map(r => ({
                ruleId: Number(r.id),
                value: typeof r.value === 'number' ? r.value : null,
            }));
        const body: UpdateFormatRulesRequest = {rules: selections};
        await this.api.put<ActiveFormatRulesResponse>('/format/rules', body);
        return newRules;

    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const selections = newRules
            .filter(r => r.isActive)
            .map(r => ({
                ruleId: Number(r.id),
                value: typeof r.value === 'string' ? r.value : null,
            }));
        const body: UpdateLintRulesRequest = {rules: selections};
        await this.api.put('/lint/rules', body);
        return newRules;
    }

    async postTestCase(snippetId: string, testCase: Partial<TestCase>): Promise<TestCase> {
        const body: CreateSnippetTestRequest = {
            name: testCase.name ?? "Test",
            inputs: testCase.input ?? [],
            outputs: testCase.output ?? [],
            id: testCase.id,
        };
        const res = await this.api.post<SnippetTestResponse>(`/snippet/${snippetId}/test`, body);
        return {id: res.data.id, name: res.data.name, input: body.inputs, output: body.outputs};
    }

    async removeTestCase(id: string): Promise<string> {
        await this.api.delete(`/snippet/test/${id}`);
        return id;
    }

    async shareSnippet(snippetId: string, userId: string, role: ShareRole): Promise<void> {
        const body: ShareSnippetRequest = {userId, role};
        await this.permissionsApi.post(`/snippets/${snippetId}/members`, body);
    }

    async testSnippet(snippetId: string, testCase: Partial<TestCase>): Promise<TestCaseResult> {
        if (!testCase.id) throw new Error("No se puede correr un test case que todavía no fue guardado");

        const runBody: RunTestsRequest = {snippetId, selection: {type: "SELECTED", testIds: [testCase.id]}};
        await this.api.post<RunTestsResponse>('/tests/run', runBody);

        for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(r => setTimeout(r, 1000));
            const res = await this.api.get<TestStatusResponse[]>('/tests/statuses', {params: {snippetId}});
            const status = res.data.find(s => s.id === testCase.id)?.status;
            if (status === "PASSED") return "success";
            if (status === "FAILED" || status === "ERROR") return "fail";
        }
        throw new Error("Timeout esperando el resultado del test");
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const body: UpdateSnippetRequest = {content: updateSnippet.content};
        const res = await this.api.put<SnippetResponse>(`/snippet/${id}`, body);
        return this.toSnippet(res.data, "ps"); // provisorio: confirmá el valor en fakeSnippetStore.ts
    }

}
