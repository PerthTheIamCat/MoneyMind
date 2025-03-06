import axios from "axios";

interface GetPinResponse {
  success: boolean;
  pin?: string;
  message?: string;
}

export const getPinFromDatabase = async (
  url: string,
  userID: number
  //  token: string
): Promise<string | null> => {
  try {
    const response = await axios.get<GetPinResponse>(
      `${url}/auth/getpin/${userID}` // Now matches the fixed backend route
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
    );

    if (response.data.success) {
      return response.data.pin || null;
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};
