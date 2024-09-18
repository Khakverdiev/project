import App from "./App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "home",
        element: <Home />
      }
    ],
  },
];

export default routes;