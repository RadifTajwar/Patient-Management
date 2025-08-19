import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAccessToken, getRefreshToken, getBMDC } from "@/utils/accessutils";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const Layout: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "loaded">("loading");
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const bmdc = getBMDC();

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("BMDC:", bmdc);

    if (accessToken && refreshToken && bmdc) {
      setStatus("loaded");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <div className="nav w-full mx-auto bg-white border-b">

        <NavBar onMenuToggle={toggleSidebar} />

        </div>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
