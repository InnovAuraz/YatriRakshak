import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const ActiveEmergenciesTable = ({ onViewDetails, onDispatchTeam, onMarkResolved }) => {
  const [emergencies, setEmergencies] = useState([
    {
      id: 'TR001',
      touristId: 'TR001',
      name: 'Rahul Sharma',
      location: 'Kedarnath Trail, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      alertType: 'Medical Emergency',
      severity: 'critical',
      time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'Active',
      description: 'Severe altitude sickness, difficulty breathing',
      contactNumber: '+91 98765 43210',
      responseTime: 15, // minutes since alert
      assignedTeam: null
    },
    {
      id: 'TR002',
      touristId: 'TR002',
      name: 'Priya Patel',
      location: 'Manali Highway, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      alertType: 'Vehicle Breakdown',
      severity: 'medium',
      time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'Team Dispatched',
      description: 'Vehicle broke down in remote area, no network',
      contactNumber: '+91 87654 32109',
      responseTime: 45,
      assignedTeam: 'Rescue Team Alpha'
    },
    {
      id: 'TR003',
      touristId: 'TR003',
      name: 'Amit Kumar',
      location: 'Rishikesh Rapids, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      alertType: 'Lost/Missing',
      severity: 'critical',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'Search in Progress',
      description: 'Lost during river rafting, last seen near Class IV rapids',
      contactNumber: '+91 76543 21098',
      responseTime: 120,
      assignedTeam: 'Water Rescue Unit'
    },
    {
      id: 'TR004',
      touristId: 'TR004',
      name: 'Sneha Reddy',
      location: 'Ooty Tea Gardens, Tamil Nadu',
      coordinates: { lat: 11.4064, lng: 76.6932 },
      alertType: 'Safety Concern',
      severity: 'medium',
      time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'Active',
      description: 'Reported suspicious activity in isolated area',
      contactNumber: '+91 65432 10987',
      responseTime: 30,
      assignedTeam: null
    }
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update response times
      setEmergencies(prev => prev.map(emergency => ({
        ...emergency,
        responseTime: emergency.responseTime + (10/60) // Add 10 seconds
      })));
      
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="destructive" className="animate-pulse">{status}</Badge>;
      case 'Team Dispatched':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">{status}</Badge>;
      case 'Search in Progress':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">{status}</Badge>;
      case 'Resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (time) => {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const formatResponseTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleViewDetails = (emergency) => {
    if (onViewDetails) {
      onViewDetails(emergency);
    }
  };

  const handleDispatchTeam = (emergency) => {
    if (onDispatchTeam) {
      onDispatchTeam(emergency);
    }
  };

  const handleMarkResolved = (emergencyId) => {
    setEmergencies(prev => prev.map(emergency => 
      emergency.id === emergencyId 
        ? { ...emergency, status: 'Resolved' }
        : emergency
    ));
    
    if (onMarkResolved) {
      onMarkResolved(emergencyId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Emergencies
            <Badge variant="destructive" className="ml-2">
              {emergencies.filter(e => e.status !== 'Resolved').length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Tourist ID</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Location</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Alert Type</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Time</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Response Time</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emergencies.map((emergency) => (
                <tr 
                  key={emergency.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${getSeverityColor(emergency.severity)}`}
                >
                  <td className="py-4 px-2 font-medium">{emergency.touristId}</td>
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium">{emergency.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {emergency.contactNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="max-w-[200px] truncate">{emergency.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        emergency.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-sm font-medium">{emergency.alertType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {formatTime(emergency.time)}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className={`text-sm font-medium ${
                      emergency.responseTime > 60 ? 'text-red-600' : 
                      emergency.responseTime > 30 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {formatResponseTime(emergency.responseTime)}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    {getStatusBadge(emergency.status)}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(emergency)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Details
                      </Button>
                      
                      {emergency.status === 'Active' && !emergency.assignedTeam && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDispatchTeam(emergency)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Truck className="h-3 w-3" />
                          Dispatch
                        </Button>
                      )}
                      
                      {emergency.status !== 'Resolved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkResolved(emergency.id)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {emergencies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No active emergencies</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveEmergenciesTable;