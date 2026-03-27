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
import CreateField from "../components/CreateField";
import CreateFieldDetails from "../components/CreateFieldDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import MyFields from "../pages/Dashboard/MyFields";
import MyReservations from "../pages/Dashboard/MyReservations";
import Statistics from "../pages/Dashboard/Statistics";
import Revenues from "../pages/Dashboard/Revenues";
import CreateFieldPage from "../pages/Dashboard/CreateFieldPage";
import EditFieldPage from "../pages/Dashboard/EditFieldPage";
import Settings from "../pages/Dashboard/Settings";
import MySubscriptions from "../pages/Dashboard/MySubscriptions";
import Owners from "../pages/Owners";

import OwnerRedirect from "../components/OwnerRedirect";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "terrains",
        element: <MyFields />,
      },
      {
        path: "reservations",
        element: <MyReservations />,
      },
      {
        path: "abonnements",
        element: <MySubscriptions />,
      },
      {
        path: "stats",
        element: <Statistics />,
      },
      {
        path: "revenues",
        element: <Revenues />,
      },
      {
        path: "create-field",
        element: <CreateFieldPage />,
      },
      {
        path: "edit-field/:id",
        element: <EditFieldPage />,
      },
      {
        path: "compte",
        element: <Settings />,
      },
    ],
  },
  {
    element: (
      <OwnerRedirect>
        <AppLayout />
      </OwnerRedirect>
    ),
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/terrain-details/:id",
        element: <TerrainDetails />,
      },
      {
        path: "/compte",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <OwnerRedirect>
            <Login />
          </OwnerRedirect>
        ),
      },
      {
        path: "/register",
        element: (
          <OwnerRedirect>
            <Register />
          </OwnerRedirect>
        ),
      },
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
          <ProtectedRoute allowedRoles={["owner"]}>
            <CreateField />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-field-details",
        element: (
          <ProtectedRoute allowedRoles={["owner"]}>
            <CreateFieldDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/owners",
    element: (
      <OwnerRedirect>
        <Owners />
      </OwnerRedirect>
    ),
  },
]);
