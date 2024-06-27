import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {PaginatedUsers} from "./users.ts";
import {TestCase, TestSnippetParams} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import { WorkingSnippetOperations } from './mock/workingSnippetOperations.ts';
import { FormatRule, LintRule } from '../types/Rule.ts';

const snippetOperations = new WorkingSnippetOperations();

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
    return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName], () => snippetOperations.listSnippetDescriptors(page, pageSize));
};

export const useGetSnippetById = (id: string) => {
    return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
        enabled: !!id, // This query will not execute until the id is provided
    });
};

export const useCreateSnippet = ({onSuccess}: {
    onSuccess: () => void
}): UseMutationResult<Snippet, Error, CreateSnippet> => {
    return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: { onSuccess: () => void }): UseMutationResult<Snippet, Error, {
    id: string;
    content: string;
    name: string
}> => {
    return useMutation<Snippet, Error, { id: string; content: string, name: string }>(
        ({id, content, name}) => snippetOperations.updateSnippetById(id, content, name), {
            onSuccess,
        }
    );
};

export const useGetUsers = (snippetId: string, name: string = "", page: number = 0, pageSize: number = 10) => {
    return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations.getUserFriends(snippetId,name, page, pageSize));
};

export const useShareSnippet = () => {
    return useMutation<Snippet, Error, { assetId: string; userId: string, userName: string }>(
        ({assetId, userId, userName}) => snippetOperations.shareSnippet(assetId, userId, userName)
    );
};


export const useGetTestCases = (snippetId: string) => {
    return useQuery<TestCase[] | undefined, Error>('testCases', () => snippetOperations.getTestCases(snippetId), {});
};


export const usePostTestCase = () => {
    return useMutation<TestCase, Error, TestSnippetParams>(
        (tc) => snippetOperations.postTestCase(tc)
    );
};


export const useRemoveTestCase = ({onSuccess}: { onSuccess: () => void }) => {
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
    return useMutation<TestCaseResult, Error, Partial<TestCase>>(
        (tc) => snippetOperations.testSnippet(tc)
    )
}


export const useGetFormatRules = () => {
    return useQuery<FormatRule[], Error>('formatRules', () => snippetOperations.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<FormatRule[], Error, FormatRule[]>(
        rule => snippetOperations.modifyFormatRule(rule),
        {onSuccess}
    );
}


export const useGetLintingRules = () => {
    return useQuery<LintRule[], Error>('lintingRules', () => snippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<LintRule[], Error, LintRule[]>(
        rule => snippetOperations.modifyLintingRule(rule),
        {onSuccess}
    );
}

export const useFormatSnippet = () => {
    return useMutation<string, Error, string>(
        snippetContent => snippetOperations.formatSnippet(snippetContent)
    );
}

export const useDeleteSnippet = ({onSuccess}: { onSuccess: () => void }) => {
    return useMutation<string, Error, string>(
        id => snippetOperations.deleteSnippet(id),
        {
            onSuccess,
        }
    );
}


export const useGetFileTypes = () => {
    return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes());
}