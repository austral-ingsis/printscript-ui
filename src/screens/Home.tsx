import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {Snippet} from "../types/Snippet.ts";

const snippet: Snippet = {
    id: "1",
    name: "Chongas",
    language: "printscript",
    status: "accepted",
    author: "Chona Gil",
    content: "let a: Number = 1;"
}

const HomeScreen = () => {
    return (
        <SnippetTable snippets={Array(10).fill(snippet)}/>
    )
}

export default withNavbar(HomeScreen);

