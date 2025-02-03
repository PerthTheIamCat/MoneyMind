import axios from "axios";
import { ServerContext } from "../conText/ServerConText";
import { useContext } from "react";
interface SignUpData {
  username: string;
  password: string;
  password2: string;
  email: string;
  name?: string;
}

interface SignUpResponse {
  accessToken: string;
  success: boolean;
  message: string;
}

interface SignUpError {
  response: {
    data: {
      accessToken: string;
      success: boolean;
      message: string;
    };
  };
}

export const SignUpHandler = async (
  url: string,
  data: SignUpData
): Promise<SignUpResponse | SignUpError["response"]["data"]> => {

  console.log("From auth:",data);
  try {
    const response = await axios.post<SignUpResponse>(
      `${url}/auth/register`,
      data
    );

    return response.data;
  } catch (error) {
    console.log("From auth:",error);
    return (error as SignUpError).response.data;
  }
};
