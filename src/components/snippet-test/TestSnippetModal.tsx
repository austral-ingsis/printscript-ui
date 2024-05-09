import {Autocomplete, Box, Button, Chip, Divider, IconButton, Tab, Tabs, TextField, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {SyntheticEvent, useState} from "react";
import {AddRounded, BugReport, Delete, Save} from "@mui/icons-material";

type TestSnippetModalProps = {
    open: boolean
    onClose: () => void
}

type TestCaseType = {id: string; name: string, input: string[], output: string[] };


type TabPanelProps = {
    index: number;
    value: number;
    test: TestCaseType;
    setTestCase: (test: TestCaseType) => void;
    removeTestCase: (testIndex: string) => void;
}

const TabPanel = ({value, index, test: initialTest, setTestCase, removeTestCase}: TabPanelProps) => {
    const [result, setResult] = useState<string | null>(null);
    const [testData, setTestData] = useState<TestCaseType>(initialTest);

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
                        <TextField size="small" value={testData.name}
                                   onChange={(e) => setTestData({...testData, name: e.target.value})}/>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="bold">Input</Typography>
                        <Autocomplete
                            multiple
                            size="small"
                            id="tags-filled"
                            freeSolo
                            value={testData.input}
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
                            value={testData.output}
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
                        <Button onClick={() => removeTestCase(testData.id)} variant={"outlined"} color={"error"}
                                startIcon={<Delete/>}>
                            Remove
                        </Button>
                        <Button onClick={() => setTestCase(testData)} variant={"outlined"} startIcon={<Save/>}>
                            Save
                        </Button>
                        <Button onClick={() => setResult("success")} variant={"contained"} startIcon={<BugReport/>}
                                disableElevation>
                            Test
                        </Button>
                        {result && (result === "success" ? <Chip label="Pass" color="success"/> :
                            <Chip label="Fail" color="error"/>)}
                    </Box>
                </Box>
            )}
        </div>
    );
}

export const TestSnippetModal = ({open, onClose}: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);
    const [testCases, setTestCases] = useState<TestCaseType[]>([{id: "", name: "New Test Case", input: [], output: []}]);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <Typography variant={"h5"}>Test snippet</Typography>
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
                    {testCases.map((testCase) => (
                        <Tab label={testCase.name}/>
                    ))}
                    <IconButton disableRipple onClick={() => setTestCases([...testCases])}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases.map((testCase, index) => (
                    <TabPanel index={index} value={value} test={testCase}
                              setTestCase={(tc) => setTestCases(testCases => testCases.map(t => t.id === tc.id ? tc : t))}
                              removeTestCase={(i) => setTestCases(testCases.filter(t => t.id === i))}
                    />
                ))}
            </Box>
        </ModalWrapper>
    )
}
