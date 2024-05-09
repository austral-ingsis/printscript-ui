import {SnippetOperations} from "./snippetOperations.ts";
import autoBind from "auto-bind";
import axios from "axios";
import {CreateSnippet, PaginatedSnippets, Snippet, SnippetDescriptor, UpdateSnippet} from "./snippet.ts";
import {PaginatedUsers} from "./users.ts";
import {paginationParams} from "./pagination.ts";
import {BACKEND_URL} from "./constants.ts";

export class SnippetOperationsImpl implements SnippetOperations {
  private baseURL: string;

  constructor() {
    autoBind(this);
    this.baseURL = BACKEND_URL;
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor> {
    console.log(this.baseURL)
    try {
      const response = await axios.post(`${this.baseURL}/snippets`, createSnippet);
      return response.data;
    } catch (error) {
      console.error("Error creating snippet:", error);
      throw error;
    }
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    try {
      const response = await axios.get(`${this.baseURL}/snippets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching snippet by ID:", error);
      throw error;
    }
  }

  async listSnippetDescriptors(page: number, pageSize: number,sippetName?: string): Promise<PaginatedSnippets> {
    try {
      const response = await axios.get(`${this.baseURL}/snippets?name=${sippetName}&${paginationParams(page, pageSize)}`);
      return response.data;
    } catch (error) {
      console.error("Error listing snippet descriptors:", error);
      throw error;
    }
  }

  async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<SnippetDescriptor> {
    try {
      const response = await axios.put(`${this.baseURL}/snippets/${id}`, updateSnippet);
      return response.data;
    } catch (error) {
      console.error("Error updating snippet by ID:", error);
      throw error;
    }
  }

  async getUserFriends(name: string = "", page: number = 1, pageSize: number = 1): Promise<PaginatedUsers> {
    try {
      const response = await axios.get(`${this.baseURL}/users?search=${name}&${paginationParams(page, pageSize)}`);
      return response.data;
    } catch (error) {
      console.error("Error updating snippet by ID:", error);
      throw error;
    }
  }

  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    try {
      const response = await axios.post(`${this.baseURL}/snippets/share`, {
        userId,
        snippetId
      });
      return response.data;
    } catch (error) {
      console.error("Error sharing snippet:", error);
      throw error;
    }
  }

}
