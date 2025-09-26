import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileBottomNavigation from "../components/MobileBottomNavigation.jsx";
import ResponsiveActivityPanel from "../components/ResponsiveActivityPanel.jsx";
import Dashboard from "../components/Dashboard.jsx";
import FullScreenMap from "../components/FullScreenMap.jsx";
import EmergencyDashboard from "../components/EmergencyDashboard.jsx";
import VolunteerDashboard from "../components/VolunteerDashboard.jsx";
import HotelSafetyDashboard from "../components/HotelSafetyDashboard.jsx";
import AnalyticsReports from "../components/AnalyticsReports.jsx";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const getSectionTitle = (section) => {
    switch (section) {
      case "dashboard":
        return { title: "Dashboard Overview", subtitle: "Real-time monitoring of tourist safety across India" };
      case "tracking":
        return { title: "Live Tourist Tracking", subtitle: "Monitor and track tourists in real-time across India" };
      case "emergency":
        return { title: "Emergency Management", subtitle: "Manage active emergencies and coordinate response teams" };
      case "volunteers":
        return { title: "Community Volunteers", subtitle: "Manage volunteer network and performance tracking" };
      case "hotels":
        return { title: "Hotel & Accommodation Safety", subtitle: "Safety certification dashboard and compliance monitoring" };
      case "analytics":
        return { title: "Analytics & Reports", subtitle: "Comprehensive data visualization and insights dashboard" };
      case "settings":
        return { title: "System Settings", subtitle: "Configure system settings and preferences" };
      case "users":
        return { title: "User Management", subtitle: "Manage system users and permissions" };
      case "logs":
        return { title: "Audit Logs", subtitle: "View system activity and audit trails" };
      default:
        return { title: "Dashboard Overview", subtitle: "Real-time monitoring of tourist safety across India" };
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "tracking":
        return <FullScreenMap />;
      case "emergency":
        return <EmergencyDashboard />;
      case "volunteers":
        return <VolunteerDashboard />;
      case "hotels":
        return <HotelSafetyDashboard />;
      case "analytics":
        return <AnalyticsReports />;
      case "settings":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-gray-600">This section is under development and will be available soon.</p>
          </div>
        );
      case "users":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">This section is under development and will be available soon.</p>
          </div>
        );
      case "logs":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
            <p className="text-gray-600">This section is under development and will be available soon.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const sectionInfo = getSectionTitle(activeSection);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden on mobile for full-screen experience */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        
        {/* Main Content */}
        <main className="flex-1 md:p-6 p-0">
          <div className="max-w-7xl mx-auto">
            {/* Page Title - Hidden on mobile for full-screen maps */}
            <div className="hidden md:block mb-8 px-4 md:px-0">
              <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">
                {sectionInfo.title}
              </h1>
              <p className="text-muted-foreground">
                {sectionInfo.subtitle}
              </p>
            </div>
            
            {/* Mobile Page Title - Compact version */}
            <div className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-30">
              <h1 className="text-lg font-bold font-poppins text-foreground">
                {sectionInfo.title}
              </h1>
            </div>
            
            {/* Dynamic Content */}
            <div className="md:px-0 pb-20 md:pb-0">
              {renderSectionContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Responsive Activity Panel */}
      <ResponsiveActivityPanel />
    </div>
  );
};

export default Index;