import axios from "axios";

interface NotificationSetting {
  settingList: {
    money_overuse: number;
    spending_alert: number;
    saving_goal_alert: number;
    monthly_summary: number;
    debt_payment_reminder: number;
    sound_notification: number;
    vibration_shaking: number;
  };
  update: string;
}

interface NotificationResponse {
  success: boolean;
  result: NotificationSetting[];
}

interface NotificationError {
  response: {
    data: {
      success: boolean;
      message: string;
      result: NotificationSetting[];
    };
  };
}

export const updateNotificationSettings = async (
  url: string,
  user_id: number,
  data: NotificationSetting,
  token: string
): Promise<NotificationResponse | NotificationError["response"]["data"]> => {
  try {
    // ✅ Convert true/false to 1/0 before sending to MySQL
    const formattedData: NotificationSetting = {
      settingList: Object.fromEntries(
        Object.entries(data.settingList).map(([key, value]) => [
          key,
          value ? 1 : 0,
        ])
      ) as NotificationSetting["settingList"],
      update: new Date().toISOString(),
    };

    console.log(
      "📡 Sending PUT request to:",
      `${url}/users/user/setting/${user_id}`
    );
    console.log(
      "📨 Request Body (Converted):",
      JSON.stringify(formattedData, null, 2)
    );

    const response = await axios.put<NotificationResponse>(
      `${url}/users/user/setting/${user_id}`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating settings:", error);
    return (error as NotificationError).response.data;
  }
};

export const getNotificationSettings = async (
  url: string,
  userID: number,
  token: string
): Promise<{ success: boolean; result: { [key: string]: boolean } } | null> => {
  try {
    console.log(
      `📡 Fetching settings from API: ${url}/users/user/setting/${userID}`
    );

    const response = await axios.get(`${url}/users/user/setting/${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ API Response:", response.data);

    if (!response.data || typeof response.data !== "object") {
      console.error("❌ Unexpected response format:", response.data);
      return null;
    }

    if (response.data.success && response.data.result) {
      if (typeof response.data.result !== "object") {
        console.error(
          "❌ Expected 'result' to be an object but got:",
          response.data.result
        );
        return null;
      }

      // ✅ Convert 0/1 back to true/false before returning
      const formattedResult = Object.fromEntries(
        Object.entries(response.data.result).map(([key, value]) => [
          key,
          value === 1,
        ])
      );

      return {
        success: true,
        result: formattedResult,
      };
    } else {
      console.warn("⚠️ API call returned success=false:", response.data);
      return null;
    }
  } catch (error: any) {
    console.error(
      "❌ Error fetching settings:",
      error.response?.data || error.message
    );
    return null;
  }
};
