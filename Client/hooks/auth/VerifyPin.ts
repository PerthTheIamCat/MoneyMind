import axios from "axios";

interface VerifyPinData {
  user_id: number;
  pin: string;
}

interface VerifyPinResponse {
  success: boolean;
  message: string;
}

interface VerifyPinError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const VerifyPinHandler = async (
  url: string,
  token: string,
  data: VerifyPinData
): Promise<VerifyPinResponse | VerifyPinError["response"]["data"]> => {
  try {
    const response = await axios.post<VerifyPinResponse>(
      `${url}/auth/loginpin`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: "Unknown error occurred from pin verify",
    };
  }
};
