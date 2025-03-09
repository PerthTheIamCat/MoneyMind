import axios from "axios";

interface NoticePut {
  id?: number;
  user_id: number;
  notification_type: "security" | "monthly_summary";
  message: string;
  is_read?: boolean;
  created_at?: string;
  color_type: "green" | "yellow" | "red";
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
  data: NoticePut,
  token: string
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
  try {
    const response = await axios.post<NoticeResponse>(
      `${url}/notifications/create`,
      data,
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
  token: string
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
    console.log(id);
    return response.data;
  } catch (error) {
    return (error as NoticeError).response.data;
  }
};

export const NotificationsPutHandler = async (
  url: string,
  id: number,
  data: NoticePut,
  token: string
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
  try {
    const response = await axios.put<NoticeResponse>(
      `${url}/notifications/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(id + " " + data);
    return response.data;
  } catch (error) {
    return (error as NoticeError).response.data;
  }
};
