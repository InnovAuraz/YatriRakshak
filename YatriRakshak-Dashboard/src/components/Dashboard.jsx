import React, { useState, useRef } from "react";
import { Users, Shield, Clock, Heart, TrendingUp, AlertTriangle } from "lucide-react";
import StatsCard from "./StatsCard.jsx";
import ActivityTimeline from "./ActivityTimeline.jsx";
import IndiaMap from "./IndiaMap.jsx";
import FullScreenMap from "./FullScreenMap.jsx";
import { useKeyboardShortcuts, KeyboardShortcutsHelp, useDataExport } from "./KeyboardShortcutsAndExport.jsx";
import { useNotifications } from '../services/notifications.jsx';

const Dashboard = () => {
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const searchInputRef = useRef(null);

  const { success } = useNotifications();
  const { exportToCSV, exportToPDF } = useDataExport();

  // Keyboard shortcuts actions
  const keyboardActions = {
    clearSelection: () => {
      // Clear any selections
      success('Selection Cleared', 'All selections have been cleared');
    },
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    toggleFullScreen: () => {
      setIsFullScreenMapOpen(!isFullScreenMapOpen);
    },
    showHelp: () => {
      setShowKeyboardHelp(true);
    },
    refreshData: () => {
      success('Data Refreshed', 'Dashboard data has been updated');
    }
  };

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(keyboardActions);

  // Make the function available globally for the IndiaMap component
  if (typeof window !== 'undefined') {
    window.openFullScreenMap = () => setIsFullScreenMapOpen(true);
  }

  return (
    <>
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Active Tourists"
          value="18,543"
          subtitle="Currently in India"
          icon={Users}
          trend="up"
          variant="default"
        />
        
        <StatsCard
          title="Emergency Alerts (24h)"
          value="3"
          subtitle="All resolved"
          icon={Shield}
          trend="down"
          variant="success"
        />
        
        <StatsCard
          title="Response Time Average"
          value="28 sec"
          subtitle="vs 15 min industry avg"
          icon={Clock}
          trend="up"
          variant="success"
        />
        
        <StatsCard
          title="Community Volunteers"
          value="2,847"
          subtitle="Active responders"
          icon={Heart}
          trend="up"
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Map Section - Takes 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <IndiaMap />
        </div>
        
        {/* Activity Timeline - Takes 1 column, shows below map on mobile */}
        <div className="lg:col-span-1 order-2 lg:order-2 md:hidden lg:block">
          <ActivityTimeline />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatsCard
          title="Hotels Monitored"
          value="1,234"
          subtitle="Across 28 states"
          icon={TrendingUp}
          variant="default"
        />
        
        <StatsCard
          title="Safety Score"
          value="98.7%"
          subtitle="National average"
          icon={Shield}
          trend="up"
          variant="success"
        />
        
        <StatsCard
          title="Pending Alerts"
          value="0"
          subtitle="All clear"
          icon={AlertTriangle}
          variant="success"
        />
      </div>
    </div>

    {/* Full Screen Map */}
    <FullScreenMap 
      isFullScreen={isFullScreenMapOpen}
      onClose={() => setIsFullScreenMapOpen(false)}
    />

    {/* Keyboard Shortcuts Help Modal */}
    <KeyboardShortcutsHelp
      isOpen={showKeyboardHelp}
      onClose={() => setShowKeyboardHelp(false)}
    />
    </>
  );
};

export default Dashboard;