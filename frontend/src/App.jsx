import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components & Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";
import TextDetailPage from "./pages/TextDetailPage";
import ContactPage from "./pages/ContactPage";
import CompareEditionsPage from "./pages/CompareEditionsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

// Authentication Pages & Protected Route Component
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import the new component

// Admin Pages
import AdminPage from "./pages/admin/AdminPage";
import AddDataPage from "./pages/admin/AddDataPage";
import ManageTextsPage from "./pages/admin/ManageTexts";
import ManageEditionsPage from "./pages/admin/ManageEditions";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Notification />
          <main className="pb-20">
            {" "}
            {/* Add margin to prevent content overlap with footer */}
            <Routes>
              {/* === PUBLIC ROUTES === */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/text/:textId" element={<TextDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/compare" element={<CompareEditionsPage />} />

              {/* === AUTHENTICATION ROUTE === */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* === PROTECTED ADMIN ROUTES ===
                The <ProtectedRoute> wraps the routes, checking the JWT and user role.
                <Outlet /> renders the child elements if the check passes.
              */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/add" element={<AddDataPage />} />
                <Route path="/admin/texts" element={<ManageTextsPage />} />
                <Route
                  path="/admin/editions"
                  element={<ManageEditionsPage />}
                />
              </Route>

              {/* Catch-all route for 404 */}
              <Route
                path="*"
                element={
                  <h2 className="text-center pt-20 text-2xl text-gray-700">
                    404 Page Not Found
                  </h2>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
