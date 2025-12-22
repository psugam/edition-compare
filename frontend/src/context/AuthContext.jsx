// src/context/AuthContext.jsx (Revised)
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

const AuthContext = createContext();

// Function to safely parse JSON from localStorage
const getInitialAuthState = () => {
  try {
    const storedAuth = localStorage.getItem("userAuth");
    if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        // Here you could also check for token expiry if you were using a JWT library
        return auth;
    }
    return { user: null, token: null };
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
      api.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      // Clear storage if we log out or the state is cleared
      localStorage.removeItem("userAuth");
      delete api.defaults.headers.common['Authorization'];
    }
  }, [authState]);

  const login = (data) => {
    const { token, id, username, role, email } = data;
    const userData = { id, username, role, email };
    setAuthState({ user: userData, token: token });
    setPopup(`Welcome back, ${userData.username}!`, "success");
  };

  const logout = (message = "You have been logged out.") => {
    setAuthState({ user: null, token: null });
    setPopup(message, "success");
    // Forcing a redirect to login. This will also clear any component state.
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
  };

  // This effect sets up the Axios interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if the error is a 401, and that we have a token in state (meaning user should be logged in)
        if (error.response?.status === 401 && authState.token) {
          logout("Your session has expired. Please log in again.");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to remove the interceptor when the provider unmounts
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [authState.token]); // Rerun if token changes

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
