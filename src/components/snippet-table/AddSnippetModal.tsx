import {
    Box,
    Button,
    capitalize,
    CircularProgress,
    Input,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {highlight, languages} from "prismjs";
import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Save} from "@mui/icons-material";
import {CreateSnippet, CreateSnippetWithLang} from "../../utils/snippet.ts";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useCreateSnippet, useGetFileTypes} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {getApiErrorMessage} from "../../utils/errorMessage.ts";

export const AddSnippetModal = ({open, onClose, defaultSnippet}: {
    open: boolean,
    onClose: () => void,
    defaultSnippet?: CreateSnippetWithLang
}) => {
    const [language, setLanguage] = useState(defaultSnippet?.language ?? "printscript");
    const [code, setCode] = useState(defaultSnippet?.content ?? "");
    const [version, setVersion] = useState(defaultSnippet?.version ?? "1.1");
    const [snippetName, setSnippetName] = useState(defaultSnippet?.name ?? "")
    const [description, setDescription] = useState(defaultSnippet?.description ?? "");
    const {createSnackbar} = useSnackbarContext();

    const resetForm = () => {
        setLanguage("printscript");
        setCode("");
        setVersion("1.1");
        setSnippetName("");
        setDescription("");
    };

    const {mutate: createSnippet, isLoading: loadingSnippet} = useCreateSnippet({
        onSuccess: () => {
            queryClient.invalidateQueries('listSnippets');
            createSnackbar('success', 'Snippet created');
            resetForm();
            onClose();
        },
        onError: (error) => {
            createSnackbar('error', getApiErrorMessage(error, 'Failed to create snippet'));
        },
    })
    const {data: fileTypes} = useGetFileTypes();

    const handleCreateSnippet = () => {
        const newSnippet: CreateSnippet = {
            version: version,
            name: snippetName,
            description: description,
            content: code,
            language: language,
            extension: fileTypes?.find((f) => f.language === language)?.extension ?? "prs"
        }
        createSnippet(newSnippet);
    }

    const handleClose = () => {
        if (!defaultSnippet) {
            resetForm();
        }
        onClose();
    };

    useEffect(() => {
        if (defaultSnippet) {
            setVersion(defaultSnippet?.version);
            setCode(defaultSnippet?.content)
            setLanguage(defaultSnippet?.language)
            setSnippetName(defaultSnippet?.name)
            setDescription(defaultSnippet?.description ?? "")
        }
    }, [defaultSnippet]);

    return (
        <ModalWrapper open={open} onClose={handleClose}>
            {
                <Box sx={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
                    <Typography id="modal-modal-title" variant="h5" component="h2"
                                sx={{display: 'flex', alignItems: 'center'}}>
                        Add Snippet
                    </Typography>
                    <Button disabled={!snippetName || !code || !language || !version || loadingSnippet} variant="contained"
                            disableRipple
                            sx={{boxShadow: 0}} onClick={handleCreateSnippet}>
                        <Box pr={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            {loadingSnippet ? <CircularProgress size={24}/> : <Save/>}
                        </Box>
                        Save Snippet
                    </Button>
                </Box>
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input onChange={e => setSnippetName(e.target.value)} value={snippetName} id="name"
                       sx={{width: '50%'}}/>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input onChange={e => setDescription(e.target.value)} value={description} id="description"
                       sx={{width: '50%'}}/>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                width: '50%'
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '8px', flex: 2}}>
                    <InputLabel htmlFor="demo-simple-select">Language</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={language}
                        label="Age"
                        onChange={(e: SelectChangeEvent<string>) => setLanguage(e.target.value)}
                        sx={{width: '100%'}}
                    >
                        {
                            fileTypes?.map(x => (
                                <MenuItem data-testid={`menu-option-${x.language}`} key={x.language}
                                          value={x.language}>{capitalize((x.language))}</MenuItem>
                            ))
                        }
                    </Select>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '8px', flex: 1}}>
                    <InputLabel htmlFor="language-version">Version</InputLabel>
                    <Select
                        labelId="language-version"
                        id="language-version"
                        value={version}
                        label="Version"
                        onChange={(e: SelectChangeEvent<string>) => setVersion(e.target.value)}
                        sx={{width: '100%'}}
                    >
                        { //ya se que está hardcodeado esto despues hay que mejorarlo
                            //nos falta un endpoint para pedir las versiones posibles
                            ["1.0", "1.1"].map((v) => (
                            <MenuItem data-testid={`menu-option-version-${v}`} key={v} value={v}>
                                {v}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            <InputLabel>Code Snippet</InputLabel>
            <Box width={"100%"} sx={{
                backgroundColor: 'black', color: 'white', borderRadius: "8px",
            }}>
                <Editor
                    value={code}
                    padding={10}
                    data-testid={"add-snippet-code-editor"}
                    onValueChange={(code) => setCode(code)}
                    highlight={(code) => highlight(code, languages.js, 'javascript')}
                    style={{
                        borderRadius: "8px",
                        overflow: "auto",
                        minHeight: "300px",
                        maxHeight: "600px",
                        width: "100%",
                        fontFamily: "monospace",
                        fontSize: 17,
                    }}
                />
            </Box>
        </ModalWrapper>
    )
}

