import { createContext, createElement, useState, type ReactNode } from "react";

type AuthContextType = {
  accessToken: string;
  setAccessToken: (token: string) => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);
export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [accessToken, setAccessToken] = useState("");

  return createElement(
    AuthContext.Provider,
    { value: { accessToken, setAccessToken } },
    children,
  );
}
