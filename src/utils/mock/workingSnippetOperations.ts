import axios from 'axios';
import { SnippetOperations } from '../snippetOperations';
import { CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet } from '../snippet';
import autoBind from 'auto-bind';
import { FileType } from '../../types/FileType';
import { TestCase, TestSnippetParams } from '../../types/TestCase';
import { TestCaseResult } from '../queries';
import { PaginatedUsers, User } from '../users';
import { FakeSnippetStore} from './fakeSnippetStore';
import { Rule } from '../../types/Rule';
import { useAuth0 } from '@auth0/auth0-react';

const DELAY: number = 1000;
const API_BASE_URL = 'http://localhost:8081';

export class WorkingSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore();
  private readonly tokenProvider = useAuth0();
  accessToken: string;
  nickname: string;

  constructor(accessToken: string, nickName: string) {
    this.accessToken = accessToken;
    this.nickname= nickName;
    autoBind(this);
  }
    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Method not implemented.');
    }
    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Method not implemented.');
    }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const createSnippetRequest = {
      ...createSnippet, userName: this.nickname
    }
    const response = await axios.post(`${API_BASE_URL}/snippet`, createSnippetRequest, {
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

  async updateSnippetById(id: string,content: string, name: string): Promise<Snippet> {
    const response = await axios.put(`${API_BASE_URL}/snippet/${id}`, {content, name}, {
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

  async shareSnippet(assetId: string, userId: string, userName: string): Promise<Snippet> {
    const response = await axios.post(`${API_BASE_URL}/snippet/share`, { assetId, userId, userName }, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data;
  }

  async getUserFriends(snippetId: string, name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
    const response = await axios.get(`${API_BASE_URL}/snippet/share/${snippetId}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return {users: response.data as User[], page_size: 0, page:0, count: response.data.length}
  }

  getFormatRules(): Promise<Rule[]> {
    throw new Error('Method not implemented.');
  }

  getLintingRules(): Promise<Rule[]> {
    throw new Error('Method not implemented.');
  }

  async getTestCases(snippetId: string): Promise<TestCase[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/test/${snippetId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      const testCases: TestCase[] = response.data.map((testCase: any) => ({
        id: testCase.id,
        name: testCase.name,
        inputs: testCase.inputs,
        outputs: testCase.outputs,
        environment: testCase.environment.map((env: any) => ({
          key: env.key,
          value: env.value
        }))
      }));

      return testCases;
    } catch (error) {
      console.error('Error fetching test cases:', error);
      throw error;
    }
  }

  formatSnippet(snippet: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async postTestCase(testCase: TestSnippetParams): Promise<TestCase> {
    const { tc, snippetId } = testCase;
  
    try {
      const response = await axios.post(`${API_BASE_URL}/test/${snippetId}`, tc, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error posting test case:', error);
      throw error;
    }
  }
  

  async removeTestCase(id: string): Promise<string> {
    const response = await axios.delete(`${API_BASE_URL}/test/${id}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response.data
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
