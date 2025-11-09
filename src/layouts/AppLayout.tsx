import React from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import Footer from "../components/Footer";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Common Navbar */}
      <HomeNavbar />

      {/* Page content */}
      <main className="flex-1 mt-20">
        <Outlet /> {/* Renders the nested page (Home, Tracking, etc.) */}
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
