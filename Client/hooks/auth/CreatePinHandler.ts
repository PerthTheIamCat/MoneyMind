import axios from "axios";

interface PinSetting {
  user_id: number;
  pin: string;
}

interface PinResponse {
  success: boolean;
  message: string;
}

interface PinError {
  response?: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const CreatePinHandler = async (
  url: string,
  data: PinSetting,
  token: string
): Promise<PinResponse | { success: boolean; message: string }> => {
  try {
    const response = await axios.put<PinResponse>(
      `${url}/auth/createpin`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as PinError;
    return err.response
      ? err.response.data
      : { success: false, message: "An error occurred" };
  }
};
