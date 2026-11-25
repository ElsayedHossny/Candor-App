import { createContext, createElement, useState, type ReactNode } from "react";

export type EmailContextType = {
  emailReg: string;
  setEmailReg: (email: string) => void;
};

export const EmailContext = createContext<EmailContextType | null>(null);

function EmailContextProvider({ children }: { children: ReactNode }) {
  const [emailReg, setEmailReg] = useState("");

  return createElement(
    EmailContext.Provider,
    {
      value: {
        emailReg,
        setEmailReg,
      },
    },
    children,
  );
}

export default EmailContextProvider;
