import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getAuthUser, clearAuth } from "../utils/auth";
import { Sparkles, User, Calendar, Settings, LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getAuthUser();
      setUser(userData);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for avatar
  const getUserInitial = () => {
    if (! user) return "?";
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
    setMobileMenuOpen(false);
    setUser(null);
    navigate("/events");
  };

  // Handle login redirect
  const handleLogin = () => {
    navigate("/auth");
    setMobileMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".profile-dropdown")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/10" 
            : "bg-black/40 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="container mx-auto px-6 md:px-10 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/events" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-white text-2xl md:text-3xl font-black tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover: from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                TICKETEASE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Events Button */}
              <Link
                to="/events"
                className="px-6 py-2.5 glass-effect text-white font-semibold rounded-full hover:bg-white/10 transition-all border border-white/10 hover:border-purple-500/50"
              >
                Browse Events
              </Link>

              {/* Conditional Rendering:  Profile or Login */}
              {isAuthenticated() && user ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 glass-effect rounded-full hover:bg-white/10 transition-all border border-white/10 hover: border-purple-500/50 group"
                    aria-label="User menu"
                    aria-expanded={menuOpen}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-lg">
                      {getUserInitial()}
                    </div>
                    <span className="text-white font-semibold hidden lg:block">
                      {user.name?. split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-64 glass-effect bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-5 py-4 border-b border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                            {getUserInitial()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">
                              {user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                          <span className="font-semibold">Profile </span>
                        </Link>
                      </div>

                      <hr className="border-white/10 my-2" />

                      <button
                        className="flex items-center gap-3 w-full px-5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-semibold group"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Login Button (when not authenticated)
                <button
                  onClick={handleLogin}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> :  <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Menu Content */}
          <div className="absolute top-20 left-0 right-0 mx-4 glass-effect bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-slideDown">
            <div className="p-6 space-y-4">
              {/* User Info (if authenticated) */}
              {isAuthenticated() && user && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-lg">
                    {getUserInitial()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{user.name || "User"}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Events Link */}
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Browse Events</span>
              </Link>

              {isAuthenticated() && user ? (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">My Bookings</span>
                  </Link>
                  <Link
                    to="/admindashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">Profile Settings</span>
                  </Link>
                  <hr className="border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity:  0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform:  translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        . glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </>
  );
}