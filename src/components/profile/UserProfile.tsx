// UserProfile.tsx
import React from 'react';
import { User } from './User.ts';
import { Avatar, Box, Typography, Tooltip, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const handleLogout = () => {
        console.log('User logged out');
    };

    return (
            <Tooltip title={
                <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                >
                    Log Out
                </Button>
            } arrow>
                <Box display="flex" alignItems="center" sx={{ padding: 2, borderRadius: 1 }}>
                    <Avatar alt={user.nickname} src={user.picture} sx={{ width: 80, height: 80 }} />
                    <Box ml={2} textAlign="left">
                        <Typography variant="h6" sx={{ color: 'white', marginBottom: 0.5 }}>
                            {user.nickname}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', marginBottom: 0 }}>
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
            </Tooltip>

    );
};

export default UserProfile;
