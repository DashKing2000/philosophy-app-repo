import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { storage } from "@/lib/storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = storage.getItem("currentUser") && sessionStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
