import {AxiosInstance} from "axios";
import {PaginatedUsers} from "../users.ts";
import {Snippet} from "../snippet.ts";
import {SnippetDto, toSnippet} from "./snippetsHttpOperations.ts";

export class UsersHttpOperations {
  constructor(private readonly http: AxiosInstance) {}

  async search(name: string, page: number, pageSize: number): Promise<PaginatedUsers> {
    const {data} = await this.http.get<PaginatedUsers>("/users", {params: {name, page, page_size: pageSize}})
    return data
  }

  async share(snippetId: string, userId: string): Promise<Snippet> {
    const {data} = await this.http.post<SnippetDto>(`/snippets/${encodeURIComponent(snippetId)}/share`, {userId})
    return toSnippet(data)
  }
}
