import { Box, Divider, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { ModalWrapper } from "../common/ModalWrapper";
import { SyntheticEvent, useState } from "react";
import { AddRounded } from "@mui/icons-material";
import {
    useGetTestCases,
    usePostTestCase,
    useRemoveTestCase,
} from "../../utils/queries";
import { TabPanel } from "./TabPanel";
import { queryClient } from "../../App";

type TestSnippetModalProps = {
    open: boolean;
    snippetId: string;
    onClose: () => void;
};

export const TestSnippetModal = ({
                                     open,
                                     snippetId,
                                     onClose,
                                 }: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);

    const { data: testCases } = useGetTestCases(snippetId);
    const { mutateAsync: postTestCase } = usePostTestCase();
    const { mutateAsync: removeTestCase } = useRemoveTestCase({
        onSuccess: () => queryClient.invalidateQueries(["testCases", snippetId]),
    });

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <Typography variant={"h5"}>Test snippet</Typography>
            <Divider />
            <Box mt={2} display="flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                >
                    {testCases?.map((testCase) => (
                        <Tab label={testCase.name} key={testCase.id} />
                    ))}
                    <IconButton
                        disableRipple
                        onClick={() => setValue((testCases?.length ?? 0) + 1)}
                    >
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel
                        key={index}
                        snippetId={snippetId}
                        index={index}
                        value={value}
                        test={testCase}
                        setTestCase={(tc) => postTestCase({testCase: tc, snippetId })}
                        removeTestCase={() =>
                            removeTestCase({ id: testCase.id, snippetId })
                        }
                    />
                ))}
                <TabPanel
                    index={(testCases?.length ?? 0) + 1}
                    snippetId={snippetId}
                    value={value}
                    setTestCase={(tc) => postTestCase({testCase: tc, snippetId })}
                />
            </Box>
        </ModalWrapper>
    );
};
