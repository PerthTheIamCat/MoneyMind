import axios from "axios";

interface SignUpData {
    username: string;
    password: string;
    email: string;
    name?: string;
}

interface SignUpResponse {
    success: boolean;
    message: string;
}

interface SignUpError {
    response: {
        data: {
            success: boolean;
            message: string;
        };
    };
}

export const SignUpHandler = async (host: string, port: number, data: SignUpData): Promise<SignUpResponse | SignUpError['response']['data']> => {
    try {
        const response = await axios.post<SignUpResponse>(`http://${host}:${port}/auth/signup`, data);
        return response.data;
    } catch (error) {
        return (error as SignUpError).response.data;
    }
}