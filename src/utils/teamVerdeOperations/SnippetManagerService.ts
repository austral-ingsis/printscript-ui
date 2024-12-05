import { fetchAllUserSnippets } from "../../hooks/fetchAllUserSnippets";
import { CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet } from "../../utils/snippet";
import { fetchSnippetById } from "../../hooks/fetchSnippetById";
import { createSnippetFunction } from "../../hooks/createSnippetFunction";
import { updateSnippetFunction } from "../../hooks/updateSnippetFunction";
import axios from "axios";
import { Rule } from "../../types/Rule";
import {toast} from "react-toastify";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {TestResponse} from "../../hooks/TestResponse.ts";
import {UpdateSnippetResponse} from "../../hooks/UpdateSnippetResponse.ts";
import { FileType } from "../../types/FileType.ts";
import api from "./api.ts";

const DELAY: number = 1000;

export class SnippetManagerService {


    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        return await createSnippetFunction(createSnippet, token) as Snippet;
    }

    public static async fetchAllUserSnippets(id: string): Promise<Snippet[]> {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            return await fetchAllUserSnippets(id, token) as Snippet[];
        } catch (error) {
            console.error('Error fetching all user snippets:', error);
            return [];
        }
    }

    async fetchSnippetById(id: string): Promise<Snippet> {
        try {
            localStorage.setItem("snippetId", id);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            return await fetchSnippetById(id, token) as Snippet;
        } catch (error) {
            console.error('Error fetching snippet by ID:', error);
            throw error;
        }
    }

    async listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const userSnippets = await SnippetManagerService.fetchAllUserSnippets("USER_ID");
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;

        const response: PaginatedSnippets = {
            page,
            page_size: pageSize,
            count: userSnippets.length,
            snippets: userSnippets.slice(startIndex, endIndex),
        };

        return new Promise(resolve => {
            setTimeout(() => resolve(response), DELAY);
        });
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<UpdateSnippetResponse> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        return await updateSnippetFunction(id, updateSnippet, token);
    }

    async deleteSnippet(id: string): Promise<string> {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            await api.delete(`snippets/delete/${id}`);
            return `Successfully deleted snippet of id: ${id}`;
        } catch (error) {
            console.error('Error deleting snippet:', error);
            throw error;
        }
    }

    async shareSnippet(snippetId: string, userId: string): Promise<any> {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            // Realizar la solicitud POST al backend
            const response = await api.post(
                `snippets/share`,
                { snippetId, userId });
            toast.success("Snippet shared successfully!");
            return response.data; // Retorna el objeto de respuesta desde el backend
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    toast.error("You do not have permission to share this snippet.");
                } else if (error.response?.status === 404) {
                    toast.error("Snippet not found.");
                } else {
                    toast.error(error.response?.data?.message || "An error occurred while sharing the snippet.");
                }
            } else {
                toast.error("An unexpected error occurred");
            }
            console.error("Error sharing snippet:", error);
            throw error;
        }
    }

    async getFormattingRules(): Promise<Rule[]> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get('snippets/getFormattingRules');
        return response.data as Promise<Rule[]>;
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        console.log(newRules);
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        return await api.post('snippets/modifyFormattingRules', newRules).then(response => response.data);
    }

    async getLintingRules(): Promise<Rule[]> {
        console.log("Getting linting rules checkpoint 1");
        const token = localStorage.getItem("token");
        console.log("Getting linting rules checkpoint 2, token: ", token);
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get('snippets/getLintingRules');
        console.log("Getting linting rules checkpoint 3, response: ", response.data);
        return response.data as Promise<Rule[]>;
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        console.log(newRules);
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        return await api.post('snippets/modifyLintingRules', newRules).then(response => response.data);
    }
    async formatSnippet(snippetId: string, snippetContent: string): Promise<string> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        const formattingRequest = {
            snippetId, // Clave: snippetId
            content: snippetContent, // Clave: content
        };

        return axios
            .post("https://teamverde.westus2.cloudapp.azure.com/snippets/formatSnippet", formattingRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Asegúrate de usar JSON como formato
                },
            })
            .then(response => response.data)
            .catch(error => {
                console.error("Error formatting snippet:", error);
                throw error;
            });
    }


    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        if (!snippetId) {
            throw new Error("SnippetId is needed to show snippet's tests");
        }
        const response = await api.get(`snippets/api/test/snippet/${snippetId}`);
        return Array.isArray(response.data) ? response.data : [];
    }

    async postTestCase(testCase: Partial<TestCase>, snippetId: string): Promise<TestResponse> {
        const token = localStorage.getItem("token");
        console.log("Posting test case:", testCase);
        if (!token) {
            throw new Error("No token found");
        }
        if (!snippetId) {
            throw new Error("SnippetId is needed to post a test case");
        }
        console.log("mandando al backend los siguientes datos: ", testCase, snippetId);
        const response = await api.post<TestResponse>(
            `snippets/api/test/snippet/${snippetId}`,
            testCase
        );
        console.log(response.data);
        return response.data;
    }

    async removeTestCase(testId: string): Promise<string> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        if (!testId) {
            throw new Error("TestCaseId is needed to remove a test case");
        }
        const response = await api.delete(`snippets/api/test/${testId}`);
        console.log(`test with id: ${testId} removed`)
        return response.data;
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log("Sending to backend:", { input: testCase.input, output: testCase.output });
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }

        if (!testCase.id) {
            throw new Error("Test ID is required to run a test");
        }

        const response = await api.post(
            `snippets/api/test/${testCase.id}/run`,
            { input: testCase.input, output: testCase.output }
        );

        console.log(response.data as TestCaseResult)
        return response.data as TestCaseResult;
    }


    async runAllTests(snippetId: string): Promise<any> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        console.log("Running all tests for snippet:", snippetId);
        try {
            const response = await api.post(
                `snippets/api/test/${snippetId}/all`);

            if (response.status === 200) {
                console.log("response", response.data);
                localStorage.setItem("allTestResults", JSON.stringify(response.data));
                return response.data; // Ensure this matches the backend response
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error: any) {
            console.error("Error in runAllTests:", error.response || error.message);
            throw new Error(error.response?.data?.message || "Failed to run all tests");
        }
    }

    getFileTypes(): FileType[] {
    return [
        {
            language: "printscript",
            extension: "prs"
        }
    ];
}
}
