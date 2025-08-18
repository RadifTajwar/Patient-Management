import React, { useState } from "react";
import NavBar from "./Navbar";
import Sidebar from "./SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <NavBar onMenuToggle={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Overlay to close the sidebar when clicking outside */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
