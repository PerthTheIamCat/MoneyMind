import axios from "axios";

interface ChangePasswordData {
  Newpassword : string
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
  userID : number,
  token : string
): Promise<ChangePasswordResponse | ChangePasswordError["response"]["data"]> => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      `${url}/users/forgotpwd/${userID}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in changing password:", error);
    return (error as ChangePasswordError).response.data;
  }
};
