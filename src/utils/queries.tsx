import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, Snippet, SnippetDescriptor, UpdateSnippet} from './snippet.ts';
import {SnippetOperations} from "./snippetOperations.ts";
import {FakeSnippetOperations} from "./mock/fakeSnippetOperations.ts";

const snippetOperations: SnippetOperations = new FakeSnippetOperations();

export const useGetSnippetDescriptors = () => {
  return useQuery<SnippetDescriptor[], Error>('snippetDescriptors', snippetOperations.listSnippetDescriptors);
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
