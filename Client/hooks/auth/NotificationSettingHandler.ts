import axios from "axios";

interface NotificationSetting{
    user_id : number,
    settingList : boolean[]
}

interface NotificationResponse{
    success : boolean;
    result : NotificationSetting[];
}

interface NotificationError{
    response:{
        data:{
            success: boolean,
            message : string,
            result: NotificationSetting[]
        };
    };
}

export const NotificationsPostHandler = async (
    url : string,
    data : NotificationSetting,
): Promise<NotificationResponse | NotificationError["response"]["data"]> => {
    try {
        const response = await axios.post<NotificationResponse>(`${url}/notifications/create`,data);
        return response.data;
    } catch (error) {
        return (error as NotificationError).response.data
    }
}