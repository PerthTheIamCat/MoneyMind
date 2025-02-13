import axios from "axios";

interface SignInData {
  input: string;
  password: string;
}

interface SignInResponse {
  accessToken: string;
  success: boolean;
  message: string;
}

interface SignInError {
  response: {
    data: {
      accessToken: string;
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
    // console.log("Sign In (in Handler): ", data.input, data.password);
    const response = await axios.post<SignInResponse>(
      `${url}/auth/login`,
      data
    );
    return response.data;
  } catch (error) {
    return (error as SignInError).response.data;
  }
};
