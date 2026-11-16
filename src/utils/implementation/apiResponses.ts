
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
};