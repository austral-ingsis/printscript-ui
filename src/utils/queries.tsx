import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {SnippetOperations} from "./snippetOperations.ts";
import {PaginatedUsers} from "./users.ts";
import {FakeSnippetOperations} from "./mock/fakeSnippetOperations.ts";
import {TestCase, TestSnippetParams} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import { useWorkingSnippetOperations } from '../hooks/useWorkingSnippetOperations.ts';

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
    const snippetOperations = useWorkingSnippetOperations()
    return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName], () => snippetOperations.listSnippetDescriptors(page, pageSize));
};

export const useGetSnippetById = (id: string) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
        enabled: !!id, // This query will not execute until the id is provided
    });
};

export const useCreateSnippet = ({onSuccess}: {
    onSuccess: () => void
}): UseMutationResult<Snippet, Error, CreateSnippet> => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: { onSuccess: () => void }): UseMutationResult<Snippet, Error, {
    id: string;
    content: string;
    name: string
}> => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<Snippet, Error, { id: string; content: string, name: string }>(
        ({id, content, name}) => snippetOperations.updateSnippetById(id, content, name), {
            onSuccess,
        }
    );
};

export const useGetUsers = (snippetId: string, name: string = "", page: number = 0, pageSize: number = 10) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations.getUserFriends(snippetId,name, page, pageSize));
};

export const useShareSnippet = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<Snippet, Error, { assetId: string; userId: string, userName: string }>(
        ({assetId, userId, userName}) => snippetOperations.shareSnippet(assetId, userId, userName)
    );
};


export const useGetTestCases = (snippetId: string) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<TestCase[] | undefined, Error>('testCases', () => snippetOperations.getTestCases(snippetId), {});
};


export const usePostTestCase = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<TestCase, Error, TestSnippetParams>(
        (tc) => snippetOperations.postTestCase(tc)
    );
};


export const useRemoveTestCase = ({onSuccess}: { onSuccess: () => void }) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<string, Error, string>(
        ['removeTestCase'],
        (id) => snippetOperations.removeTestCase(id),
        {
            onSuccess,
        }
    );
};

export type TestCaseResult = {
  passed: boolean;
  error: string;
}

export const useTestSnippet = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<TestCaseResult, Error, Partial<TestCase>>(
        (tc) => snippetOperations.testSnippet(tc)
    )
}


export const useGetFormatRules = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<Rule[], Error>('formatRules', () => snippetOperations.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: { onSuccess: () => void }) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<Rule[], Error, Rule[]>(
        rule => snippetOperations.modifyFormatRule(rule),
        {onSuccess}
    );
}


export const useGetLintingRules = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<Rule[], Error>('lintingRules', () => snippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: { onSuccess: () => void }) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<Rule[], Error, Rule[]>(
        rule => snippetOperations.modifyLintingRule(rule),
        {onSuccess}
    );
}

export const useFormatSnippet = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<string, Error, string>(
        snippetContent => snippetOperations.formatSnippet(snippetContent)
    );
}

export const useDeleteSnippet = ({onSuccess}: { onSuccess: () => void }) => {
  const snippetOperations = useWorkingSnippetOperations()
    return useMutation<string, Error, string>(
        id => snippetOperations.deleteSnippet(id),
        {
            onSuccess,
        }
    );
}


export const useGetFileTypes = () => {
  const snippetOperations = useWorkingSnippetOperations()
    return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes());
}