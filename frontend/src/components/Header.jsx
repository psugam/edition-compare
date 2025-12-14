import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

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

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden mt-4 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
              className={`text-sm ${
                location.pathname === "/about"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
