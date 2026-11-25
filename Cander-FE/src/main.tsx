import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import EmailContextProvider from "./Context/auth.context.ts";
import AuthContextProvider from "./Context/token.context.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <EmailContextProvider>
        <App />
      </EmailContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
