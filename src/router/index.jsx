import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import UserProfile from "../pages/UserProfile";
import TerrainDetails from "../pages/TerrainDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import BookingPage from "../pages/BookingPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// export const router = createBrowserRouter([
//   {
//     element: <AppLayout />,
//     children: [{ path: "/", element: <Home /> }],
//   },
//   {
//     element: <UserProfile/>,
//     children: [{ path: "/user-profile", element: <UserProfile /> }],
//   },
//   {
//     element: <TerrainDetails />,
//     children: [{ path: "/terrain-details", element: <TerrainDetails /> }],
//   },
//   {
//     element: <SearchPage/>,
//     children: [{ path: "/search", element: <SearchPage /> }],
//   },
// ]);


export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/profile",
        element: <ProtectedRoute> <UserProfile /> </ProtectedRoute>,
      },
      {
        path: "/terrain-details",
        element: <TerrainDetails />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      // {
      //   path: "/booking",
      //   element: <ProtectedRoute> <BookingPage /> </ProtectedRoute>
      // }
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  }
]);