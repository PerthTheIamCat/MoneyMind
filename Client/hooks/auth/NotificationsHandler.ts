import axios from "axios";

interface NoticePut {
  id: number;
  user_id: number;
  notification_type: string;
  message: string;
  color_type: string;
}

interface NoticeResponse {
  success: boolean;
  result: NoticePut[];
}

interface NoticeError {
  response: {
    data: {
      success: boolean;
      message: string;
      result: NoticePut[];
    };
  };
}

export const NotificationsPostHandler = async (
  url: string,
  data: NoticePut
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
  try {
    const response = await axios.post<NoticeResponse>(
      `${url}/notifications/create`,
      data
    );
    return response.data;
  } catch (error) {
    return (error as NoticeError).response.data;
  }
};

export const NotificationsGetHandler = async (
  url: string,
  user_id: number,
  token: string
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
  try {
    const response = await axios.get<NoticeResponse>(
      `${url}/notifications/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return (error as NoticeError).response.data;
  }
};

export const NotificationsDeleteHandler = async (
  url: string,
  id: number,
  token: string,
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
  try {
    const response = await axios.delete<NoticeResponse>(
      `${url}/notifications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(id)
    return response.data;
  } catch (error) {
    return (error as NoticeError).response.data;
  }
};
