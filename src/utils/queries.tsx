import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {SnippetManagerService} from "./teamVerdeOperations/SnippetManagerService.ts";
import {UpdateSnippetResponse} from "../hooks/UpdateSnippetResponse.ts";
import {TestResponse} from "../hooks/TestResponse.ts";
import api from "./teamVerdeOperations/api.ts";


export const useSnippetsOperations = () => {
    const { getAccessTokenSilently } = useAuth0()
    useEffect(() => {
        getAccessTokenSilently()
            .then(token => {
                localStorage.setItem('token', token)
            })
    });}

const realSnippetOperations: SnippetManagerService = new SnippetManagerService();



export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
    useSnippetsOperations()
    return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName], () => realSnippetOperations.listSnippetDescriptors(page, pageSize), {});
};


export const useGetSnippetById = (id: string) => {
    //çconst snippetOperations = useSnippetsOperations()
    return useQuery<Snippet | [], Error>(['snippet', id], () => realSnippetOperations.fetchSnippetById(id), {
        enabled: !!id, // This query will not execute until the id is provided
    });
};

export const useCreateSnippet = ({ onSuccess, onError }: { onSuccess: () => void, onError: (error: any) => void }): UseMutationResult<Snippet, Error, CreateSnippet> => {
    return useMutation<Snippet, Error, CreateSnippet>(
        createSnippet => realSnippetOperations.createSnippet(createSnippet),
        { onSuccess, onError }
    );
};

export const useUpdateSnippetById = ({ onSuccess }: { onSuccess: () => void }): UseMutationResult<UpdateSnippetResponse, Error, { id: string; updateSnippet: UpdateSnippet }> => {
    return useMutation<UpdateSnippetResponse, Error, { id: string; updateSnippet: UpdateSnippet }>(
        ({ id, updateSnippet }) => realSnippetOperations.updateSnippetById(id, updateSnippet), {
            onSuccess,
        }
    );
};


export const useDeleteSnippet = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<string, Error, string>(
        id => realSnippetOperations.deleteSnippet(id),
        {
            onSuccess,
        }
    );
}


export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10) => {
    return useQuery(['users', name, page, pageSize], async () => {
        const response = await api.get(`snippets/api/auth0/users`, {
            params: { nickname: name, page, perPage: pageSize },
        });
        return response.data;
    });
};

export const useShareSnippet = () => {
    return useMutation<Snippet, Error, { snippetId: string; userId: string }>(
        ({snippetId, userId}) => realSnippetOperations.shareSnippet(snippetId, userId)
    );
};


export const useGetTestCases = (snippetId: string) => {
    return useQuery<TestCase[] | undefined, Error>(
        ['testCases', snippetId],
        () => realSnippetOperations.getTestCases(snippetId),
        {}
    );
};

export const usePostTestCase = (snippetId: string) => {
    return useMutation<TestResponse, Error, Partial<TestCase>>(
        (tc) => realSnippetOperations.postTestCase(tc, snippetId)
    );
};

export const useRemoveTestCase = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<string, Error, string>(
        ['removeTestCase'],
        (id) => realSnippetOperations.removeTestCase(id),
            {
                onSuccess,
            }
    );
};

export type TestCaseResult = "test passed" | "test failed"

export const useTestSnippet = () => {
    return useMutation<TestCaseResult, Error, Partial<TestCase>>(
        (tc) => realSnippetOperations.testSnippet(tc)
    )
}

export const useRunAllSnippetTests = (snippetId: string) => {
    return useMutation<string[], Error>(
        () => realSnippetOperations.runAllTests(snippetId)
    );
};


export const useGetFormatRules = () => {
    return useQuery<Rule[], Error>('formatRules', () =>  realSnippetOperations.getFormattingRules());
}

export const useModifyFormatRules = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<Rule[], Error, Rule[]>(
        rule => realSnippetOperations.modifyFormatRule(rule),
        {onSuccess}
    );
}


export const useGetLintingRules = () => {
    return useQuery<Rule[], Error>('lintingRules', () => realSnippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<Rule[], Error, Rule[]>(
        rule => realSnippetOperations.modifyLintingRule(rule),
        {onSuccess}
    );
}

export const useFormatSnippet = () => {
    return useMutation<string, Error, { id: string, content: string }>(
        ({id, content}) => realSnippetOperations.formatSnippet(id, content)
    );
}

export const useGetFileTypes = () => {
    return useQuery<FileType[], Error>('fileTypes', () => realSnippetOperations.getFileTypes());
}
export const useCheckIfOwner = (email: string | undefined) => {
    const {user} = useAuth0();
    if (!email || !user) return false;
    return user.email === email
}

export const useRunAllTests = (id: string) => {
    const snippetOperations = realSnippetOperations;

    return useMutation<Map<string, string[]>, Error>(
        () => snippetOperations.runAllTests(id)
    );
};