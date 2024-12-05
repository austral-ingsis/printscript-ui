import { useEffect, useState } from "react";
import { TestCase } from "../../types/TestCase.ts";
import { Autocomplete, Box, Button, Chip, TextField, Typography, CircularProgress } from "@mui/material";
import { BugReport, Delete, Save, CheckCircle, Error } from "@mui/icons-material";
import { useTestSnippet } from "../../utils/queries.tsx";

type TabPanelProps = {
    index: number;
    value: number;
    test?: TestCase;
    setTestCase: (test: Partial<TestCase>) => void;
    removeTestCase?: (testIndex: string) => void;
}

export const TabPanel = ({ value, index, test: initialTest, setTestCase, removeTestCase }: TabPanelProps) => {
    const [testData, setTestData] = useState<Partial<TestCase> | undefined>(initialTest);
    const { mutateAsync: testSnippet } = useTestSnippet();
    const [testStatus, setTestStatus] = useState<"loading" | "passed" | "failed" | null>(null);

    useEffect(() => {
        setTestData(initialTest ?? { input: [], output: [] });
    }, [initialTest, index]);

    const handleTest = async () => {
        setTestStatus("loading"); // Mostrar estado de carga
        try {
            console.log("Testing data:", testData);
            const result = await testSnippet(testData ?? {}); // Ejecutar el test
            console.log("Result from test:", result);

            if (result === "test passed") {
                setTestStatus("passed");
            } else if (result === "test failed") {
                setTestStatus("failed");
            } else {
                setTestStatus(null);
            }
        } catch (error) {
            console.error("Error during test execution:", error);
            setTestStatus("failed");
        }
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: '100%', height: '100%' }}
        >
            {value === index && (
                <Box sx={{ px: 3 }} display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Name</Typography>
                        <TextField size="small" value={testData?.name}
                                   onChange={(e) => setTestData({ ...testData, name: e.target.value })} />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Input</Typography>
                        <Autocomplete
                            multiple
                            size="small"
                            id="tags-filled"
                            freeSolo
                            value={testData?.input ?? []}
                            onChange={(_, value) => setTestData({ ...testData, input: value })}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
                            onChange={(_, value) => setTestData({ ...testData, output: value })}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
                    <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                        {testData?.id && removeTestCase && (
                            <Button onClick={() => removeTestCase(testData.id ?? "")} variant="outlined" color="error" startIcon={<Delete />}>
                                Remove
                            </Button>
                        )}
                        <Button disabled={!testData?.name} onClick={() => setTestCase(testData ?? {})} variant="outlined" startIcon={<Save />}>
                            Save
                        </Button>
                        {testData?.id && (
                            <Button onClick={handleTest} variant="contained" startIcon={<BugReport />} disableElevation>
                                Test
                            </Button>
                        )}
                        {/* Indicador del estado del test */}
                        {testStatus === "loading" && <CircularProgress size={20} />}
                        {testStatus === "passed" && (
                            <Typography color="green" fontWeight="bold" display="flex" alignItems="center">
                                <CheckCircle style={{ marginRight: 4, color: "green" }} /> Passed
                            </Typography>
                        )}
                        {testStatus === "failed" && (
                            <Typography color="red" fontWeight="bold" display="flex" alignItems="center">
                                <Error style={{ marginRight: 4, color: "red" }} /> Failed
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}
        </div>
    );
};