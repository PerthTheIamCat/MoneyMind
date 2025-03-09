import axios from "axios";

interface NotificationResponse {
  success: boolean;
  result: { [key: string]: boolean };
}

export const getNotificationSettings = async (
  url: string,
  userID: number,
  token: string
): Promise<NotificationResponse | null> => {
  try {
    const response = await axios.get<NotificationResponse>(
      `${url}/user/setting/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};
