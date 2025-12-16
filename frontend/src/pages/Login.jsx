// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosInstance";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     const response = await api.post("/api/users/login", {
  //       email,
  //       password,
  //     });
  //     login(response.data); // Stores token and user data in context/localStorage
  //     navigate("/admin/add", { replace: true }); // Redirect to a protected page
  //     console.log("Login Successful Response Data:", response.data);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };

  // src/pages/Login.jsx (Revised handleSubmit)
  // src/pages/Login.jsx (Finalized handleSubmit)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });
      // Console log confirms success and data structure
      console.log("Login Succeeded. Data:", response.data); // THIS LINE IS NOW SAFE and correctly formats the data internally

      login(response.data);

      navigate("/admin/add", { replace: true });
    } catch (err) {
      // This block should now only be hit on genuine API errors (401, 500, etc.)
      console.error("Login attempt failed (in catch block):", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
