import axios from "axios";

export interface DeleteUserTransactionData {
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
}

interface DeleteUserTransactionResponse {
  success: boolean;
  message: string;
}

interface DeleteUserTransactionError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const DeleteUserTransaction = async (
  url: string,
  transaction_id: number,
  token: string
): Promise<
  DeleteUserTransactionResponse | DeleteUserTransactionError["response"]["data"]
> => {
  try {
    const response = await axios.delete<DeleteUserTransactionResponse>(
      `${url}/transactions/${transaction_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return (error as DeleteUserTransactionError).response.data;
  }
};
