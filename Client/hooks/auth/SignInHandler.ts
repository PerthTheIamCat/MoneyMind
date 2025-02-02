import axios from "axios";

interface SignInData {
  input: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  message: string;
}

interface SignInError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const SignInHandler = async (
  url: string,
  data: SignInData
): Promise<SignInResponse | SignInError["response"]["data"]> => {
  try {
    const response = await axios.post<SignInResponse>(
      `${url}/auth/login`,
      data
    );

    return response.data;
  } catch (error) {
    return (error as SignInError).response.data;
  }
};
