import axios from 'axios';
import { SnippetOperations } from '../snippetOperations';
import { CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet } from '../snippet';
import autoBind from 'auto-bind';
import { FileType } from '../../types/FileType';
import { TestCase } from '../../types/TestCase';
import { TestCaseResult } from '../queries';
import { PaginatedUsers } from '../users';
import { FakeSnippetStore, Rule } from './fakeSnippetStore';
import { useAuth0 } from '@auth0/auth0-react';

const DELAY: number = 1000;
const API_BASE_URL = 'http://localhost:8081';

export class WorkingSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore();
  private readonly tokenProvider = useAuth0();
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    autoBind(this);
  }
    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Method not implemented.');
    }
    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Method not implemented.');
    }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const response = await axios.post(`${API_BASE_URL}/snippet`, createSnippet, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    const response = await axios.get(`${API_BASE_URL}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  async listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
    const response = await axios.get(`${API_BASE_URL}/snippet`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      params: {
        page,
        page_size: pageSize
      }
    });
    return response.data;
  }

  async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
    const response = await axios.put(`${API_BASE_URL}/snippet/${id}`, updateSnippet, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  async deleteSnippet(id: string): Promise<string> {
    const response = await axios.delete(`${API_BASE_URL}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    const response = await axios.post(`${API_BASE_URL}/snippet/share`, { snippetId, userId }, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  // Other methods stubs
  getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
    throw new Error('Method not implemented.');
  }

  getFormatRules(): Promise<Rule[]> {
    throw new Error('Method not implemented.');
  }

  getLintingRules(): Promise<Rule[]> {
    throw new Error('Method not implemented.');
  }

  getTestCases(): Promise<TestCase[]> {
    throw new Error('Method not implemented.');
  }

  formatSnippet(snippet: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    throw new Error('Method not implemented.');
  }

  removeTestCase(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    throw new Error('Method not implemented.');
  }

  getFileTypes(): Promise<FileType[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFileTypes()), DELAY);
    });
  }
}
