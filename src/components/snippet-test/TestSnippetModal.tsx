import {Box,  Divider, IconButton, Tab, Tabs, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {SyntheticEvent, useState} from "react";
import {AddRounded} from "@mui/icons-material";
import {useGetTestCases, usePostTestCase, useRemoveTestCase} from "../../utils/queries.tsx";
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
    const {createSnackbar} = useSnackbarContext();

    const {data: testCases} = useGetTestCases(snippetId);
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

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const newTabIndex = testCases?.length ?? 0;

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
                    {testCases?.map((testCase) => (
                        <Tab key={testCase.id} label={testCase.name}/>
                    ))}
                    <IconButton disableRipple onClick={() => setValue(newTabIndex)}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel key={testCase.id} index={index} value={value} test={testCase} snippetId={snippetId}
                              saving={isSaving}
                              setTestCase={(tc) => postTestCase({snippetId, testCase: tc})}
                              removeTestCase={(i) => removeTestCase(i)}
                    />
                ))}
                <TabPanel key="new" index={newTabIndex} value={value} snippetId={snippetId}
                          saving={isSaving}
                          setTestCase={(tc) => postTestCase({snippetId, testCase: tc})}
                />
            </Box>
        </ModalWrapper>
    )
}
