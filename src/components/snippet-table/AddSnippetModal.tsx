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
import {CreateSnippet, CreateSnippetWithLang, defaultVersion} from "../../utils/snippet.ts";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useCreateSnippet, useGetFileTypes} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";

export const AddSnippetModal = ({open, onClose, defaultSnippet}: {
    open: boolean,
    onClose: () => void,
    defaultSnippet?: CreateSnippetWithLang
}) => {
    const [language, setLanguage] = useState(defaultSnippet?.language ?? "printscript");
    const [code, setCode] = useState(defaultSnippet?.content ?? "");
    const [snippetName, setSnippetName] = useState(defaultSnippet?.name ?? "")
    const [version, setVersion] = useState(defaultSnippet?.version ?? "")
    const {mutateAsync: createSnippet, isLoading: loadingSnippet} = useCreateSnippet({
        onSuccess: () => queryClient.invalidateQueries('listSnippets')
    })
    const {data: fileTypes} = useGetFileTypes();
    const versions = fileTypes?.find((f) => f.language === language)?.versions ?? [];

    const changeLanguage = (newLanguage: string) => {
        setLanguage(newLanguage)
        setVersion(defaultVersion(fileTypes ?? [], newLanguage) ?? "")
    }

    const handleCreateSnippet = async () => {
        const newSnippet: CreateSnippet = {
            name: snippetName,
            content: code,
            language: language,
            version: version,
        }
        await createSnippet(newSnippet);
        onClose();
    }

    useEffect(() => {
        if (defaultSnippet) {
            setCode(defaultSnippet?.content)
            setLanguage(defaultSnippet?.language)
            setSnippetName(defaultSnippet?.name)
            setVersion(defaultSnippet?.version ?? defaultVersion(fileTypes ?? [], defaultSnippet?.language) ?? "")
        }
    }, [defaultSnippet, fileTypes]);

    return (
        <ModalWrapper open={open} onClose={onClose}>
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
                <InputLabel htmlFor="language">Language</InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language"
                    value={language}
                    label="Language"
                    onChange={(e: SelectChangeEvent<string>) => changeLanguage(e.target.value)}
                    sx={{width: '50%'}}
                >
                    {
                        fileTypes?.map(x => (
                            <MenuItem data-testid={`menu-option-${x.language}`} key={x.language}
                                      value={x.language}>{capitalize((x.language))}</MenuItem>
                        ))
                    }
                </Select>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <InputLabel htmlFor="version">Version</InputLabel>
                <Select
                    id="version"
                    value={version}
                    label="Version"
                    onChange={(e: SelectChangeEvent<string>) => setVersion(e.target.value)}
                    sx={{width: '50%'}}
                >
                    {
                        versions.map(v => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))
                    }
                </Select>
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

