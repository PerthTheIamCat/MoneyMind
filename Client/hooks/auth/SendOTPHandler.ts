import axios from "axios";

interface SendOTPData {
  email: string;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
}

interface SendOTPError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const SendOTPHandler = async (
  url: string,
  data: SendOTPData
): Promise<SendOTPResponse | SendOTPError["response"]["data"]> => {
  try {
    const response = await axios.post<SendOTPResponse>(
      `${url}/auth/otpSend`,
      data
    );

    return response.data;
  } catch (error) {
    return (error as SendOTPError).response.data;
  }
};