import "./App.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./Routing/Layout/Layout";
import Home from "./Pages/Home/Home";
import Messages from "./Pages/Messages/Messages";
import NotFound from "./Pages/NotFound/NotFound";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";
import { Toaster } from "sonner";
import VerifyEmail from "./Auth/VerifyEmail/VerifyEmail";
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "messages",
        element: <Messages />,
      },

      {
        path: "register",
        element: <Register />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <div className=" grid-background">
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
