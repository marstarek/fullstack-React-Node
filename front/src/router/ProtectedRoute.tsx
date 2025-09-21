import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

function decodeToken(token: string | null) {
  if (!token) return null;
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") as string) 
  console.log(token)
  // const user = decodeToken(token);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
