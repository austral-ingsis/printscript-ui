import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {Box, Card, Typography} from "@mui/material";

const RulesScreen = () => {
    return (
        <Box>
            <Typography>
                Rules
            </Typography>
            <Card>
            </Card>
        </Box>
    )
}

export default withNavbar(RulesScreen);