// src/components/Notification.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

function Notification() {
  const { notification } = useAuth();

  if (!notification) return null;

  const baseClasses =
    "fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 text-white font-medium transition-all duration-300 transform";
  const typeClasses =
    notification.type === "error"
      ? "bg-red-600 border-l-4 border-red-800"
      : "bg-green-600 border-l-4 border-green-800";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {notification.message}
    </div>
  );
}

export default Notification;
