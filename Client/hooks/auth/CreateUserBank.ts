import axios from "axios";

export interface CreateUserBankData {
  user_id: number;
  account_name: string;
  balance: number;
  color_code: string;
  icon_id: string;
}

interface GetUserBankResponse {
  success: boolean;
  message: string;
}

interface GetUserBankError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const CreateUserBank = async (
  url: string,
  data: CreateUserBankData,
  token: string
): Promise<GetUserBankResponse | GetUserBankError["response"]["data"]> => {
  try {
    const response = await axios.post<GetUserBankResponse>(
      `${url}/bankaccounts/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    return (error as GetUserBankError).response.data;
  }
};
