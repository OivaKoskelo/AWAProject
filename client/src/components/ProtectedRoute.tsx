import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const ProtectedRoute = ({ children}: Props) => {
    const { user } = useAuth();
    //Throws users that have not logged in back to login page
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
};

export default ProtectedRoute;