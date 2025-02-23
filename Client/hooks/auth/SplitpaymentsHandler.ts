import axios from "axios";

export interface SplitpaymentData{
    user_id: number;
    account_id: number;
    split_name: string;
    amount_allocated: number;
    color_type: string;
    icon_id: string;
}

interface SplitpaymentsResponse{
    result : SplitpaymentData[];
    success : boolean;
    message : string;
}

interface SplitpaymentsError{
    response:{
        data:{
            result: SplitpaymentData[]
            success: boolean,
            message : string,
        };
    };
}

export const SplitpaymentsPostHandler = async (
    url : string,
    data : SplitpaymentData,
    token: string,
): Promise<SplitpaymentsResponse | SplitpaymentsError["response"]["data"]> => {
    try {
        const response = await axios.post<SplitpaymentsResponse>(
            `${url}/splitpayments/create`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        return (error as SplitpaymentsError).response.data
    }
}

export const SplitpaymentsGetHandler = async (
    url : string,
    account_id : number,
    token: string,
    
): Promise<SplitpaymentsResponse| SplitpaymentsError["response"]["data"]> => {
    try {
        const response = await axios.get<SplitpaymentsResponse>(
            `${url}/splitpayments/${account_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch(error){
        return (error as SplitpaymentsError).response.data
    }
}

export const SplitpaymentsPutHandler = async (
    url : string,
    id : number,
    data : SplitpaymentData,
    token: string,
): Promise<SplitpaymentsResponse | SplitpaymentsError["response"]["data"]> => {
    try {
        const response = await axios.put<SplitpaymentsResponse>(
            `${url}/splitpayments/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        return (error as SplitpaymentsError).response.data
    }
}

export const SplitpaymentsDeleteHandler = async (
    url : string,
    id : number,
    token: string,

): Promise<SplitpaymentsResponse | SplitpaymentsError["response"]["data"]> => {
    try {
        const response = await axios.delete<SplitpaymentsResponse>(
            `${url}/splitpayments/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch(error){
        return (error as SplitpaymentsError).response.data
    }
}