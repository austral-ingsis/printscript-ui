import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, ShareRole, Snippet, UpdateSnippet} from './snippet.ts';
import {PaginatedUsers} from "./users.ts";
import {RealSnippetOperations} from "./implementation/realSnippetOperations.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useMemo} from "react";


export const useSnippetsOperations = () => {
  const {getAccessTokenSilently} = useAuth0();

  return useMemo(
    () => new RealSnippetOperations(getAccessTokenSilently),
    [getAccessTokenSilently],
  );
}

export const useGetSnippets = (page: number = 0, pageSize: number = 10, snippetName?: string) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<PaginatedSnippets, Error>(['listSnippets', page,pageSize,snippetName], () => snippetOperations.listSnippetDescriptors(page, pageSize,snippetName));
};

export const useGetSnippetById = (id: string) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
    enabled: !!id, // This query will not execute until the id is provided
  });
};

export type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreateSnippet = ({onSuccess, onError}: MutationCallbacks): UseMutationResult<Snippet, Error, CreateSnippet> => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess, onError});
};

export const useUpdateSnippetById = ({onSuccess, onError}: MutationCallbacks): UseMutationResult<Snippet, Error, {
  id: string;
  updateSnippet: UpdateSnippet
}> => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Snippet, Error, { id: string; updateSnippet: UpdateSnippet }>(
      ({id, updateSnippet}) => snippetOperations.updateSnippetById(id, updateSnippet),{
        onSuccess,
        onError,
    }
  );
};

export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10, enabled: boolean = true) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<PaginatedUsers, Error>(['users', name, page, pageSize], () => snippetOperations.getUserFriends(name, page, pageSize), {
    enabled,
  });
};

export const useShareSnippet = (callbacks?: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<void, Error, { snippetId: string; userId: string; role: ShareRole }>(
      ({snippetId, userId, role}) => snippetOperations.shareSnippet(snippetId, userId, role),
      callbacks
  );
};


export const useGetTestCases = (snippetId: string) => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<TestCase[] | undefined, Error>(['testCases', snippetId], () => snippetOperations.getTestCases(snippetId), {
    enabled: !!snippetId,
  });
};


export const usePostTestCase = ({onSuccess, onError}: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<TestCase, Error, { snippetId: string; testCase: Partial<TestCase> }>(
      ({snippetId, testCase}) => snippetOperations.postTestCase(snippetId, testCase),
      {onSuccess, onError}
  );
};


export const useRemoveTestCase = ({onSuccess, onError}: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      ['removeTestCase'],
      (id) => snippetOperations.removeTestCase(id),
      {
        onSuccess,
        onError,
      }
  );
};

export type TestCaseResult = "success" | "fail"

export const useTestSnippet = (callbacks?: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<TestCaseResult, Error, { snippetId: string; testCase: Partial<TestCase> }>(
      ({snippetId, testCase}) => snippetOperations.testSnippet(snippetId, testCase),
      callbacks
  )
}



export const useGetFormatRules = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Rule[], Error>('formatRules', () => snippetOperations.getFormatRules(), {
    staleTime: 5 * 60_000,
  });
}

export const useModifyFormatRules = ({onSuccess, onError}: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyFormatRule(rule),
      {onSuccess, onError}
  );
}


export const useGetLintingRules = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<Rule[], Error>('lintingRules', () => snippetOperations.getLintingRules(), {
    staleTime: 5 * 60_000,
  });
}


export const useModifyLintingRules = ({onSuccess, onError}: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyLintingRule(rule),
      {onSuccess, onError}
  );
}

export const useFormatSnippet = (callbacks?: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      snippetId => snippetOperations.formatSnippet(snippetId),
      callbacks
  );
}

export const useDeleteSnippet = ({onSuccess, onError}: MutationCallbacks) => {
  const snippetOperations = useSnippetsOperations()

  return useMutation<string, Error, string>(
      id => snippetOperations.deleteSnippet(id),
      {
        onSuccess,
        onError,
      }
  );
}


export const useGetFileTypes = () => {
  const snippetOperations = useSnippetsOperations()

  return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes(), {
    staleTime: 5 * 60_000,
  });
}