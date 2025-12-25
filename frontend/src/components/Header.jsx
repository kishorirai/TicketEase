import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getAuthUser, clearAuth } from "../utils/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getAuthUser();
      setUser(userData);
    }
  }, []);

  // Get user initials for avatar
  const getUserInitial = () => {
    if (! user) return "? ";
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    setMenuOpen(false);
    setUser(null);
    navigate("/events");
    // Optional: Show a toast notification instead of alert
    // toast.success("Logged out successfully!");
  };

  // Handle login redirect
  const handleLogin = () => {
    navigate("/auth");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && ! event.target.closest(".profile-dropdown")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/events" className="text-white text-3xl font-black tracking-tight hover:opacity-80 transition">
          TICKETEASE
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Events Button */}
          <Link
            to="/events"
            className="px-7 py-2.5 bg-[#FFE302] text-black font-bold rounded-full text-base hover:bg-[#ffd700] transition-all"
          >
            Events
          </Link>

          {/* Conditional Rendering:  Profile or Login */}
          {isAuthenticated() && user ?  (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-[#FFE302] text-black flex items-center justify-center font-bold text-lg hover:bg-[#ffd700] transition-all focus:outline-none focus:ring-2 focus:ring-[#FFE302] focus:ring-offset-2 focus:ring-offset-black"
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                {getUserInitial()}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-gray-800 truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/admindashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <hr className="my-2" />
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login Button (when not authenticated)
            <button
              onClick={handleLogin}
              className="px-7 py-2.5 bg-white text-black font-bold rounded-full text-base hover:bg-gray-200 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Optional: Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity:  0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        . animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}