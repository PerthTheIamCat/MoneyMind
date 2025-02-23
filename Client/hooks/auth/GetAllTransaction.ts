import axios from "axios";

export type UserTransaction = {
  id: number | null;
  user_id: number | null;
  account_id: number | null;
  split_payment_id: number | null;
  transaction_name: string | null;
  amount: number;
  transaction_type: "income" | "expense";
  transaction_date: string | null;
  note: string | null;
  color_code: string | null;
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
