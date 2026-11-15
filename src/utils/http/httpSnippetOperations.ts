import axios, {AxiosInstance} from "axios";
import {FakeSnippetOperations} from "../mock/fakeSnippetOperations.ts";
import {BACKEND_URL} from "../constants.ts";
import {PaginatedUsers} from "../users.ts";
import {Snippet} from "../snippet.ts";

/**
 * Operaciones que ya hablan con snippet-service. Las que todavía no tienen backend siguen usando el mock
 * (por eso extiende de FakeSnippetOperations); a medida que se conecten se van sobrescribiendo acá.
 * El token de Auth0 se pide en cada pedido: getAccessTokenSilently lo cachea y lo renueva solo.
 */
export class HttpSnippetOperations extends FakeSnippetOperations {
  private readonly http: AxiosInstance

  constructor(getToken: () => Promise<string>) {
    super()
    this.http = axios.create({baseURL: BACKEND_URL})
    this.http.interceptors.request.use(async config => {
      config.headers.set("Authorization", `Bearer ${await getToken()}`)
      return config
    })
  }

  // La página de usuarios empieza en 1 (así la pide ShareSnippetModal).
  override async getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
    const {data} = await this.http.get<PaginatedUsers>("/users", {params: {name, page, page_size: pageSize}})
    return data
  }

  // Compartir da permiso de lectura sobre el snippet y sus tests. Solo lo puede hacer el owner.
  override async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    const {data} = await this.http.post<Snippet & {content: string | null}>(
        `/snippets/${encodeURIComponent(snippetId)}/share`,
        {userId},
    )
    return {...data, content: data.content ?? ""}
  }
}
