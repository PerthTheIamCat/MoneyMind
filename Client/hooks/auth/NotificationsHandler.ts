import axios from "axios";

interface NoticePut{
    user_id : number,
    notification_type : string,
    message : string
}

interface NoticeResponse{
    response:{
        data:{
            success : boolean,
            message : string
        };
    };
}

interface NoticeError{
    response:{
        data:{
            success: boolean,
            message : string
        };
    };
}

export const NotificationsPostHandler = async (
    url : string,
    data : NoticePut,
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
    try {
        const response = await axios.post<NoticeResponse>(`${url}/notifications/create`,data);
        return response.data;
    } catch (error) {
        return (error as NoticeError).response.data
    }
}

export const NotificationsGetHandler = async (
    url : string,
    user_id : number,
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
    try {
        const response = await axios.get<NoticeResponse>(`${url}/notifications/${user_id}`);
        return response.data;
    } catch(error){
        return (error as NoticeError).response.data
    }
}

export const NotificationsDeleteHandler = async (
    url : string,
    user_id : number,
): Promise<NoticeResponse | NoticeError["response"]["data"]> => {
    try {
        const response = await axios.delete<NoticeResponse>(`${url}/notifications/${user_id}`);
        return response.data;
    } catch(error){
        return (error as NoticeError).response.data
    }
}