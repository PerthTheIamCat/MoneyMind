import React, { createContext, useState, ReactNode, useContext } from "react";

type ServerContextType = {
  URL: string;
  username?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  otp?: string;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirmation: (value: string) => void;
  setOtp: (value: string) => void;
};
export const ServerContext = createContext<ServerContextType>({
  URL: "http://192.168.230.190:3000",
  setUsername: () => {},
  setEmail: () => {},
  setPassword: () => {},
  setPasswordConfirmation: () => {},
  setOtp: () => {},
});

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const { URL } = useContext(ServerContext);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  return (
    <ServerContext.Provider
      value={{
        URL,
        setUsername,
        setEmail,
        setPassword,
        setPasswordConfirmation,
        setOtp,
        username,
        email,
        password,
        passwordConfirmation,
        otp,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
