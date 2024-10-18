import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {SnippetOperations} from "../snippetOperations.ts";
import {PaginatedUsers} from "../users.ts";
import {useCreateSnippet} from "../../hooks/useCreateSnippet.ts";


export class SnippetServiceOperations implements SnippetOperations {

    listSnippetDescriptors(page: number, pageSize: number, snippetName?: string | undefined): Promise<PaginatedSnippets> {
        console.log(page, pageSize, snippetName);
        throw new Error("Method not implemented.");
    }


    createSnippet = async (createSnippet: CreateSnippet): Promise<Snippet> => {
        const {name, content, language, extension} = createSnippet;
        try {
            return await useCreateSnippet(name, content, language, extension);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to create snippet: " + error.message);
            } else {
                throw new Error("Failed to create snippet: An unexpected error occurred");
            }
        }
    };

    getSnippetById(id: string): Promise<Snippet | undefined> {
        console.log(id);
        throw new Error("Method not implemented.");
    }

    updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        console.log(id, updateSnippet);
        throw new Error("Method not implemented.");
    }

    getUserFriends(name?: string | undefined, page?: number | undefined, pageSize?: number | undefined): Promise<PaginatedUsers> {
        console.log(name, page, pageSize);
        throw new Error("Method not implemented.");
    }

    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        console.log(snippetId, userId);
        throw new Error("Method not implemented.");
    }

    getFormatRules(): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }

    getLintingRules(): Promise<Rule[]> {
        throw new Error("Method not implemented.");
    }

    getTestCases(snippetId: string): Promise<TestCase[]> {
        console.log(snippetId);
        throw new Error("Method not implemented.");
    }

    formatSnippet(snippet: string): Promise<string> {
        console.log(snippet);
        throw new Error("Method not implemented.");
    }

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        console.log(testCase);
        throw new Error("Method not implemented.");
    }

    removeTestCase(id: string): Promise<string> {
        console.log(id);
        throw new Error("Method not implemented.");
    }

    deleteSnippet(id: string): Promise<string> {
        console.log(id);
        throw new Error("Method not implemented.");
    }

    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log(testCase);
        throw new Error("Method not implemented.");
    }

    getFileTypes(): Promise<FileType[]> {
        throw new Error("Method not implemented.");
    }

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        console.log(newRules);
        throw new Error("Method not implemented.");
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        console.log(newRules);
        throw new Error("Method not implemented.");
    }

}
