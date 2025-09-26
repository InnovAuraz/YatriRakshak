import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ActiveEmergenciesTable from './ActiveEmergenciesTable';
import EmergencyResponseMap from './EmergencyResponseMap';
import SOSAlertHistory from './SOSAlertHistory';
import TouristDetailsPanel from './TouristDetailsPanel';
import { 
  AlertTriangle, 
  Map, 
  History, 
  Bell,
  Maximize2,
  Minimize2,
  RefreshCw,
  Phone,
  MessageSquare,
  Users,
  Shield
} from 'lucide-react';

const EmergencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('emergencies');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [showTouristPanel, setShowTouristPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sample active emergencies data
  const [activeEmergencies, setActiveEmergencies] = useState([
    {
      id: 'EMG001',
      touristId: 'TR001',
      name: 'Rahul Sharma',
      location: 'Kedarnath Trail, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      alertType: 'Medical Emergency',
      severity: 'critical',
      time: new Date(Date.now() - 15 * 60 * 1000),
      status: 'Active',
      description: 'Severe altitude sickness, difficulty breathing',
      contactNumber: '+91 98765 43210',
      responseTime: 15,
      assignedTeam: null
    },
    {
      id: 'EMG002',
      touristId: 'TR002',
      name: 'Priya Patel',
      location: 'Manali Highway, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      alertType: 'Vehicle Breakdown',
      severity: 'medium',
      time: new Date(Date.now() - 45 * 60 * 1000),
      status: 'Team Dispatched',
      description: 'Vehicle broke down in remote area, no network',
      contactNumber: '+91 87654 32109',
      responseTime: 45,
      assignedTeam: 'Rescue Team Alpha'
    },
    {
      id: 'EMG003',
      touristId: 'TR003',
      name: 'Amit Kumar',
      location: 'Rishikesh Rapids, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      alertType: 'Lost/Missing',
      severity: 'critical',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'Search in Progress',
      description: 'Lost during river rafting, last seen near Class IV rapids',
      contactNumber: '+91 76543 21098',
      responseTime: 120,
      assignedTeam: 'Water Rescue Unit'
    }
  ]);

  useEffect(() => {
    // Add initial notifications
    setNotifications([
      {
        id: 1,
        type: 'critical',
        message: 'New critical emergency: Medical Emergency at Kedarnath Trail',
        time: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: 2,
        type: 'info',
        message: 'Team Alpha dispatched to Manali Highway incident',
        time: new Date(Date.now() - 10 * 60 * 1000)
      }
    ]);
  }, []);

  const handleViewDetails = (emergency) => {
    // Convert emergency data to tourist data format for the panel
    const touristData = {
      id: emergency.touristId,
      name: emergency.name,
      photo: '/placeholder.svg',
      currentLocation: {
        address: emergency.location,
        coordinates: emergency.coordinates,
        timestamp: emergency.time
      },
      riskScore: emergency.severity === 'critical' ? 95 : emergency.severity === 'medium' ? 65 : 35,
      emergencyContacts: [
        {
          name: 'Primary Contact',
          phone: emergency.contactNumber,
          relation: 'Self'
        }
      ],
      recentActivity: [
        {
          timestamp: emergency.time,
          type: 'emergency',
          description: `${emergency.alertType}: ${emergency.description}`
        }
      ],
      checkInStatus: emergency.status,
      state: emergency.location.split(',').pop()?.trim() || 'Unknown',
      duration: Math.floor(emergency.responseTime / 60) + ' hours'
    };
    
    setSelectedTourist(touristData);
    setShowTouristPanel(true);
  };

  const handleDispatchTeam = (emergency) => {
    // Update emergency status
    setActiveEmergencies(prev => prev.map(e => 
      e.id === emergency.id 
        ? { ...e, status: 'Team Dispatched', assignedTeam: 'Rescue Team Alpha' }
        : e
    ));
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      type: 'info',
      message: `Team dispatched to ${emergency.name} at ${emergency.location}`,
      time: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const handleMarkResolved = (emergencyId) => {
    // Remove from active emergencies
    setActiveEmergencies(prev => prev.filter(e => e.id !== emergencyId));
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      type: 'success',
      message: `Emergency ${emergencyId} has been resolved`,
      time: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const handleEmergencyMapClick = (emergency) => {
    handleViewDetails(emergency);
  };

  const formatTime = (time) => {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white overflow-auto' : 'w-full'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Emergency Management Dashboard</h1>
            {activeEmergencies.length > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium animate-pulse">
                {activeEmergencies.length} Active
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Emergency Hotline
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Broadcast Alert
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Recent Notifications</div>
            <div className="space-y-1">
              {notifications.slice(0, 2).map((notification) => (
                <div key={notification.id} className="flex items-center gap-2 text-sm">
                  {getNotificationIcon(notification.type)}
                  <span className="text-gray-700">{notification.message}</span>
                  <span className="text-gray-500 text-xs ml-auto">{formatTime(notification.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Emergencies</p>
                  <p className="text-2xl font-bold text-red-600">{activeEmergencies.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Teams Deployed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeEmergencies.filter(e => e.assignedTeam).length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(activeEmergencies.reduce((sum, e) => sum + e.responseTime, 0) / Math.max(activeEmergencies.length, 1))}m
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activeEmergencies.filter(e => e.severity === 'critical').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="emergencies" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Emergencies
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Response Map
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Alert History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergencies">
            <ActiveEmergenciesTable
              onViewDetails={handleViewDetails}
              onDispatchTeam={handleDispatchTeam}
              onMarkResolved={handleMarkResolved}
            />
          </TabsContent>

          <TabsContent value="map">
            <EmergencyResponseMap
              activeEmergencies={activeEmergencies}
              onEmergencyClick={handleEmergencyMapClick}
            />
          </TabsContent>

          <TabsContent value="history">
            <SOSAlertHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tourist Details Panel */}
      {showTouristPanel && selectedTourist && (
        <TouristDetailsPanel
          tourist={selectedTourist}
          isOpen={showTouristPanel}
          onClose={() => {
            setShowTouristPanel(false);
            setSelectedTourist(null);
          }}
        />
      )}
    </div>
  );
};

export default EmergencyDashboard;