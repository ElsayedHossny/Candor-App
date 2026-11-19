import "./App.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./Routing/Layout/Layout";
import Home from "./Pages/Home/Home";
import Messages from "./Pages/Messages/Messages";
import NotFound from "./Handle_Components/NotFound/NotFound";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";
import Logout from "./Auth/Logout/Logout";

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
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
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
    <div className="grid-background">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
