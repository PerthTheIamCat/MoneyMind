import axios from "axios";

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
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
  data: ChangePasswordData
): Promise<ChangePasswordResponse | ChangePasswordError["response"]["data"]> => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      `${url}/auth/change-password`,
      data
    );

    return response.data;
  } catch (error) {
    console.log("Error in changing password:", error);
    return (error as ChangePasswordError).response.data;
  }
};
