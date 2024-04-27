import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from './snippet.ts';
import {SnippetOperations} from "./snippetOperations.ts";
import {PaginatedUsers} from "./users.ts";
import {SnippetOperationsImpl} from "./snippetOperations.impl.ts";

const snippetOperations: SnippetOperations = new SnippetOperationsImpl();

export const useGetSnippets = (page: number = 0, pageSize: number = 10) => {
  return useQuery<PaginatedSnippets, Error>(['snippetDescriptors',page,pageSize], () => snippetOperations.listSnippetDescriptors(page, pageSize));
};

export const useGetSnippetById = (id: string) => {
  return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
    enabled: !!id, // This query will not execute until the id is provided
  });
};

export const useCreateSnippet = (): UseMutationResult<SnippetDescriptor, Error, CreateSnippet> => {
  return useMutation<SnippetDescriptor, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet));
};

export const useUpdateSnippetById = (): UseMutationResult<SnippetDescriptor, Error, {
  id: string;
  updateSnippet: UpdateSnippet
}> => {
  return useMutation<SnippetDescriptor, Error, { id: string; updateSnippet: UpdateSnippet }>(
      ({id, updateSnippet}) => snippetOperations.updateSnippetById(id, updateSnippet)
  );
};

export const useGetUsers = (name: string = "", page: number = 0, pageSize: number = 10) => {
  return useQuery<PaginatedUsers, Error>(['users',name,page,pageSize], () => snippetOperations.getUserFriends(name,page, pageSize));
};

export const useShareSnippet = () => {
  return useMutation<Snippet, Error, { snippetId: string; userId: string }>(
      ({snippetId, userId}) => snippetOperations.shareSnippet(snippetId, userId)
  );
};
