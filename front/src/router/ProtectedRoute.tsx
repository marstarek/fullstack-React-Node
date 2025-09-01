// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useSelector((state: RootState) => state.auth);

  return token ? children : <Navigate to="/" replace />;
}
