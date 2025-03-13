import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { GetUserBank, resultObject } from "../auth/GetUserBank";
import { GetRetirement, RetirementResponse } from "../auth/retirementHandler";
import { GetUserTransaction } from "../auth/GetAllTransaction";
import { ServerContext } from "../conText/ServerConText";
import { NotificationsGetHandler } from "../auth/NotificationsHandler";
import { GetUserDetailHandler } from "../auth/GetUserDetail";

type UserTransaction = {
  id: number;
  user_id: number;
  account_id: number;
  split_payment_id: number | null;
  transaction_name: string;
  amount: number;
  transaction_type: "income" | "expense";
  transaction_date: string;
  note: string;
  color_code: string;
};

type UserNotification = {
  id: number;
  user_id: number;
  notification_type: "security" | "monthly_summary";
  message: string;
  is_read: boolean;
  created_at: string;
  color_type: "green" | "yellow" | "red";
};

type UserRetire = {
  id: number;
  user_id: number;
  monthly_savings_goal: number;
  total_savings_goal: number;
  current_savings: number;
  total_fund_fv: number;
  netShortfallAtRetirement: number;
};

type UserContextType = {
  fullname: string | null;
  username: string | null;
  userID: number | null;
  email: string | null;
  bank: Array<resultObject> | null;
  birthdate: string | null;
  transaction: Array<UserTransaction> | null;
  notification: Array<UserNotification> | null;
  retire: Array<UserRetire> | null;
  gender: string | null;
  bio: string | null;
  profile_URL: string | null;

  setUsername: (user: string) => void;
  setUserID: (id: number) => void;
  setEmail: (email: string) => void;
  setFullname: (name: string) => void;
  setBirthdate: (birthdate: string) => void;
  setTransaction: (transaction: Array<UserTransaction>) => void;
  setNotification: (transaction: Array<UserNotification>) => void;
  setBank: (bank: Array<resultObject>) => void;
  setRetire: (retire: Array<UserRetire>) => void;
  setGender: (gender: string) => void;
  setBio: (bio: string) => void;
  setProfile_URL: (url: string) => void;

  loading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  fullname: null,
  username: null,
  userID: null,
  email: null,
  bank: null,
  birthdate: null,
  transaction: null,
  notification: null,
  retire: null,
  gender: null,
  bio: null,
  profile_URL: null,

  setUsername: () => {},
  setUserID: () => {},
  setEmail: () => {},
  setFullname: () => {},
  setBirthdate: () => {},
  setTransaction: () => {},
  setNotification: () => {},
  setBank: () => {},
  setRetire: () => {},
  setGender: () => {},
  setBio: () => {},
  setProfile_URL: () => {},

  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { URL } = useContext(ServerContext);

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userID, setUserID] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [bank, setBank] = useState<Array<resultObject> | null>(null);
  const [transaction, setTransaction] = useState<Array<UserTransaction> | null>(
    null
  );
  const [gender, setGender] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Array<UserNotification> | null>(null);
  const [retire, setRetire] = useState<Array<UserRetire> | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [profile_URL, setProfile_URL] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.token !== null) {
      const decoded = auth?.decodeToken(auth?.token);
      setUsername(decoded.username);
      setUserID(decoded.UserID);
      setEmail(decoded.email);
      setLoading(false);
    } else if (auth?.token === null) {
      setUsername(null);
      setUserID(null);
      setEmail(null);
      setFullname(null);
      setBirthdate(null);
      setBank(null);
      setTransaction(null);
      setNotification(null);
      setRetire(null);
      setLoading(false);
    }
  }, [auth?.token, userID]);
  useEffect(() => {
    if (userID && auth?.token) {
      (async () => {
        try {
          console.log("📡 Fetching user details...");
          const userDetails = await GetUserDetailHandler(
            URL,
            auth?.token!,
            userID
          );

          if (userDetails.success && "data" in userDetails) {
            console.log("✅ User details loaded:", userDetails.data);
            setFullname(userDetails.data.name || "No Name");
            setUsername(userDetails.data.username || "");
            setEmail(userDetails.data.email || "");
            setBirthdate(userDetails.data.birthday || "");
            setGender(userDetails.data.gender || "");
            setBio(userDetails.data.bio || "");
            setProfile_URL(userDetails.data.profile_url || "");
          } else {
            console.warn(
              "⚠️ Failed to load user details:",
              "data" in userDetails ? userDetails.message : "Unknown error"
            );
          }
        } catch (error) {
          console.error("❌ Error fetching user details:", error);
        }
      })();
    }
  }, [userID, auth?.token]);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${URL}/auth/getpin/${userID}`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        })
        .then((response) => {
          console.log("get pin response:", response.data);
          if (response.data.success) {
            if (response.data.pin) {
              auth?.setIsPinSet(true);
              auth?.setPin(response.data.pin);
            } else {
              auth?.setIsPinSet(false);
              auth?.setPin(null);
            }
          } else {
            console.log("fail to get pin:", response.data.message);
          }
        });
    })();
  }, [auth?.token, userID]);

  useEffect(() => {
    if (userID && auth?.token && auth?.isPinSet) {
      GetUserBank(URL, userID!, auth.token)
        .then((response) => {
          if (response.success) {
            setBank(response.result);
            console.log("get bank success:", response.result);
          } else {
            console.log("fail to get bank:", response.message);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });

      GetUserTransaction(URL, userID!, auth.token).then((response) => {
        if (response.success) {
          console.log("get transaction success:", response.result);
          setTransaction(response.result);
        } else {
          console.log("fail to get transaction:", response.message);
        }
      });

      NotificationsGetHandler(URL, userID, auth?.token!)
        .then((response) => {
          console.log("get notification success:", response);
          if (response.result && response.result.length > 0) {
            setNotification(response.result);
          } else {
            setNotification([]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch notifications:", error);
          setNotification([]);
        });

      GetRetirement(URL, auth?.token!).then((response) => {
        if (response.success && "result" in response) {
          console.log("get retirement success:", response);
          setRetire([
            {
              id: response.result.id,
              user_id: response.result.user_id,
              monthly_savings_goal: response.result.monthly_savings_goal,
              total_savings_goal: response.result.total_savings_goal,
              current_savings: response.result.current_savings,
              total_fund_fv: response.result.total_fund_fv,
              netShortfallAtRetirement:
                response.result.netShortfallAtRetirement,
            },
          ]);
        } else if ("message" in response) {
          console.log("fail to get retirement:", response.message);
        } else {
          console.log("fail to get retirement: Unknown error");
        }
      });
    }
  }, [fullname, userID, auth?.token, auth?.isPinSet, auth?.pin, ]);

  return (
    <UserContext.Provider
      value={{
        fullname,
        username,
        userID,
        email,
        bank,
        birthdate,
        transaction,
        notification,
        retire,
        gender,
        bio,
        profile_URL,
        setBio,
        setGender,
        setUsername,
        setEmail,
        setUserID,
        setFullname,
        setBirthdate,
        setTransaction,
        setNotification,
        setBank,
        setRetire,
        setProfile_URL,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
