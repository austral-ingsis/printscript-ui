import {Snippet} from "../utils/snippet";
import api from "../utils/teamVerdeOperations/api.ts";

export const fetchSnippetById = async (id: string, token: string): Promise<Snippet | null> => {
  try {
    const response = await api.get(`snippets/user/${id}`
    );
      return {
        owner: "", version: "",
        id: response.data.id,
        name: response.data.name,
        content: response.data.content,
        language: response.data.languageName,
        extension: response.data.languageExtension,
        compliance: response.data.conformance,
        author: response.data.username
      };
  } catch (error) {
    console.error(error);
    return null;
  }
};
