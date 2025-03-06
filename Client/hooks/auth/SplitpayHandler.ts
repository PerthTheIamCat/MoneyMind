import axios from "axios";
interface SplitpayData {
  user_id: number;
  account_id: number;
  split_name: string;
  amount_allocated: number;
  remaining_balance: number;
  color_code: string;
  icon_id: number;
}

interface SplitpayResponse {
  result: SplitpayData[];
  success: boolean;
  message: string;
}

interface SplitpayError {
  response: {
    data: {
      result: SplitpayData[];
      success: boolean;
      message: string;
    };
  };
}

export const addSplitpay = async (
  url: string,
  data: SplitpayData,
  token: string
): Promise<SplitpayResponse | SplitpayError["response"]["data"]> => {
  // console.log("From auth:",data);
  try {
    const response = await axios.post<SplitpayResponse>(
      `${url}/splitpayments/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("From splitpayHandler:", response.data);
    return response.data;
  } catch (error) {
    console.log("From splitpayHandler:", error);
    return (error as SplitpayError).response.data;
  }
};

export const getSplitpay = async (
  url: string,
  account_id: number,
  token: string
): Promise<SplitpayResponse | SplitpayError["response"]["data"]> => {
  // console.log("From auth:",data);
  try {
    const response = await axios.get<SplitpayResponse>(
      `${url}/splitpayments/${account_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("From splitpayHandler:", response.data);
    return response.data;
  } catch (error) {
    console.log("From splitpayHandler:", error);
    return (error as SplitpayError).response.data;
  }
};
