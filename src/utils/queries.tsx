import {useMemo} from 'react';
import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {useAuth0} from "@auth0/auth0-react";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {DownloadedSnippet, RevalidationRun, SnippetOperations} from "./snippetOperations.ts";
import {HttpSnippetOperations} from "./http/HttpSnippetOperations.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCase, TestRunResult} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";

/** Base URL of snippet-handler, e.g. http://localhost:8080 (no trailing /api). */
const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export const useSnippetsOperations = (): SnippetOperations => {
  const {getAccessTokenSilently} = useAuth0();

  return useMemo(
      () => new HttpSnippetOperations(BACKEND_URL, () => getAccessTokenSilently()),
      [getAccessTokenSilently]
  );
};

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string, compliance?: ComplianceEnum) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<PaginatedSnippets, Error>(['listSnippets', page, pageSize, snippetName, compliance], () => snippetOperations.listSnippetDescriptors(page, pageSize, snippetName, compliance));
};

export const useGetSnippetById = (id: string) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
    enabled: !!id, // This query will not execute until the id is provided
  });
};

export const useCreateSnippet = ({onSuccess}: {onSuccess: () => void}): UseMutationResult<Snippet, Error, CreateSnippet> => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: {onSuccess: () => void}): UseMutationResult<Snippet, Error, {
  id: string;
  updateSnippet: UpdateSnippet
}> => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Snippet, Error, { id: string; updateSnippet: UpdateSnippet }>(
      ({id, updateSnippet}) => snippetOperations.updateSnippetById(id, updateSnippet),{
        onSuccess,
    }
  );
};

export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations.getUserFriends(name, page, pageSize), {
    enabled: name.trim().length > 0, // an empty search would not find anybody
    keepPreviousData: true,
  });
};

export const useShareSnippet = () => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Snippet, Error, { snippetId: string; userId: string }>(
      ({snippetId, userId}) => snippetOperations.shareSnippet(snippetId, userId)
  );
};


export const useGetTestCases = (snippetId: string) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<TestCase[] | undefined, Error>(['testCases', snippetId], () => snippetOperations.getTestCases(snippetId), {
    enabled: !!snippetId,
  });
};


export const usePostTestCase = (snippetId: string) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<TestCase, Error, Partial<TestCase>>(
      (tc) => snippetOperations.postTestCase(snippetId, tc)
  );
};


export const useRemoveTestCase = (snippetId: string, {onSuccess}: {onSuccess: () => void}) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      (testId) => snippetOperations.removeTestCase(snippetId, testId),
      {
        onSuccess,
      }
  );
};

export type TestCaseResult = "success" | "fail"

export const useTestSnippet = (snippetId: string) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<TestRunResult, Error, Partial<TestCase>>(
      (tc) => snippetOperations.testSnippet(snippetId, tc)
  )
}



export const useGetFormatRules = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Rule[], Error>('formatRules', () => snippetOperations.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: {onSuccess: () => void}) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyFormatRule(rule),
      {onSuccess}
  );
}


export const useGetLintingRules = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Rule[], Error>('lintingRules', () => snippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: {onSuccess: () => void}) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyLintingRule(rule),
      {onSuccess}
  );
}

export const useFormatSnippet = (language: string, version: string) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      snippetContent => snippetOperations.formatSnippet(snippetContent, language, version)
  );
}

export const useDownloadSnippet = () => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<DownloadedSnippet, Error, {id: string; formatted: boolean}>(
      ({id, formatted}) => snippetOperations.downloadSnippet(id, formatted)
  );
}

export const useDeleteSnippet = ({onSuccess}: {onSuccess: () => void}) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      id => snippetOperations.deleteSnippet(id),
      {
        onSuccess,
      }
  );
}


export const useGetFileTypes = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes());
}

export const useStartRevalidation = () => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<RevalidationRun, Error, {language: string; version: string}>(
      ({language, version}) => snippetOperations.startRevalidation(language, version)
  );
}

/** Polls the run every 2 seconds until the caller disables it (once it completed). */
export const useGetRevalidation = (runId: string | undefined, polling: boolean) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<RevalidationRun, Error>(
      ['revalidation', runId],
      () => snippetOperations.getRevalidation(runId ?? ""),
      {enabled: !!runId, refetchInterval: polling ? 2000 : false}
  );
}
