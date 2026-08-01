import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

const Header = ({ onMenuToggle, isSidebarOpen, notificationCount = 0 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user data from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = !loading && userData ? userData.name : "Admin";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 h-16 bg-white shadow shadow-[#00000040] flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      {/* Left — hamburger (mobile only) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#0B1A35] hover:bg-[#0B1A35]/5 transition-colors flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Spacer to push right-side content when hamburger is hidden */}
      <div className="hidden lg:block flex-1" />

      {/* Right — notifications + admin avatar dropdown */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        {/* <button
          className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#0B1A35] hover:bg-[#0B1A35]/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1.5 w-4.5 h-4.5 min-w-[18px] px-1 bg-[#E29C15] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button> */}

        {/* Admin dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#0B1A35]/5 transition-colors"
            aria-label="Admin menu"
          >
            <div className="w-9 h-9 rounded-full bg-[#E29C15] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {!loading && userData ? getInitials(userData.name) : "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#0B1A35]">
              {displayName}
            </span>
            <ChevronDown
              size={16}
              className={`hidden sm:block text-[#0B1A35]/50 transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#E29C15]/30 shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-[#E29C15]/20">
                <p className="text-sm font-semibold text-[#0B1A35] truncate">{displayName}</p>
                {userData?.email && (
                  <p className="text-xs text-[#0B1A35]/60 truncate">{userData.email}</p>
                )}
              </div>

              <div className="py-1 px-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg flex items-center gap-3 font-medium"
                >
                  <LogOut size={16} className="flex-shrink-0" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;