import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-black tracking-tight">
          SUMMITRA
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Events Button */}
          <Link
            to="/events"
            className="px-7 py-2.5 bg-[#FFE302] text-black font-bold rounded-full text-base hover:bg-[#ffd700] transition-all"
          >
            Events
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-[#FFE302] text-black flex items-center justify-center font-bold text-lg focus:outline-none"
            >
              K
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/admindashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    alert("Logged out!");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
