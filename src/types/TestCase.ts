export type TestCase = {
    id: string;
    name: string;
    inputs?: string[];
    outputs?: string[];
    environment: EnvVar[];
}

export type EnvVar = {
    key: string;
    value: string;
}

export type TestSnippetParams = {
    tc: Partial<TestCase>;
    snippetId: string;
  }