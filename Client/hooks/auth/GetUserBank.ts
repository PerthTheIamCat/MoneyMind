import axios from "axios";

export interface resultObject {
  id: number;
  user_id: number;
  account_name: string;
  balance: number;
  color_code: string;
  icon_id: string;
}

interface GetUserBankResponse {
  result: Array<resultObject>;
  success: boolean;
  message: string;
}

interface GetUserBankError {
  response: {
    data: {
      result: Array<resultObject>;
      success: boolean;
      message: string;
    };
  };
}

export const GetUserBank = async (
  url: string,
  userID: number,
  token: string
): Promise<GetUserBankResponse | GetUserBankError["response"]["data"]> => {
  try {
    console.log("UserID:",userID);
    const response = await axios.get<GetUserBankResponse>(
      `${url}/bankaccounts/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return (error as GetUserBankError).response.data;
  }
};

export const UpdateUserBank = async (
  url: string,
  id: number,
  updatedAccount: {
    user_id: number;
    account_name: string;
    balance: number;
    color_code: string;
    icon_id: string;
  },
  token: string
): Promise<GetUserBankResponse | GetUserBankError["response"]["data"]> => {
  try {
    console.log("Updating UserBank ID:", id);
    console.log("Data to update:", updatedAccount);

    const response = await axios.put<GetUserBankResponse>(
      `${url}/bankaccounts/${id}`,
      updatedAccount, // ✅ ส่งข้อมูลที่ต้องการอัปเดต
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data); // 🛠 Debug ดูว่าค่าที่ได้เป็นอะไร
    return response.data; // ✅ คืนค่าที่ถูกต้องกลับมา
  } catch (error) {
    console.error("❌ Update failed:", (error as GetUserBankError).response.data);
    return (error as GetUserBankError).response.data;
  }
};


export const DeleteUserBank = async (
  url: string,
  id: number,
  token: string
): Promise<GetUserBankResponse | { success: false; message: string }> => {
  try {
    console.log("🔍 Deleting Bank ID:", id);

    const response = await axios.delete<GetUserBankResponse>(
      `${url}/bankaccounts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ API Error deleting bank:", error);

    return error.response
      ? error.response.data
      : { success: false, message: "Unknown error occurred while deleting the bank" };
  }
};
