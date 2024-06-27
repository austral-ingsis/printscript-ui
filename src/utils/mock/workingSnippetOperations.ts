import axios, { AxiosInstance } from 'axios';
import { SnippetOperations } from '../snippetOperations';
import { CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet } from '../snippet';
import autoBind from 'auto-bind';
import { FileType } from '../../types/FileType';
import { TestCase, TestSnippetParams } from '../../types/TestCase';
import { TestCaseResult } from '../queries';
import { PaginatedUsers, User } from '../users';
import { FakeSnippetStore } from './fakeSnippetStore';
import { FormatRule, LintRule } from '../../types/Rule';

const DELAY: number = 1000;
const API_BASE_URL = 'http://localhost:8081';

const getCookie = (name: string): any => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  } else {
    return null;
  }
}


export class WorkingSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore();
  private api: AxiosInstance;

  constructor() {
    const token = getCookie('session');
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    autoBind(this);
  }
  async modifyFormatRule(newRules: FormatRule[]): Promise<FormatRule[]> {
    const response = await this.api.put('/rule/formatter', { rules: newRules })
    return response.data
  }
  
  async modifyLintingRule(newRules: LintRule[]): Promise<LintRule[]> {
    const response = await this.api.put('/rule/linter', newRules)
    return response.data
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const response = await this.api.post(`/snippet`, createSnippet);
    return response.data;
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    const response = await this.api.get(`/snippet/${id}`);
    return response.data;
  }

  async listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
    const response = await this.api.get(`/snippet`, {
      params: {
        page,
        page_size: pageSize
      }
    });
    return response.data;
  }

  async updateSnippetById(id: string, content: string, name: string): Promise<Snippet> {
    const response = await this.api.put(`/snippet/${id}`, { content, name });
    return response.data;
  }

  async deleteSnippet(id: string): Promise<string> {
    const response = await this.api.delete(`/snippet/${id}`);
    return response.data;
  }

  async shareSnippet(assetId: string, userId: string, userName: string): Promise<Snippet> {
    const response = await this.api.post(`/snippet/share`, { assetId, userId, userName });
    return response.data;
  }

  async getUserFriends(snippetId: string, name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
    const response = await this.api.get(`/snippet/share/${snippetId}`);
    return { users: response.data as User[], page_size: 0, page: 0, count: response.data.length }
  }

  async getFormatRules(): Promise<FormatRule[]> {
    const {data} = await this.api.post('/rule/formatter')
    return data.rules
  }

  async getLintingRules(): Promise<LintRule[]> {
    const {data} = await this.api.post('/rule/linter')
    return data
    
  }

  async getTestCases(snippetId: string): Promise<TestCase[]> {
    try {
      const response = await this.api.get(`/test/${snippetId}`);
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

  async formatSnippet(snippet: string): Promise<string> {
    const { data } = await this.api.post('/rule/formatter/run', {

    })
    return ""
  }

  async postTestCase(testCase: TestSnippetParams): Promise<TestCase> {
    const { tc, snippetId } = testCase;

    try {
      const response = await this.api.post(`/test/${snippetId}`, tc);

      return response.data;
    } catch (error) {
      console.error('Error posting test case:', error);
      throw error;
    }
  }


  async removeTestCase(id: string): Promise<string> {
    const response = await this.api.delete(`/test/${id}`);
    return response.data
  }

  async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    const response = await this.api.post(`/test/run/${testCase.id}`);
    return response.data
  }

  getFileTypes(): Promise<FileType[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFileTypes()), DELAY);
    });
  }
}
