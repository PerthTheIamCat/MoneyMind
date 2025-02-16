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
  userID: number,
  data: resultObject,
  token: string
): Promise<GetUserBankResponse | GetUserBankError["response"]["data"]> => {
  try {
    console.log("UserID:",userID);
    const response = await axios.put<GetUserBankResponse>(
      `${url}/bankaccounts/${userID}`,
      data,
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

export const DeleteUserBank = async (
  url: string,
  id: number,
  token: string
): Promise<GetUserBankResponse | GetUserBankError["response"]["data"]> => {
  try {
    console.log("BankID:", id);
    const response = await axios.delete<GetUserBankResponse>(
      `${url}/bankaccounts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    return (error as GetUserBankError).response.data;
  }
};