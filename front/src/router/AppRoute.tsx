import Favorite from "@/components/Favorite/Favorite";
import Home from "@/components/Home/Home";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Login/Login";
import Signup from "@/pages/SignUp/SignUp";
import MainLayOut from "@/layout/MainLayOut";
import Users from "@/pages/Users/Users";
import AdminLayout from "@/layout/AdminLayout";
import { Analytics } from "@/pages/SuperAdminPages/Analytics";
import { Reports } from "@/pages/SuperAdminPages/Reports";
import { Permissions } from "@/pages/SuperAdminPages/Permissions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { index: true, element: <MainLayOut><Home /></MainLayOut> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // ✅ Normal user route
      {
        path: "favorites",
        element: (
          <ProtectedRoute roles={["USER", "RESTAURANT_ADMIN", "SUPERADMIN"]}>
            <Favorite />
          </ProtectedRoute>
        ),
      },

      // ✅ Restaurant admin route
      {
        path: "restaurant-dashboard",
        element: (
          <ProtectedRoute roles={["RESTAURANT_ADMIN", "SUPERADMIN"]}>
            <div>Restaurant Admin Dashboard</div>
          </ProtectedRoute>
        ),
      },

      // ✅ Super admin layout + nested routes
      {
        path: "superAdmin",
        element: (
          <ProtectedRoute roles={["SUPERADMIN"]}>
         <AdminLayout userRole="SUPERADMIN" />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Users />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "permissions",
            element: <Permissions />,
          },
        ],
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
