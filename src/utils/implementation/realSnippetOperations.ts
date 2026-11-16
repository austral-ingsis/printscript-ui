import {SnippetOperations} from "../snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
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
} from "./apiResponses.ts";


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

    getTestCases(): Promise<TestCase[]> {
        // backend solo tiene POST /snippet/{id}/test (crear); no hay GET/DELETE/ejecución ni "name" de test case
        return this.fallback.getTestCases();
    }

    getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        // falta un endpoint de búsqueda/listado de usuarios (no existe en snippet-service ni permissions-service)
        return this.fallback.getUserFriends(name, page, pageSize);
    }

    listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
        // falta GET /snippet (listado paginado) en snippet-service
        return this.fallback.listSnippetDescriptors(page, pageSize);
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

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        // delegado junto con getTestCases/removeTestCase/testSnippet (ver comentario en getTestCases);
        // TestCase del frontend tampoco tiene snippetId, que el endpoint real necesitaría en la URL
        return this.fallback.postTestCase(testCase as TestCase);
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

    testSnippet(): Promise<TestCaseResult> {
        // no existe endpoint de ejecución de tests en el backend
        return this.fallback.testSnippet();
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const body: UpdateSnippetRequest = {content: updateSnippet.content};
        const res = await this.api.put<SnippetResponse>(`/snippet/${id}`, body);
        return this.toSnippet(res.data, "ps"); // provisorio: confirmá el valor en fakeSnippetStore.ts
    }

}
