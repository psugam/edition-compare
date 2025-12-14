import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-serif">
              Classical Editions Database
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className={`text-sm ${
                location.pathname === "/"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`text-sm ${
                location.pathname === "/search"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Search Texts
            </Link>
            <Link
              to="/about"
              className={`text-sm ${
                location.pathname === "/about"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
