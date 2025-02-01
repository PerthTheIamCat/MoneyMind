import React, { createContext, useState, ReactNode, useContext } from "react";

type ServerContextType = {
  HOST: string;
  PORT: number;
  username?: string;
  email?: string;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
}
export const ServerContext = createContext<ServerContextType>({
    HOST: "http://localhost",
    PORT: 3000,
    setUsername: () => {},
    setEmail: () => {},
});

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const { HOST, PORT } = useContext(ServerContext);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");


  return (
    <ServerContext.Provider value={{ HOST, PORT, setUsername, setEmail, username, email }}>
      {children}
    </ServerContext.Provider>
  );
};
