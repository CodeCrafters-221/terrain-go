import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import UserProfile from "../components/UserProfile";
import TerrainDetails from "../pages/TerrainDetails";
import SearchPage from "../pages/SearchPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/terrain-details",
        element: <TerrainDetails />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },
]);
