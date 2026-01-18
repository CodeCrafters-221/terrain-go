import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import UserProfile from "../components/UserProfile";
import TerrainDetails from "../pages/TerrainDetails";
import SearchPage from "../pages/SearchPage";
// import UserProfile from "../pages/UserProfile";


export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    element: <UserProfile />,
    children: [{ path: "/user-profile", element: <UserProfile/> }],
  },
  {
    element: '',
    children: [{ path: "/terrain-details", element: <TerrainDetails/> }],
  },
  {
    element: <SearchPage/>,
    children: [{ path: "/search", element: <SearchPage/> }],
  },
]);
