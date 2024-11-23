import axios from "axios";
import { FileType } from "../types/FileType";
import { Rule } from "../types/Rule";
import { TestCase } from "../types/TestCase";
import { TestCaseResult } from "./queries";
import {
  PaginatedSnippets,
  CreateSnippet,
  Snippet,
  UpdateSnippet,
} from "./snippet";
import { SnippetOperations } from "./snippetOperations";
import { PaginatedUsers } from "./users";
import config from "./config";
import { FakeSnippetOperations } from "./mock/fakeSnippetOperations";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import SnippetDTO from "../models/SnippetDTO";
import { GetTokenSilentlyVerboseResponse } from "@auth0/auth0-spa-js/dist/typings/global";
import FriendDTO from "../models/FriendDTO";

const fakeSnippet = {} as Snippet;

type getAccessTokenSilently = {
  (
    options: GetTokenSilentlyOptions & {
      detailedResponse: true;
    }
  ): Promise<GetTokenSilentlyVerboseResponse>;
  (options?: GetTokenSilentlyOptions): Promise<string>;
  (options: GetTokenSilentlyOptions): Promise<
    GetTokenSilentlyVerboseResponse | string
  >;
};

const options = {
  authorizationParams: {
    audience: "https://snippet",
  },
};

class Operations implements SnippetOperations {
  private operations: SnippetOperations = new FakeSnippetOperations();

  constructor(
    private readonly getAccessTokenSilently: getAccessTokenSilently
  ) {}

  async listSnippetDescriptors(
    page: number,
    pageSize: number
  ): Promise<PaginatedSnippets> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(
      `${config.apiUrl}/snippet/${page + 1}/${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const pagination: PaginatedSnippets = response.data;
    const snippets: Snippet[] = pagination.snippets;
    return {
      snippets,
      page: pagination.page,
      page_size: pagination.page_size,
      count: pagination.count,
    };
  }
  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    const match = createSnippet.language.match(/^(\w+)\s*([\d.]+)?$/);
    let version: string | null = null
    if (match) {
      version = match[2]
    }
    await axios.post(
      `${config.apiUrl}/snippet`,
        {
          name: createSnippet.name,
          content: createSnippet.content,
          version: version,
          language: createSnippet.language,
          extension: createSnippet.extension,
        },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fakeSnippet;
  }
  async getSnippetById(id: string): Promise<Snippet | undefined> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return SnippetDTO.toSnippet(response.data);
  }
  async updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet
  ): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    await axios.patch(
      `${config.apiUrl}/snippet/${id}`,
      {
        content: updateSnippet.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fakeSnippet;
  }
  async getUserFriends(
    name?: string | undefined,
    page?: number | undefined,
    pageSize?: number | undefined
  ): Promise<PaginatedUsers> {
    name;
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const friends = response.data.map((friend: FriendDTO) =>
      FriendDTO.toUser(friend)
    );
    return {
      users: friends,
      page: page ?? 1,
      page_size: pageSize ?? friends.length,
      count: friends.length,
    };
  }
  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    const token = await this.getAccessTokenSilently(options);
    await axios.post(
      `${config.apiUrl}/snippet/${snippetId}/share`,
      {
        friend_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return fakeSnippet;
  }
  async getFormatRules(): Promise<Rule[]> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/configuration/format`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async getLintingRules(): Promise<Rule[]> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.get(`${config.apiUrl}/configuration/lint`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async getTestCases(snippetId: string): Promise<TestCase[]> {
    const token = await this.getAccessTokenSilently(options);
    if (snippetId.length === 0) { return []; }
    const response = await axios.get(`${config.apiUrl}/snippet/${snippetId}/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async formatSnippet(id: string): Promise<string> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.post(
      `${config.apiUrl}/snippet/${id}/format`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async postTestCase(testCase: Partial<TestCase>, snippetId: string): Promise<TestCase> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.put(
        `${config.apiUrl}/snippet/${snippetId}/test`,
        {...testCase, input: testCase.input ?? [], output: testCase.output ?? []},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    return response.data;
  }
  async removeTestCase(id: string, snippetId: string): Promise<string> {
    const token = await this.getAccessTokenSilently(options);
    await axios.delete(`${config.apiUrl}/snippet/${snippetId}/test/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return "deleted";
  }
  async deleteSnippet(id: string): Promise<string> {
    const token = await this.getAccessTokenSilently(options);
    await axios.delete(`${config.apiUrl}/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return "deleted";
  }
  async testSnippet(testCase: Partial<TestCase>, snippetId: string): Promise<TestCaseResult> {
    const token = await this.getAccessTokenSilently(options);
    const response = await axios.post(
        `${config.apiUrl}/snippet/${snippetId}/test/execute`,
        {...testCase, input: testCase.input ?? [], output: testCase.output ?? []},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    return response.data ? "success" : "fail";
  }
  getFileTypes(): Promise<FileType[]> {
    return this.operations.getFileTypes();
  }
  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    const token = await this.getAccessTokenSilently(options);
    await axios.put(
      `${config.apiUrl}/configuration/format`,
      JSON.stringify(newRules),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return newRules;
  }
  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    const token = await this.getAccessTokenSilently(options);
    await axios.put(
      `${config.apiUrl}/configuration/lint`,
      JSON.stringify(newRules),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return newRules;
  }
}
export default Operations;
export { options };
