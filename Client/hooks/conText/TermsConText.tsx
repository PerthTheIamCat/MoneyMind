import React, { createContext, useState, ReactNode } from "react";

type TermsContextType = {
  isAccepted: boolean;
  setIsAccepted: (value: boolean) => void;
};

export const TermsContext = createContext<TermsContextType>({
  isAccepted: false,
  setIsAccepted: () => {},
});

export const TermsProvider = ({ children }: { children: ReactNode }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <TermsContext.Provider value={{ isAccepted, setIsAccepted }}>
      {children}
    </TermsContext.Provider>
  );
};
