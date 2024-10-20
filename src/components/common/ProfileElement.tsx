import { useAuth0 } from "@auth0/auth0-react";

import LogInButton from "../Button_1/LogInButton.tsx";
import UserProfile from "../profile/UserProfile.tsx";

const ProfileElement = () => {
    const { user, isAuthenticated } = useAuth0();
    console.log(user);
    return (
        <div >
            {isAuthenticated && user ? (
                <UserProfile user={{
                    email: user.email || "",
                    email_verified: user.email_verified || false,
                    family_name: user.family_name || "",
                    given_name: user.given_name || "",
                    name: user.first_name || "",
                    nickname: user.nickname || "",
                    picture: user.picture || "",
                    sub: user.sub || "",
                    updated_at: user.updated_at || ""
                }}></UserProfile>
            ) : (
                <LogInButton ></LogInButton>
            )}
        </div>
    );
};



export default ProfileElement;
