import {Snippet} from "../utils/snippet.ts";
import {Typography} from "@mui/material";

export const SnippetExecution = ({snippet, run}: {snippet?: Snippet, run: boolean}) => {

    // Here you should provide all the logic to connect to your sockets.
    const output: string[] = [];

    return (
        output.map((o) => (
            <Typography>{o}</Typography>
        ))
    )
}