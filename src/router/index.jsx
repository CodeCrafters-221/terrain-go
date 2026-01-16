import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import UserProfile from "../pages/UserProfile";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    element: <AppLayout />,
    children: [{ path: "/user-profile", element: <UserProfile /> }],
  },
]);
