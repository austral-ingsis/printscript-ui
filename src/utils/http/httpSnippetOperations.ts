import axios, {AxiosInstance} from "axios";
import {FakeSnippetOperations} from "../mock/fakeSnippetOperations.ts";
import {BACKEND_URL} from "../constants.ts";
import {PaginatedUsers} from "../users.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
import {Pagination} from "../pagination.ts";
import {FileType} from "../../types/FileType.ts";

// Lo que devuelve snippet-service: el listado no trae el contenido (`content` viene null) y el detalle sí.
type SnippetDto = Omit<Snippet, "content"> & { content: string | null }
type PaginatedSnippetsDto = Pagination & { snippets: SnippetDto[] }

const toSnippet = ({content, ...rest}: SnippetDto): Snippet => ({...rest, content: content ?? ""})

/**
 * Operaciones que ya hablan con snippet-service. Las que todavía no tienen backend siguen usando el mock
 * (por eso extiende de FakeSnippetOperations); a medida que se conecten se van sobrescribiendo acá.
 * El token de Auth0 se pide en cada pedido: getAccessTokenSilently lo cachea y lo renueva solo.
 *
 * Los errores no se tapan: axios rechaza la promesa con el cuerpo del backend (ver `describeError`).
 */
export class HttpSnippetOperations extends FakeSnippetOperations {
  private readonly http: AxiosInstance

  constructor(getToken: () => Promise<string>, baseUrl: string = BACKEND_URL) {
    super()
    this.http = axios.create({baseURL: baseUrl})
    this.http.interceptors.request.use(async config => {
      config.headers.set("Authorization", `Bearer ${await getToken()}`)
      return config
    })
  }

  // La página del listado empieza en 0 (como TablePagination y el backend).
  override async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
    const {data} = await this.http.get<PaginatedSnippetsDto>("/snippets", {
      params: {page, page_size: pageSize, name: snippetName || undefined},
    })
    return {...data, snippets: data.snippets.map(toSnippet)}
  }

  // El backend deduce la extensión del lenguaje: el `extension` que arma la UI no se manda.
  override async createSnippet({name, language, content}: CreateSnippet): Promise<Snippet> {
    const {data} = await this.http.post<SnippetDto>("/snippets", {name, language, content})
    return toSnippet(data)
  }

  override async getSnippetById(id: string): Promise<Snippet> {
    const {data} = await this.http.get<SnippetDto>(`/snippets/${encodeURIComponent(id)}`)
    return toSnippet(data)
  }

  override async updateSnippetById(id: string, {content}: UpdateSnippet): Promise<Snippet> {
    const {data} = await this.http.put<SnippetDto>(`/snippets/${encodeURIComponent(id)}`, {content})
    return toSnippet(data)
  }

  // El backend responde 204 sin cuerpo; la UI espera el id del snippet borrado.
  override async deleteSnippet(id: string): Promise<string> {
    await this.http.delete(`/snippets/${encodeURIComponent(id)}`)
    return id
  }

  override async getFileTypes(): Promise<FileType[]> {
    const {data} = await this.http.get<FileType[]>("/snippets/file-types")
    return data
  }

  // La página de usuarios empieza en 1 (así la pide ShareSnippetModal).
  override async getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
    const {data} = await this.http.get<PaginatedUsers>("/users", {params: {name, page, page_size: pageSize}})
    return data
  }

  // Compartir da permiso de lectura sobre el snippet y sus tests. Solo lo puede hacer el owner.
  override async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    const {data} = await this.http.post<SnippetDto>(`/snippets/${encodeURIComponent(snippetId)}/share`, {userId})
    return toSnippet(data)
  }
}
