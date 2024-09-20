import AboutUs from "./AboutUs";
import App from "./App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Cart from "./Cart";
import Contacts from "./Contacts";
import Delivery from "./Delivery";
import Home from "./Home";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
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
        element: <Home />,
      },
      {
        path: "about-us",
        element: <AboutUs />
      },
      {
        path: "contacts",
        element: <Contacts />
      },
      {
        path: "delivery",
        element: <Delivery />
      },
      {
        path: "cart",
        element: <Cart />
      },
    ],
  },
];

export default routes;