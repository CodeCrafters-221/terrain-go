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
import CreateProfile from "../components/CreateProfile";
import DashboardLayout from "../layouts/DashboardLayout";
import Overview from "../sections/Dashboard/Overview";
import MyTerrains from "../sections/Dashboard/MyTerrains";
import Reservations from "../sections/Dashboard/Reservations";
import CreateField from "../components/CreateField";
import CreateFieldDetails from "../components/CreateFieldDetails";

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
        element: (
          <ProtectedRoute>
            {" "}
            <UserProfile />{" "}
          </ProtectedRoute>
        ),
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
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "terrains", element: <MyTerrains /> },
      { path: "reservations", element: <Reservations /> },
      // Add more dashboard routes here
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/create-profile",
        element: (
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-field",
        element: (
          <ProtectedRoute>
            <CreateField />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-field-details",
        element: (
          <ProtectedRoute>
            <CreateFieldDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
