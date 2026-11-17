import {Box, Button, CircularProgress, Divider, IconButton, Tab, Tabs, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {SyntheticEvent, useEffect, useState} from "react";
import {AddRounded, CancelRounded, CheckCircleRounded, PlayArrow} from "@mui/icons-material";
import {
    TestCaseResult,
    useGetTestCases,
    usePostTestCase,
    useRemoveTestCase,
    useTestAllSnippets,
} from "../../utils/queries.tsx";
import {TabPanel} from "./TabPanel.tsx";
import {queryClient} from "../../App.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {getApiErrorMessage} from "../../utils/errorMessage.ts";

type TestSnippetModalProps = {
    open: boolean
    onClose: () => void
    snippetId: string
}

export const TestSnippetModal = ({open, onClose, snippetId}: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);
    const [testResults, setTestResults] = useState<Record<string, TestCaseResult>>({});
    const {createSnackbar} = useSnackbarContext();

    const {data: testCases} = useGetTestCases(snippetId);

    useEffect(() => {
        if (testCases) {
            const synced: Record<string, TestCaseResult> = {};
            for (const tc of testCases) {
                if (tc.status === "PASSED") {
                    synced[tc.id] = "success";
                } else if (tc.status === "FAILED" || tc.status === "ERROR") {
                    synced[tc.id] = "fail";
                }
            }
            setTestResults(synced);
        }
    }, [testCases]);

    const {mutateAsync: postTestCase, isLoading: isSaving} = usePostTestCase({
        onSuccess: () => {
            queryClient.invalidateQueries(['testCases', snippetId]);
            createSnackbar('success', 'Test case saved');
        },
        onError: (error) => {
            createSnackbar('error', getApiErrorMessage(error, 'Failed to save test case'));
        },
    });
    const {mutateAsync: removeTestCase} = useRemoveTestCase({
        onSuccess: () => {
            queryClient.invalidateQueries(['testCases', snippetId]);
            createSnackbar('success', 'Test case removed');
        },
        onError: (error) => {
            createSnackbar('error', getApiErrorMessage(error, 'Failed to remove test case'));
        },
    });

    const handleRemoveTestCase = async (id: string) => {
        await removeTestCase(id);
        setTestResults((prev) => {
            const next = {...prev};
            delete next[id];
            return next;
        });
    };

    const {mutateAsync: testAllSnippets, isLoading: isTestingAll} = useTestAllSnippets({
        onSuccess: (results) => {
            setTestResults((prev) => ({...prev, ...results}));
            queryClient.invalidateQueries(['testCases', snippetId]);
            createSnackbar('success', 'All tests completed');
        },
        onError: (error) => {
            createSnackbar('error', getApiErrorMessage(error, 'Failed to run all tests'));
        },
    });

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleRunAll = () => {
        testAllSnippets(snippetId);
    };

    const handleTestResult = (testId: string, result: TestCaseResult) => {
        setTestResults((prev) => ({...prev, [testId]: result}));
    };

    const newTabIndex = testCases?.length ?? 0;

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={1}>
                <Typography variant={"h5"}>Test snippet</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={isTestingAll || !testCases?.length}
                    startIcon={isTestingAll ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                    onClick={handleRunAll}
                    disableElevation
                >
                    Run all tests
                </Button>
            </Box>
            <Divider/>
            <Box mt={2} display="flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{borderRight: 1, borderColor: 'divider'}}
                >
                    {testCases?.map((testCase) => {
                        const result = testResults[testCase.id];
                        return (
                            <Tab
                                key={testCase.id}
                                sx={{
                                    minHeight: 44,
                                    color: result === "success" ? "success.main" : result === "fail" ? "error.main" : undefined,
                                    "&.Mui-selected": {
                                        color: result === "success" ? "success.main" : result === "fail" ? "error.main" : undefined,
                                    },
                                }}
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <span>{testCase.name}</span>
                                        {result === "success" && (
                                            <CheckCircleRounded sx={{ fontSize: 16, color: "success.main" }} />
                                        )}
                                        {result === "fail" && (
                                            <CancelRounded sx={{ fontSize: 16, color: "error.main" }} />
                                        )}
                                    </Box>
                                }
                            />
                        );
                    })}
                    <IconButton disableRipple onClick={() => setValue(newTabIndex)}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel key={testCase.id} index={index} value={value} test={testCase} snippetId={snippetId}
                              saving={isSaving}
                              isTestingAll={isTestingAll}
                              testResult={testResults[testCase.id]}
                              onTestResult={handleTestResult}
                              setTestCase={(tc) => postTestCase({snippetId, testCase: tc})}
                              removeTestCase={handleRemoveTestCase}
                    />
                ))}
                <TabPanel key={`new-${newTabIndex}`} index={newTabIndex} value={value} snippetId={snippetId}
                          saving={isSaving}
                          isTestingAll={isTestingAll}
                          setTestCase={(tc) => postTestCase({snippetId, testCase: tc})}
                />
            </Box>
        </ModalWrapper>
    )
}
