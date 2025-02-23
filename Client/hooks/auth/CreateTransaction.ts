import axios from "axios";

export interface CreateUserTransactionData {
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

interface GetUserTransactionResponse {
  result: Array<CreateUserTransactionData>;
  success: boolean;
  message: string;
}

interface GetUserTransactionError {
  response: {
    data: {
      result: Array<CreateUserTransactionData>;
      success: boolean;
      message: string;
    };
  };
}

export const CreateUserTransaction = async (
  url: string,
  data: CreateUserTransactionData,
  token: string
): Promise<
  GetUserTransactionResponse | GetUserTransactionError["response"]["data"]
> => {
  try {
    const response = await axios.post<GetUserTransactionResponse>(
      `${url}/transactions/create`,
      data,
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
