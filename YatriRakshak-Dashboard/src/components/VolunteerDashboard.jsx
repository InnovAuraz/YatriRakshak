import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import VolunteerStatusGrid from './VolunteerStatusGrid';
import VolunteerMap from './VolunteerMap';
import VolunteerPerformance from './VolunteerPerformance';
import { 
  Users, 
  Map, 
  Trophy, 
  UserPlus,
  Maximize2,
  Minimize2,
  Bell,
  MessageSquare,
  RefreshCw,
  Shield,
  Clock,
  Star,
  Activity
} from 'lucide-react';

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Sample volunteer data that will be shared across components
  const [volunteers, setVolunteers] = useState([
    {
      id: 'V001',
      name: 'Dr. Rajesh Kumar',
      photo: '/placeholder.svg',
      location: 'Kedarnath, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      status: 'online',
      rating: 4.9,
      totalHelped: 127,
      avgResponseTime: 8,
      skills: ['first-aid', 'medical', 'hindi', 'english'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(),
      joinDate: '2023-03-15',
      specializations: ['Emergency Medicine', 'Mountain Rescue'],
      languages: ['Hindi', 'English', 'Garhwali'],
      vehicleAccess: true,
      currentAssignment: null,
      experience: '5 years',
      contactNumber: '+91 98765 43210',
      responseRadius: 2
    },
    {
      id: 'V002',
      name: 'Priya Sharma',
      photo: '/placeholder.svg',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      status: 'busy',
      rating: 4.7,
      totalHelped: 89,
      avgResponseTime: 12,
      skills: ['first-aid', 'hindi', 'english', 'vehicle'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: false
      },
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      joinDate: '2023-06-20',
      specializations: ['Tourist Assistance', 'Local Guide'],
      languages: ['Hindi', 'English', 'Punjabi'],
      vehicleAccess: true,
      currentAssignment: 'EMG002',
      experience: '2 years',
      contactNumber: '+91 87654 32109',
      responseRadius: 3
    },
    {
      id: 'V003',
      name: 'Amit Singh',
      photo: '/placeholder.svg',
      location: 'Rishikesh, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      status: 'online',
      rating: 4.8,
      totalHelped: 156,
      avgResponseTime: 6,
      skills: ['first-aid', 'water-rescue', 'hindi', 'english'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      joinDate: '2022-11-10',
      specializations: ['Water Rescue', 'Adventure Sports Safety'],
      languages: ['Hindi', 'English'],
      vehicleAccess: false,
      currentAssignment: null,
      experience: '3 years',
      contactNumber: '+91 76543 21098',
      responseRadius: 1.5
    }
  ]);

  useEffect(() => {
    // Add initial notifications
    setNotifications([
      {
        id: 1,
        type: 'info',
        message: 'New volunteer Dr. Rajesh Kumar joined the network',
        time: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 2,
        type: 'success',
        message: 'Volunteer Amit Singh completed water rescue training',
        time: new Date(Date.now() - 15 * 60 * 1000)
      }
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update volunteer statuses randomly
      setVolunteers(prev => prev.map(volunteer => ({
        ...volunteer,
        lastSeen: Math.random() > 0.7 ? new Date() : volunteer.lastSeen
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleVolunteerClick = (volunteer) => {
    console.log('Volunteer clicked:', volunteer);
    // Handle volunteer interaction
  };

  const handleRecruitVolunteer = () => {
    // Handle volunteer recruitment
    console.log('Opening volunteer recruitment form');
  };

  const handleBroadcastMessage = () => {
    // Handle broadcast message to volunteers
    console.log('Opening broadcast message form');
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
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate statistics
  const stats = {
    totalVolunteers: volunteers.length,
    onlineVolunteers: volunteers.filter(v => v.status === 'online').length,
    busyVolunteers: volunteers.filter(v => v.status === 'busy').length,
    avgRating: (volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length).toFixed(1),
    avgResponseTime: Math.round(volunteers.reduce((sum, v) => sum + v.avgResponseTime, 0) / volunteers.length),
    totalHelped: volunteers.reduce((sum, v) => sum + v.totalHelped, 0),
    verifiedVolunteers: volunteers.filter(v => 
      v.verifications.idVerified && 
      v.verifications.trainingComplete && 
      v.verifications.backgroundCheck
    ).length
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white overflow-auto' : 'w-full'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Management Dashboard</h1>
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              {stats.onlineVolunteers} Online
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRecruitVolunteer}
            >
              <UserPlus className="h-4 w-4" />
              Recruit Volunteer
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleBroadcastMessage}
            >
              <MessageSquare className="h-4 w-4" />
              Broadcast Message
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
          <div className="mt-3 bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-700 mb-2">Recent Updates</div>
            <div className="space-y-1">
              {notifications.slice(0, 2).map((notification) => (
                <div key={notification.id} className="flex items-center gap-2 text-sm">
                  {getNotificationIcon(notification.type)}
                  <span className="text-blue-700">{notification.message}</span>
                  <span className="text-blue-500 text-xs ml-auto">{formatTime(notification.time)}</span>
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
                  <p className="text-sm text-gray-600">Total Volunteers</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalVolunteers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Online Now</p>
                  <p className="text-2xl font-bold text-green-600">{stats.onlineVolunteers}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}★</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fully Verified</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.verifiedVolunteers}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total People Helped</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalHelped}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgResponseTime}m</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Currently Busy</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.busyVolunteers}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Volunteer Status
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Coverage Map
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Performance & Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <VolunteerStatusGrid 
              volunteers={volunteers}
              onVolunteerClick={handleVolunteerClick}
            />
          </TabsContent>

          <TabsContent value="map">
            <VolunteerMap
              volunteers={volunteers}
              onVolunteerClick={handleVolunteerClick}
            />
          </TabsContent>

          <TabsContent value="performance">
            <VolunteerPerformance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VolunteerDashboard;