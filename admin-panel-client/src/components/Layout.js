import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Use the full pathname instead of just the last segment
  const activePath = location.pathname;

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Guard every /admin-panel/* route — runs on mount AND on every
  // navigation within the admin panel, so deleting the token while
  // already on a gallery/blogs/etc page kicks you out on the next visit.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setCheckingAuth(false);
  }, [location.pathname, navigate]);

  // Avoid flashing protected content before the token check finishes
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <p className="text-sm text-[#5B2D07]">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      {/* Sidebar */}
      <Sidebar
        activePath={activePath}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Header */}
      <Header
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        notificationCount={9}
      />

      {/* Main content — offset by header (pt-16) and sidebar (lg:pl-64) */}
      <main className="pt-16 lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;