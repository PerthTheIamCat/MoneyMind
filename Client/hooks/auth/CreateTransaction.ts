import axios from "axios";

export interface CreateUserTransactionData{
    id: number | null;
    user_id: number | null;
    account_id: number | null;
    split_payment_id : number | null;
    transaction_name : string | null;
    amount : number;
    transaction_type : "income" | "expense";
    transaction_date : string | null;
    note : string | null;
    color_code : string | null;
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

export const CreateUserTransaction = async(
    url: string,
    data: CreateUserTransactionData,
    token: string
): Promise<GetUserTransactionResponse | GetUserTransactionError["response"]> => {
    try {
        const response = await axios.post<GetUserTransactionResponse>(
            `${url}/transactions/create`,
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error){
        return (error as GetUserTransactionError).response.data;
    }
}