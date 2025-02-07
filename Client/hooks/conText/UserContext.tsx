import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { GetUserBank, resultObject } from "../auth/GetUserBank";
import { ServerContext } from "../conText/ServerConText";

type UserContextType = {
  username: any;
  userID: any;
  email: any;
  bank: Array<resultObject> | null;
  setUsername: (user: any) => void;
  setUserID: (id: any) => void;
  setEmail: (email: any) => void;
  loading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  username: null,
  userID: null,
  email: null,
  bank: null,
  setUsername: () => {},
  setUserID: () => {},
  setEmail: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const { URL } = useContext(ServerContext);

  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState(null);
  const [bank, setBank] = useState<Array<resultObject> | null>(null);

  useEffect(() => {
    if(auth?.token){
      const decoded = auth.decodeToken(auth.token);
      setUsername(decoded.username);
      setUserID(decoded.UserID);
      setEmail(decoded.email);
      setLoading(false);

      GetUserBank(URL, userID!, auth.token)
        .then((response) => {
          if (response.success) {
            setBank(response.result);
            console.log(response.result);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

  }, [auth?.token]);

  return (
    <UserContext.Provider value={{ username, userID, email, bank, setUsername, setEmail, setUserID, loading }}>
      {children}
    </UserContext.Provider>
  );
};