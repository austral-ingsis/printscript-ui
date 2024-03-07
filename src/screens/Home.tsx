import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetCard} from "../components/snippet-card/SnippetCard.tsx";
import {Box} from "@mui/material";

const HomeScreen = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px'}}>
            {
                Array(10).fill(null).map(() => (
                    <SnippetCard/>
                ))
            }
        </Box>
    )
}

export default withNavbar(HomeScreen);

