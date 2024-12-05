import { Box, Divider, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { ModalWrapper } from "../common/ModalWrapper.tsx";
import { SyntheticEvent, useState } from "react";
import { AddRounded } from "@mui/icons-material";
import { useGetTestCases, usePostTestCase, useRemoveTestCase } from "../../utils/queries.tsx";
import { TestResponse } from "../../hooks/TestResponse.ts";
import { TabPanel } from "./TabPanel.tsx";
import { queryClient } from "../../App.tsx";
import {TestCase} from "../../types/TestCase.ts";

type TestSnippetModalProps = {
    open: boolean;
    onClose: () => void;
    snippetId: string;
};

export const TestSnippetModal = ({ open, onClose, snippetId }: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);

    const { data: testCases } = useGetTestCases(snippetId);
    const postTestCase = usePostTestCase(snippetId);
    const { mutateAsync: removeTestCase } = useRemoveTestCase({
        onSuccess: () => queryClient.invalidateQueries("testCases"),
    });

    // Estado para mensajes y su estado (éxito o error)
    const [message, setMessage] = useState<string | null>(null);
    const [messageStatus, setMessageStatus] = useState<"success" | "error" | null>(null);

    const handleAddTestCase = async (testCase: Partial<TestCase>) => {
        const sanitizedTestCase = {
            ...testCase,
            input: testCase.input || [],
            output: testCase.output || [],
        };

        try {
            const response: TestResponse = await postTestCase.mutateAsync(sanitizedTestCase);

            if (response.message === "Test added") {
                // Test agregado con éxito
                setMessage("Test added successfully!");
                setMessageStatus("success");
                await queryClient.invalidateQueries(["testCases", snippetId]);

                // Desaparecer el mensaje después de 1 segundo
                setTimeout(() => {
                    setMessage(null);
                    setMessageStatus(null);
                }, 1000);
            } else {
                // Mostrar mensaje de error o validación
                setMessage(response.message);
                setMessageStatus("error");
            }
        } catch (error) {
            console.error("Error adding test case:", error);
            setMessage("An error occurred while adding the test case.");
            setMessageStatus("error");
        }
    };

    const handleRemoveTestCase = async (id: string) => {
        try {
            await removeTestCase(id);
            await queryClient.invalidateQueries("testCases");
        } catch (error) {
            console.error("Error removing test case:", error);
        }
    };

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
                    <IconButton disableRipple onClick={() => setValue((testCases?.length ?? 0) + 1)}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel
                        index={index}
                        value={value}
                        test={testCase}
                        setTestCase={handleAddTestCase}
                        removeTestCase={(id) => handleRemoveTestCase(id)}
                        key={testCase.id}
                    />
                ))}
                <TabPanel
                    index={(testCases?.length ?? 0) + 1}
                    value={value}
                    setTestCase={handleAddTestCase}
                />
            </Box>

            {/* Mostrar mensaje debajo de las pestañas */}
            {message && (
                <Typography
                    mt={2}
                    fontWeight="bold"
                    color={messageStatus === "success" ? "green" : "red"}
                    textAlign="center"
                >
                    {message}
                </Typography>
            )}
        </ModalWrapper>
    );
};
