
import api from "../_axios/axios";

interface ProfileResponse {
    username: string;
    tag: string;
    email: string;
    phone: number | null;
    rank: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Unranked';
    level?: number;
    xp: number;
    currentAvatar?: string | null; // Backend sends ObjectId; frontend can receive as string
    currentTitle?: string;
    collections?: {
        Avatar: string[];  // ObjectId[] received as string[]
        Title: string[];
    };
    gamePlayed?: number;
    friends: string[];  // ObjectId[] as string[]
    pendingFriendRequests?: string[];
}

interface Response {
    success: boolean;
    message: string;
}



export const getDetailsAPI = async (): Promise<ProfileResponse> => {
    try {

        const response = await api.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("get details failed:", error);
    }
};

export const updateUsername = async (
    username: string,
    tag: string
): Promise<Response> => {
    try {
        const response = await api.post("/user/updateusername", {
            username,
            tag
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const updatePassword = async (
    currentPassword: string,
    newPassword: string
): Promise<Response> => {
    try {
        const response = await api.post("/user/updatepassword", {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}