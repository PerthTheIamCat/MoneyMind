import React, { createContext, useState, ReactNode } from "react";

type ServerContextType = {
  HOST: string;
  PORT: number;
}
export const ServerContext = createContext<ServerContextType>({
    HOST: "http://localhost",
    PORT: 3000,
});

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const HOST = "http://localhost";
  const PORT = 3000;

  return (
    <ServerContext.Provider value={{ HOST, PORT }}>
      {children}
    </ServerContext.Provider>
  );
};
