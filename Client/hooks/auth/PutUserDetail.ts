import axios from "axios";

interface UpdateUserDetailResponse {
  success: boolean;
  message: string;
}

interface UpdateUserDetailError {
  response: {
    success: boolean;
    message: string;
  };
}

// ✅ Update User Details API Call
export const UpdateUserDetailHandler = async (
  url: string,
  token: string,
  user_id: number,
  userData: {
    user_name: string;
    name: string;
    email: string;
    birth_date: string;
    gender: string;
    bio: string;
  }
): Promise<UpdateUserDetailResponse | UpdateUserDetailError["response"]> => {
  try {
    // Ensure email is never null
    if (!userData.email) {
      throw new Error("Email cannot be null. Please ensure email is provided.");
    }

    console.log(
      "📡 Sending PUT request to:",
      `${url}/users/userdetail/${user_id}`
    );
    console.log("📨 Request Body:", JSON.stringify(userData, null, 2));

    const response = await axios.put<UpdateUserDetailResponse>(
      `${url}/users/userdetail/${user_id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error updating user details:",
      error.response?.data || error.message
    );
    return error.response?.data || { success: false, message: "Unknown error" };
  }
};
