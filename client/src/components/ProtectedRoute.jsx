import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const { loading, isAuthenticated, user } = useAuth();

    console.log("========== ProtectedRoute ==========");
    console.log("Current URL:", window.location.pathname);
    console.log("Loading:", loading);
    console.log("User:", user);
    console.log("Authenticated:", isAuthenticated);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        console.log("Redirecting to Login");
        return <Navigate to="/login" replace />;
    }

    console.log("Access Granted");

    return children;
}