import axios from "axios";

interface ChangePasswordData {
  password : string
}

interface ChangePasswordResponse {
  success : boolean
  message : string
}

interface ChangePasswordError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const ChangePasswordHandler = async (
  url: string,
  data: ChangePasswordData,
  otp : string,
  email : string
): Promise<ChangePasswordResponse | ChangePasswordError["response"]["data"]> => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      `${url}/users/forgotpwd`,
      data,
      {
        headers: {
          otp : `${otp}`,
          email : `${email}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in changing password:", error);
    return (error as ChangePasswordError).response.data;
  }
};
