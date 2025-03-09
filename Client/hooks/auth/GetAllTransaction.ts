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


export const GetUserIDTransaction = async (
  url: string,
  id: number,
): Promise<
  GetUserTransactionResponse | GetUserTransactionError["response"]["data"]
> => {
  try {
    console.log("id:", id);
    const response = await axios.get<GetUserTransactionResponse>(
      `${url}/transactions/transactionID/${id}`,
    );

    return response.data;
  } catch (error) {
    return (error as GetUserTransactionError).response.data;
  }
};



export const EditIDTransaction = async (
  url: string,
  id: number,
  updatetransaction : {
    user_id: number;
    account_id: number;
    split_payment_id: number | null;
    transaction_name: string;
    amount: number;
    transaction_type: "income" | "expense";
    transaction_date: string;
    note: string;
    color_code: string;
  },
  token: string
): Promise<GetUserTransactionResponse | GetUserTransactionError["response"]["data"]> => {
  try {
    console.log("Updating Transaction ID:", id);
    console.log("Data to update:", updatetransaction);
    
    const response = await axios.put<GetUserTransactionResponse>(
      `${url}/transactions/${id}`,
      updatetransaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    console.log("✅ API Response:", response.data); // 🛠 Debug ดูว่าค่าที่ได้เป็นอะไร
    return response.data;
  } catch (error) {
    console.error("❌ Update failed:", (error as GetUserTransactionError).response.data);
    return (error as GetUserTransactionError).response.data;
  }
};