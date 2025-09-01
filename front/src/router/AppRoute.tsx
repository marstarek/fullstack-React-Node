// AppRoute.tsx
import Favorite from "@/components/Favorite/Favorite";
import Home from "@/components/Home/Home";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Login/Login";
import Signup from "@/pages/SignUp/SignUp";
import MainLayOut from "@/layout/MainLayOut";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { index: true, element: <MainLayOut><Home /></MainLayOut> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Favorite />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
