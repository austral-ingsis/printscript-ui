import {SnippetOperations} from "../snippetOperations.ts";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {TestCase} from "../../types/TestCase.ts";
import {PaginatedUsers} from "../users.ts";
import type {TestCaseResult} from "../queries.tsx";
import {createApiClient} from "./apiClient.ts";
import {AxiosInstance} from "axios";
import {FakeSnippetOperations} from "../mock/fakeSnippetOperations.ts";
import {
    FormatRulesResponse,
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
    // Operaciones sin endpoint real en el backend hoy: se delegan al mock para no romper la UI.
    private readonly fallback = new FakeSnippetOperations();

    constructor(getAccessTokenSilently: () => Promise<string>) {
        this.api = createApiClient(getAccessTokenSilently)
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

    deleteSnippet(id: string): Promise<string> {
        // falta DELETE /snippet/{id} en snippet-service
        return this.fallback.deleteSnippet(id);
    }

    formatSnippet(snippet: string): Promise<string> {
        // POST /format/{id} es asíncrono (202 {jobId}) sin endpoint para consultar el resultado;
        // no se puede exponer como Promise<string> síncrona todavía
        return this.fallback.formatSnippet(snippet);
    }

    getFileTypes(): Promise<FileType[]> {
        // falta catálogo de lenguajes/extensiones soportadas; hoy solo "printscript" está hardcodeado server-side
        return this.fallback.getFileTypes();
    }

    async getFormatRules(): Promise<Rule[]> {
        const res = await this.api.get<FormatRulesResponse>('format/rules')
        const rules = res.data.rules.map(r => ({
            id: String(r.id),
            name: r.name,
            isActive: false, // falta implementar el endpoint GET activeFormatRules en la api
            value: r.defaultValue,
        }));
        return rules
    }

    getLintingRules(): Promise<Rule[]> {
        // falta GET /lint/rules (catálogo) en snippet-service; solo existe PUT /lint/rules (escritura)
        return this.fallback.getLintingRules();
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const res = await this.api.get<SnippetResponse>(`/snippet/${id}`);
        return this.toSnippet(res.data, "ps"); // provisorio: confirmá el valor en fakeSnippetStore.ts
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const res = await this.api.get<TestListItemResponse[]>('/tests', {params: {snippetId}});
        return res.data.map((t, i) => ({
            id: t.id,
            name: `Test ${i + 1}`,
            input: t.inputs,
            output: t.outputs,
        }));
    }

    getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        // falta un endpoint de búsqueda/listado de usuarios (no existe en snippet-service ni permissions-service)
        return this.fallback.getUserFriends(name, page, pageSize);
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

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        // delegado junto con getLintingRules: sin el catálogo real, los ruleId mostrados en la UI
        // serían del fake y no matchean los ids reales del backend (el PUT real respondería 400 unknownRuleIds)
        return this.fallback.modifyLintingRule(newRules);
    }

    async postTestCase(snippetId: string, testCase: Partial<TestCase>): Promise<TestCase> {
        const body: CreateSnippetTestRequest = {
            inputs: testCase.input ?? [],
            outputs: testCase.output ?? [],
        };
        const res = await this.api.post<SnippetTestResponse>(`/snippet/${snippetId}/test`, body);
        return {id: res.data.id, name: testCase.name ?? "", input: body.inputs, output: body.outputs};
    }

    removeTestCase(id: string): Promise<string> {
        // no existe DELETE de test case en el backend
        return this.fallback.removeTestCase(id);
    }

    shareSnippet(snippetId: string): Promise<Snippet> {
        // falta GET /roles en permissions-service para resolver el roleId (UUID por entorno, no descubrible);
        // además la firma actual no recibe rol, y permissions-service lo exige en POST /snippets/{id}/members
        return this.fallback.shareSnippet(snippetId);
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
