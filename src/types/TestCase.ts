export type TestStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'ERROR';

export type TestCase = {
    id: string;
    name: string;
    input?: string[];
    output?: string[];
    lastStatus?: TestStatus;
};

/** Outcome of running a test: what the snippet printed against what was expected. */
export type TestRunResult = {
    testId?: string;
    status: TestStatus;
    outputs: string[];
    expectedOutputs: string[];
    errors: string[];
};
