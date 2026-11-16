
export type FormatRulesResponse = {
    rules: { id: number; name: string; defaultValue: number | null }[];
};

export type FormatRuleSelection = {
    ruleId: number;
    value: number | null;
};

export type UpdateFormatRulesRequest = {
    rules: FormatRuleSelection[];
};

export type ActiveFormatRulesResponse = {
    rules: FormatRuleSelection[];
};

export type SnippetResponse = {
    id: string;
    version: number;
    title: string;
    description: string | null;
    ownerId: string;
    language: string;
    languageVersion: string;
    content: string;
};

export type CreateSnippetRequest = {
    title: string;
    description?: string;
    language: string;
    languageVersion: string;
    content: string;
};

export type UpdateSnippetRequest = {
    content: string;
}

export type CreateSnippetTestRequest = {
    inputs: string[];
    outputs: string[];
};

export type SnippetTestResponse = {
    id: string;
    snippetId: string;
    createdAt: string;
};

export type TestListItemResponse = {
    id: string;
    snippetId: string;
    createdAt: string;
    inputs: string[];
    outputs: string[];
    status: string;
};

export type RunTestsRequest = {
    snippetId: string;
    selection: { type: "ALL" | "SELECTED"; testIds?: string[] };
};

export type RunTestsResponse = {
    testIds: string[];
};

export type TestStatusResponse = {
    id: string;
    status: string;
};

export type SnippetSummaryResponse = {
    snippetId: string;
    title: string;
    compliance: string;
    author: string;
    language: string;
    languageVersion: string;
    role: string;
};

export type PaginatedSnippetsResponse = {
    page: number;
    pageSize: number;
    total: number;
    snippets: SnippetSummaryResponse[];
};

export type UserSummaryResponse = {
    id: string;
    name: string;
};

export type PaginatedUsersResponse = {
    page: number;
    page_size: number;
    count: number;
    users: UserSummaryResponse[];
};

export type ShareSnippetRequest = {
    userId: string;
    role: string;
};