import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

export function RoleRedirect() {
    const { user, loading } = useAuth();

    // Wait until authentication is loaded
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin
    if (user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Normal user
    return <Navigate to="/products" replace />;
}