import axios from "axios";

export type UserTransaction = {
  id: number;
  user_id: number;
  account_id: number;
  split_payment_id: number | null;
  transaction_name: string;
  amount: number;
  transaction_type: "income" | "expense";
  transaction_date: string;
  note: string;
  color_code: string;
};

interface GetUserTransactionResponse {
  result: Array<UserTransaction>;
  success: boolean;
  message: string;
}

interface GetUserTransactionError {
  response: {
    data: {
      result: Array<UserTransaction>;
      success: boolean;
      message: string;
    };
  };
}

export const GetUserTransaction = async (
  url: string,
  userID: number,
  token: string
): Promise<
  GetUserTransactionResponse | GetUserTransactionError["response"]["data"]
> => {
  try {
    console.log("UserID:", userID);
    const response = await axios.get<GetUserTransactionResponse>(
      `${url}/transactions/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return (error as GetUserTransactionError).response.data;
  }
};
