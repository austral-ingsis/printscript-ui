import { useState, useEffect } from "react";
import { TestCase, EnvVar } from "../../types/TestCase";
import { Autocomplete, Box, Button, Chip, TextField, Typography } from "@mui/material";
import { BugReport, Delete, Save } from "@mui/icons-material";
import { useTestSnippet } from "../../utils/queries";

type TabPanelProps = {
  index: number;
  value: number;
  test?: TestCase;
  setTestCase: (test: Partial<TestCase>) => void;
  removeTestCase?: (testIndex: string) => void;
};

export const TabPanel = ({ value, index, test: initialTest, setTestCase, removeTestCase }: TabPanelProps) => {
  const [testData, setTestData] = useState<Partial<TestCase> | undefined>(initialTest);

  const { mutateAsync: testSnippet, data } = useTestSnippet();

  const handleEnvVarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); 
    
    const envVarsArray = value.split(";").map((envVarString) => {
      const [key, ...valParts] = envVarString.split("=");  
      
      const val = valParts.join("=").trim();
      
      return { key: key.trim(), value: val };
    });
  
    setTestData({ ...testData, environment: envVarsArray });
  };
  

  useEffect(() => {
    if (initialTest) {
      setTestData(initialTest);
    }
  }, [initialTest]);

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
            <TextField
              size="small"
              value={testData?.name}
              onChange={(e) => setTestData({ ...testData, name: e.target.value })}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography fontWeight="bold">Input</Typography>
            <Autocomplete
              multiple
              size="small"
              id="tags-filled"
              freeSolo
              value={testData?.inputs ?? []}
              onChange={(_, value) => setTestData({ ...testData, inputs: value })}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => <TextField {...params} />}
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
              value={testData?.outputs ?? []}
              onChange={(_, value) => setTestData({ ...testData, outputs: value })}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => <TextField {...params} />}
              options={[]}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography fontWeight="bold">Environment Variables</Typography>
            <TextField
              helperText={"Comma-separated as ENV=123;VAR=456"}
              size="small"
              id="tags-filled"
              value={testData?.environment?.map((envVar) => `${envVar.key}=${envVar.value}`).join("; ") ?? ""}
              onChange={handleEnvVarsChange}
            />
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            {testData?.id && removeTestCase && (
              <Button onClick={() => removeTestCase(testData?.id ?? "")} variant={"outlined"} color={"error"} startIcon={<Delete />}>
                Remove
              </Button>
            )}
            <Button disabled={!testData?.name} onClick={() => setTestCase(testData ?? {})} variant={"outlined"} startIcon={<Save />}>
              Save
            </Button>
            <Button onClick={() => testSnippet(testData ?? {})} variant={"contained"} startIcon={<BugReport />} disableElevation>
              TestX
            </Button>
            {data && (data.passed=== true ? <Chip label="Pass" color="success" /> : <Chip label="Fail" color="error" />)}
          </Box>
        </Box>
      )}
    </div>
  );
};
