// src/components/ProtectedRoute.jsx (Revised)
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, setPopup } = useAuth(); // Get setPopup
  const location = useLocation();

  // 1. Check if authenticated
  if (!isAuthenticated) {
    // Redirect to login. Pass the original path to redirect back later.
    // Fix for DataCloneError: Only pass the simple pathname string, not the full location object.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. Check if the user is authorized (role check)
  const userRole = user?.role;

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // User is logged in but does not have the required role (e.g., 'user' accessing '/admin')

    // Trigger the popup message
    setPopup(
      "🛑 You do not have permission to access the administration pages.",
      "error"
    );

    // Redirect to home. No state needed here as the message is handled by setPopup.
    // Fix for DataCloneError: Don't pass state on this redirect.
    return <Navigate to="/" replace />;
  }

  // 3. User is authenticated AND authorized: Render the child route
  return <Outlet />;
};

export default ProtectedRoute;
