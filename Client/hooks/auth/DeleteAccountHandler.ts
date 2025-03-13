import axios from "axios";

interface DeleteAccountResponse {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

interface DeleteAccountError {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
}

export const DeleteAccountHandler = async (
  url: string,
  token: string,
  user_id: number
): Promise<DeleteAccountResponse | DeleteAccountError["response"]["data"]> => {
  try {
    const response = await axios.delete<DeleteAccountResponse>(
      `${url}/users/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return (error as DeleteAccountError).response.data;
  }
};
