import axios from "axios";

interface GetUserDetailResponse {
  success: boolean;
  data: {
    user_name: string;
    name: string;
    user_email: string;
    birth_date: string;
    gender: string;
    bio: string;
    profile_url: string;
  };
}

interface GetUserDetailError {
  success: boolean;
  message: string;
}

export const GetUserDetailHandler = async (
  url: string,
  token: string,
  user_id: number
): Promise<GetUserDetailResponse | GetUserDetailError> => {
  try {
    const response = await axios.get<GetUserDetailResponse>(
      `${url}/users/userdetail/${user_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("❌ Error fetching user details:", error.response?.data);
    return error.response?.data || { success: false, message: "Unknown error" };
  }
};
