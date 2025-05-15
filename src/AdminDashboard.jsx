import { useState } from "react";
import Cookies from "js-cookie";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import UserTable from "./components/UserTable";
import VehicleTable from "./components/VehicleTable";
import Sidebar from "./components/SideBar";
import CategoryGrid from "./components/categoryGrid";
import MarkGrid from "./components/MarkGrid";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserTable />;
      case "vehicles":
        return <VehicleTable />;
      case "categories":
        return <CategoryGrid />;
      case "marks":
        return <MarkGrid />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="flex mt-[80px] flex-1 overflow-hidden">
        {/* Sidebar with hover effect */}
        <div className="group relative h-full w-16 hover:w-64 transition-all duration-300 overflow-hidden bg-white">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Overlay for mobile
  {isMobile && isSidebarOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-10"
      onClick={() => setIsSidebarOpen(false)}
    />
  )} */}

        {/* Main content adjusts automatically */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
