import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X, GitCompare } from "lucide-react"; // Imported GitCompare for potential use

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Helper function to determine the active class
  const getLinkClass = (path) =>
    `text-sm ${
      location.pathname === path
        ? "text-indigo-600 font-medium" // Changed to indigo for consistency with search page
        : "text-gray-600 hover:text-gray-900"
    }`;

  // Helper function for mobile links
  const MobileLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`px-3 py-1 rounded-lg ${
        location.pathname === to
          ? "bg-indigo-100 text-indigo-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      } transition duration-150 ease-in-out`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-indigo-600 transition duration-150"
          >
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-serif font-semibold">
              Classical Editions Database
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/search" className={getLinkClass("/search")}>
              Search Texts
            </Link>

            {/* NEW COMPARE LINK */}
            <Link
              to="/compare"
              className={`flex items-center gap-1.5 ${getLinkClass(
                "/compare"
              )}`}
            >
              Compare Editions
            </Link>

            {/* Original links kept for completeness */}
            <Link to="/about" className={getLinkClass("/about")}>
              About
            </Link>
            <Link to="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>
            <Link to="/admin" className={getLinkClass("/admin")}>
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700 p-1 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <MobileLink to="/">Home</MobileLink>
            <MobileLink to="/search">Search Texts</MobileLink>

            {/* NEW COMPARE LINK - Mobile */}
            <MobileLink to="/compare">Compare Editions</MobileLink>

            <MobileLink to="/about">About</MobileLink>
            <MobileLink to="/contact">Contact</MobileLink>
            <MobileLink to="/admin">Admin</MobileLink>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
