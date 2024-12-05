import axios from "axios";

export async function fetchOwnerEmail(ownerId: string): Promise<string> {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }

    const response = await axios.get(`http://localhost:8083/users/${ownerId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.data && response.data.email) {
        return response.data.email;
    } else {
        throw new Error("Owner email not found");
    }
}