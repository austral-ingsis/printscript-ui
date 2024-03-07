import { SnippetOperations } from "./snippetOperations.ts";
import autoBind from "auto-bind";
import axios from "axios";
import { CreateSnippet, Snippet, SnippetDescriptor, UpdateSnippet } from "./snippet.ts";

export class SnippetOperationsImpl implements SnippetOperations {
  private baseURL: string;

  constructor() {
    autoBind(this);
    this.baseURL = "http://localhost:8080"; // Adjust this if your backend base URL is different
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<SnippetDescriptor> {
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

  async listSnippetDescriptors(): Promise<SnippetDescriptor[]> {
    try {
      const response = await axios.get(`${this.baseURL}/snippets`);
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
}
