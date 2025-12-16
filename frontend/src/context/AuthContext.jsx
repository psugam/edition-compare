// src/context/AuthContext.jsx (Revised)
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Function to safely parse JSON from localStorage
const getInitialAuthState = () => {
  try {
    const storedAuth = localStorage.getItem("userAuth");
    return storedAuth ? JSON.parse(storedAuth) : { user: null, token: null };
  } catch (e) {
    console.error("Could not parse auth state from localStorage:", e);
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  // Load initial state from local storage
  const [authState, setAuthState] = useState(getInitialAuthState);
  const [notification, setNotification] = useState(null); // { message: string, type: 'success'|'error' }

  // Use effect to persist state changes to local storage
  useEffect(() => {
    if (authState.token) {
      localStorage.setItem("userAuth", JSON.stringify(authState));
    } else {
      // Clear storage if we log out or the state is cleared
      localStorage.removeItem("userAuth");
    }
  }, [authState]);

  const login = (data) => {
    const { token, id, username, role, email } = data;

    const userData = { id, username, role, email };

    setAuthState({
      user: userData,
      token: token,
    });

    // **USE THE setPopup HELPER HERE**
    setPopup(`Welcome back, ${userData.username}!`, "success");
  };

  const logout = () => {
    setAuthState({ user: null, token: null });

    // **USE THE setPopup HELPER HERE**
    setPopup("You have been logged out.", "success");
  };

  // Function to set the temporary notification (for redirect messages)
  const setPopup = (message, type = "error", duration = 5000) => {
    setNotification({ message, type });

    // Clear any previous timeouts to prevent conflicting messages from clearing too early
    if (window._notificationTimer) {
      clearTimeout(window._notificationTimer);
    }

    // Set the timeout to clear the notification
    window._notificationTimer = setTimeout(() => {
      setNotification(null);
      window._notificationTimer = null;
    }, duration);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: !!authState.token,
        login,
        logout,
        notification, // Pass the notification state
        setPopup, // Pass the function to trigger notifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
