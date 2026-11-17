import {useEffect, useState} from "react";
import {TestCase} from "../../types/TestCase.ts";
import {Autocomplete, Box, Button, Chip, CircularProgress, TextField, Typography} from "@mui/material";
import {BugReport, Delete, Save} from "@mui/icons-material";
import {useTestSnippet} from "../../utils/queries.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {getApiErrorMessage} from "../../utils/errorMessage.ts";

type TabPanelProps = {
    index: number;
    value: number;
    test?: TestCase;
    snippetId: string;
    saving?: boolean;
    setTestCase: (test: Partial<TestCase>) => void;
    removeTestCase?: (testIndex: string) => void;
}

const arraysEqual = (a?: string[], b?: string[]) => {
    const arrA = a ?? [];
    const arrB = b ?? [];
    if (arrA.length !== arrB.length) return false;
    return arrA.every((val, idx) => val === arrB[idx]);
};

export const TabPanel = ({value, index, test: initialTest, snippetId, saving, setTestCase, removeTestCase}: TabPanelProps) => {
    const [testData, setTestData] = useState<Partial<TestCase> | undefined>(initialTest);
    const {createSnackbar} = useSnackbarContext();

    useEffect(() => {
        setTestData(initialTest);
    }, [initialTest]);

    const isExistingTest = Boolean(initialTest?.id);

    const hasChanges = isExistingTest
        ? (testData?.name ?? '') !== (initialTest?.name ?? '') ||
          !arraysEqual(testData?.input, initialTest?.input) ||
          !arraysEqual(testData?.output, initialTest?.output)
        : Boolean(testData?.name?.trim()) ||
          (testData?.input && testData.input.length > 0) ||
          (testData?.output && testData.output.length > 0);

    const {mutateAsync: testSnippet, data, isLoading: isTesting} = useTestSnippet({
        onError: (error) => {
            createSnackbar('error', getApiErrorMessage(error, 'Failed to run test'));
        },
    });


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{width: '100%', height: '100%'}}
        >
            {value === index && (
                <Box sx={{px: 3}} display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Name</Typography>
                        <TextField size="small" value={testData?.name ?? ""}
                                   onChange={(e) => setTestData({...testData, name: e.target.value})}/>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Input</Typography>
                        <Autocomplete
                            multiple
                            size="small"
                            id="tags-filled"
                            freeSolo
                            value={testData?.input ?? []}
                            onChange={(_, value) => setTestData({...testData, input: value})}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({index})} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                />
                            )}
                            options={[]}
                        />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Output</Typography>
                        <Autocomplete
                            multiple
                            size="small"
                            id="tags-filled"
                            freeSolo
                            value={testData?.output ?? []}
                            onChange={(_, value) => setTestData({...testData, output: value})}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({index})} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                />
                            )}
                            options={[]}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" gap={1}>
                        {
                            (testData?.id && removeTestCase) && (
                            <Button onClick={() => removeTestCase(testData?.id ?? "")} variant={"outlined"} color={"error"}
                                    startIcon={<Delete/>}>
                                Remove
                            </Button>)
                        }
                        {hasChanges && (
                            <Button disabled={!testData?.name?.trim() || saving} onClick={() => setTestCase(testData ?? {})} variant={"outlined"} startIcon={saving ? <CircularProgress size={16}/> : <Save/>}>
                                Save
                            </Button>
                        )}
                        <Button onClick={() => testSnippet({snippetId, testCase: testData ?? {}})} variant={"contained"}
                                startIcon={isTesting ? <CircularProgress size={16} color="inherit"/> : <BugReport/>} disabled={!testData?.id || isTesting} disableElevation>
                            Test
                        </Button>
                        {data && (data === "success" ? <Chip label="Pass" color="success"/> :
                            <Chip label="Fail" color="error"/>)}
                    </Box>
                </Box>
            )}
        </div>
    );
}