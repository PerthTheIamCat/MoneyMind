import React, { createContext, useState, ReactNode, useContext } from "react";

type ServerContextType = {
  URL: string;
  username?: string;
  email?: string;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
}
export const ServerContext = createContext<ServerContextType>({
    URL: "http//localhost:3000/auth/register",
    setUsername: () => {},
    setEmail: () => {},
});

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const { URL } = useContext(ServerContext);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");


  return (
    <ServerContext.Provider value={{ URL, setUsername, setEmail, username, email }}>
      {children}
    </ServerContext.Provider>
  );
};
