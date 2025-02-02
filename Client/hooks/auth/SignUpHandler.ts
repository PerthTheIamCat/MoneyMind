import axios from "axios";

interface SignUpData {
    username: string;
    password: string;
    password2: string;
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

export const SignUpHandler = async (URL: string, data: SignUpData): Promise<SignUpResponse | SignUpError['response']['data']> => {
    console.log(data);
    try {
        const response = await axios.post<SignUpResponse>(`${URL}`, data);
        
        return response.data;
    } catch (error) {
        return (error as SignUpError).response.data;
    }
}