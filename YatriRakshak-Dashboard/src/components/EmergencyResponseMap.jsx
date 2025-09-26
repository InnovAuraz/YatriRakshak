import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Users, 
  Shield, 
  Cross, 
  Clock,
  Navigation,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertTriangle,
  Phone,
  MousePointer2,
  Square,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { 
  useInteractiveMap, 
  InteractiveMarker, 
  ContextMenu, 
  GeoFence,
  DragSelectionOverlay 
} from './InteractiveMapComponents.jsx';
import { TouristDetailPanel, FloatingActionPanel } from './TouristDetailsComponents.jsx';
import { useWebSocket } from '../services/websocket.jsx';
import { useNotifications } from '../services/notifications.jsx';

const EmergencyResponseMap = ({ activeEmergencies = [], onEmergencyClick }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  
  // Interactive map functionality
  const {
    selectedItem,
    hoveredItem,
    contextMenu,
    isDragging,
    isCreatingGeoFence,
    geoFences,
    mapRef,
    handlers,
    actions
  } = useInteractiveMap();

  // WebSocket and notifications
  const { isConnected } = useWebSocket();
  const { success, error } = useNotifications();

  const [responseResources, setResponseResources] = useState({
    volunteers: [
      { id: 'V001', name: 'Rescue Team Alpha', lat: 30.7400, lng: 79.0700, status: 'Available', distance: '2.1 km' },
      { id: 'V002', name: 'Mountain Rescue Beta', lat: 30.7300, lng: 79.0600, status: 'Dispatched', distance: '3.5 km' },
      { id: 'V003', name: 'Medical Team Gamma', lat: 32.2450, lng: 77.1900, status: 'Available', distance: '1.8 km' },
      { id: 'V004', name: 'Search Team Delta', lat: 30.0900, lng: 78.2700, status: 'En Route', distance: '0.5 km' }
    ],
    policeStations: [
      { id: 'P001', name: 'Kedarnath Police Post', lat: 30.7350, lng: 79.0650, contact: '+91-1364-222100' },
      { id: 'P002', name: 'Manali Police Station', lat: 32.2430, lng: 77.1890, contact: '+91-1902-252100' },
      { id: 'P003', name: 'Rishikesh Police Station', lat: 30.0870, lng: 78.2680, contact: '+91-135-2430100' },
      { id: 'P004', name: 'Ooty Police Station', lat: 11.4060, lng: 76.6930, contact: '+91-423-2444100' }
    ],
    hospitals: [
      { id: 'H001', name: 'Kedarnath Medical Center', lat: 30.7360, lng: 79.0660, type: 'Emergency Care', beds: 12 },
      { id: 'H002', name: 'Manali District Hospital', lat: 32.2440, lng: 77.1880, type: 'Multi-specialty', beds: 85 },
      { id: 'H003', name: 'AIIMS Rishikesh', lat: 30.0880, lng: 78.2690, type: 'Super Specialty', beds: 750 },
      { id: 'H004', name: 'Government Hospital Ooty', lat: 11.4070, lng: 76.6940, type: 'District Hospital', beds: 200 }
    ]
  });

  const [responseTimers, setResponseTimers] = useState({});
  const [dragPosition, setDragPosition] = useState(null);

  // Mock tourist data for interactive features
  const [tourists, setTourists] = useState([
    {
      id: 'T001',
      name: 'John Smith',
      nationality: 'American',
      age: 28,
      status: 'safe',
      position: { x: 45, y: 35 },
      currentLocation: {
        address: 'Kedarnath Temple, Uttarakhand',
        lat: 30.7350,
        lng: 79.0650,
        lastUpdated: '2 minutes ago'
      },
      safetyScore: 85,
      tripDuration: 7,
      groupSize: 2,
      checkIn: '2024-01-15',
      checkOut: '2024-01-22',
      avatar: null,
      recentAlerts: [],
      locationHistory: [
        { place: 'Kedarnath Temple', address: 'Main Temple Complex', time: '10:30 AM', duration: '45 min' },
        { place: 'Base Camp', address: 'Kedarnath Base', time: '9:15 AM', duration: '1hr 15min' }
      ]
    },
    {
      id: 'T002', 
      name: 'Sarah Johnson',
      nationality: 'Canadian',
      age: 32,
      status: 'help_needed',
      position: { x: 65, y: 55 },
      currentLocation: {
        address: 'Manali Market, Himachal Pradesh',
        lat: 32.2430,
        lng: 77.1890,
        lastUpdated: '5 minutes ago'
      },
      safetyScore: 65,
      tripDuration: 10,
      groupSize: 1,
      checkIn: '2024-01-12',
      checkOut: '2024-01-22',
      avatar: null,
      recentAlerts: [
        { type: 'Medical Alert', message: 'Reported feeling unwell', timestamp: '15 minutes ago' }
      ]
    }
  ]);

  useEffect(() => {
    // Initialize response timers for active emergencies
    const timers = {};
    activeEmergencies.forEach(emergency => {
      if (emergency.status !== 'Resolved') {
        timers[emergency.id] = emergency.responseTime || 0;
      }
    });
    setResponseTimers(timers);
  }, [activeEmergencies]);

  useEffect(() => {
    // Update response timers every minute
    const interval = setInterval(() => {
      setResponseTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          updated[id] += 1; // Add 1 minute
        });
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getEmergencyIcon = (alertType) => {
    switch (alertType) {
      case 'Medical Emergency':
        return '🚑';
      case 'Vehicle Breakdown':
        return '🚗';
      case 'Lost/Missing':
        return '🔍';
      case 'Safety Concern':
        return '⚠️';
      default:
        return '🆘';
    }
  };

  const getVolunteerStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Dispatched':
        return 'bg-blue-500';
      case 'En Route':
        return 'bg-yellow-500';
      case 'On Scene':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatResponseTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Interactive map handlers
  const handleTouristAction = useCallback((action, tourist) => {
    switch (action) {
      case 'message':
        success(`Messaging ${tourist.name}`, 'Message sent successfully');
        break;
      case 'call':
        success(`Calling ${tourist.name}`, 'Call initiated');
        break;
      case 'track':
        success(`Tracking ${tourist.name}`, 'Live tracking enabled');
        break;
      case 'emergency_response':
        error(`Emergency Response`, `Dispatching help to ${tourist.name}`);
        break;
      default:
        break;
    }
  }, [success, error]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setDragPosition({ x, y });
    }
  }, [isDragging]);

  // Context menu actions
  const contextMenuActions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (item) => actions.setSelectedItem(item)
    },
    {
      label: 'Send Message',
      icon: MessageSquare,
      onClick: (item) => handleTouristAction('message', item)
    },
    {
      label: 'Start Call',
      icon: Phone,
      onClick: (item) => handleTouristAction('call', item)
    },
    { type: 'divider' },
    {
      label: 'Track Location',
      icon: Navigation,
      onClick: (item) => handleTouristAction('track', item)
    },
    {
      label: 'Emergency Response',
      icon: AlertTriangle,
      onClick: (item) => handleTouristAction('emergency_response', item),
      danger: true
    }
  ];

  // Floating action panel actions
  const floatingActions = [
    {
      label: 'Create Geo-fence',
      icon: Square,
      onClick: actions.toggleGeoFenceCreation,
      variant: isCreatingGeoFence ? 'destructive' : 'default'
    },
    {
      label: 'Refresh Data',
      icon: RotateCcw,
      onClick: () => success('Data Refreshed', 'Map data updated successfully')
    },
    {
      label: 'Toggle Selection',
      icon: MousePointer2,
      onClick: () => success('Selection Mode', 'Click tourists for details')
    }
  ];

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const handleEmergencyMarkerClick = (emergency) => {
    setSelectedEmergency(emergency);
    if (onEmergencyClick) {
      onEmergencyClick(emergency);
    }
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'w-full'}`}>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-500" />
              Emergency Response Map
              <Badge variant="destructive" className="ml-2">
                {activeEmergencies.filter(e => e.status !== 'Resolved').length} Active
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className={`relative bg-gray-100 ${isFullScreen ? 'h-screen' : 'h-96'} map-background`}
            onClick={handlers.onMapClick}
            onMouseDown={handlers.onDragStart}
            onMouseMove={handleMouseMove}
            onMouseUp={handlers.onDragEnd}
          >
            {/* Map Container */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
              {/* India Map Outline - Simplified representation */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <path
                  d="M100,200 L150,180 L200,160 L250,140 L300,160 L350,180 L400,200 L450,220 L400,250 L350,280 L300,300 L250,320 L200,300 L150,280 L100,260 Z"
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth="2"
                />
              </svg>

              {/* Geo-fences */}
              {geoFences.map((geoFence) => (
                <GeoFence
                  key={geoFence.id}
                  geoFence={geoFence}
                  isSelected={selectedItem?.id === geoFence.id}
                  onSelect={actions.setSelectedItem}
                  onDelete={actions.deleteGeoFence}
                />
              ))}

              {/* Drag Selection Overlay */}
              <DragSelectionOverlay
                isDragging={isDragging && isCreatingGeoFence}
                dragStart={handlers.onDragStart}
                currentPosition={dragPosition}
              />

              {/* Interactive Tourist Markers */}
              {tourists.map((tourist) => (
                <InteractiveMarker
                  key={tourist.id}
                  item={tourist}
                  position={tourist.position}
                  isSelected={selectedItem?.id === tourist.id}
                  isHovered={hoveredItem?.id === tourist.id}
                  handlers={handlers}
                >
                  <div className={`w-8 h-8 rounded-full border-2 bg-white shadow-lg flex items-center justify-center ${
                    tourist.status === 'safe' ? 'border-green-500' : 
                    tourist.status === 'help_needed' ? 'border-orange-500' : 
                    'border-red-500'
                  }`}>
                    <User className={`w-4 h-4 ${
                      tourist.status === 'safe' ? 'text-green-600' : 
                      tourist.status === 'help_needed' ? 'text-orange-600' : 
                      'text-red-600'
                    }`} />
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    tourist.status === 'safe' ? 'bg-green-500' : 
                    tourist.status === 'help_needed' ? 'bg-orange-500' : 
                    'bg-red-500'
                  }`} />

                  {/* Tourist name tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {tourist.name}
                  </div>
                </InteractiveMarker>
              ))}
            </div>
              
              {/* Emergency Locations */}
              {activeEmergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + (emergency.coordinates?.lng || 77) * 0.5}%`,
                    top: `${50 - (emergency.coordinates?.lat || 28) * 0.8}%`
                  }}
                  onClick={() => handleEmergencyMarkerClick(emergency)}
                >
                  <div className="relative">
                    {/* Emergency Marker */}
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    
                    {/* Response Timer */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatResponseTime(responseTimers[emergency.id] || 0)}
                    </div>
                    
                    {/* Emergency Type Icon */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-lg">
                      {getEmergencyIcon(emergency.alertType)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Volunteers */}
              {responseResources.volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + volunteer.lng * 0.5}%`,
                    top: `${50 - volunteer.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className={`${getVolunteerStatusColor(volunteer.status)} text-white p-2 rounded-full shadow-lg`}>
                      <Users className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{volunteer.name}</div>
                      <div>Status: {volunteer.status}</div>
                      <div>Distance: {volunteer.distance}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Police Stations */}
              {responseResources.policeStations.map((station, index) => (
                <div
                  key={station.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + station.lng * 0.5}%`,
                    top: `${50 - station.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className="bg-blue-600 text-white p-2 rounded shadow-lg">
                      <Shield className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{station.name}</div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {station.contact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Hospitals */}
              {responseResources.hospitals.map((hospital, index) => (
                <div
                  key={hospital.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + hospital.lng * 0.5}%`,
                    top: `${50 - hospital.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className="bg-white border-2 border-red-500 text-red-500 p-2 rounded shadow-lg">
                      <Cross className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{hospital.name}</div>
                      <div>Type: {hospital.type}</div>
                      <div>Beds: {hospital.beds}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Map Legend */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-medium mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Emergency Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Available Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Police Stations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-red-500 rounded flex items-center justify-center">
                    <Cross className="h-2 w-2 text-red-500" />
                  </div>
                  <span>Hospitals</span>
                </div>
              </div>
            </div>
            
            {/* Response Statistics */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-medium mb-3">Response Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Active Emergencies</div>
                  <div className="text-xl font-bold text-red-600">
                    {activeEmergencies.filter(e => e.status !== 'Resolved').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Available Teams</div>
                  <div className="text-xl font-bold text-green-600">
                    {responseResources.volunteers.filter(v => v.status === 'Available').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Response Time</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatResponseTime(
                      Object.values(responseTimers).reduce((a, b) => a + b, 0) / 
                      Math.max(Object.values(responseTimers).length, 1)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Teams Dispatched</div>
                  <div className="text-xl font-bold text-orange-600">
                    {responseResources.volunteers.filter(v => v.status === 'Dispatched' || v.status === 'En Route').length}
                  </div>
                </div>
              {/* Emergency Locations */}
              {activeEmergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + (emergency.coordinates?.lng || 77) * 0.5}%`,
                    top: `${50 - (emergency.coordinates?.lat || 28) * 0.8}%`
                  }}
                  onClick={() => handleEmergencyMarkerClick(emergency)}
                >
                  <div className="relative">
                    {/* Emergency Marker */}
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    
                    {/* Response Timer */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatResponseTime(responseTimers[emergency.id] || 0)}
                    </div>
                    
                    {/* Emergency Type Icon */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-lg">
                      {getEmergencyIcon(emergency.alertType)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Volunteers */}
              {responseResources.volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + volunteer.lng * 0.5}%`,
                    top: `${50 - volunteer.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className={`${getVolunteerStatusColor(volunteer.status)} text-white p-2 rounded-full shadow-lg`}>
                      <Users className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{volunteer.name}</div>
                      <div>Status: {volunteer.status}</div>
                      <div>Distance: {volunteer.distance}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Police Stations */}
              {responseResources.policeStations.map((station, index) => (
                <div
                  key={station.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + station.lng * 0.5}%`,
                    top: `${50 - station.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className="bg-blue-600 text-white p-2 rounded shadow-lg">
                      <Shield className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{station.name}</div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {station.contact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Hospitals */}
              {responseResources.hospitals.map((hospital, index) => (
                <div
                  key={hospital.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${30 + hospital.lng * 0.5}%`,
                    top: `${50 - hospital.lat * 0.8}%`
                  }}
                >
                  <div className="relative group">
                    <div className="bg-white border-2 border-red-500 text-red-500 p-2 rounded shadow-lg">
                      <Cross className="h-4 w-4" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{hospital.name}</div>
                      <div>Type: {hospital.type}</div>
                      <div>Beds: {hospital.beds}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Map Legend */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-medium mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Emergency Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-green-500 bg-white rounded-full flex items-center justify-center">
                    <User className="w-2 h-2 text-green-600" />
                  </div>
                  <span>Safe Tourists</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Available Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Police Stations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-red-500 rounded flex items-center justify-center">
                    <Cross className="h-2 w-2 text-red-500" />
                  </div>
                  <span>Hospitals</span>
                </div>
              </div>
            </div>
            
            {/* Response Statistics */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-medium mb-3">Response Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Active Emergencies</div>
                  <div className="text-xl font-bold text-red-600">
                    {activeEmergencies.filter(e => e.status !== 'Resolved').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Available Teams</div>
                  <div className="text-xl font-bold text-green-600">
                    {responseResources.volunteers.filter(v => v.status === 'Available').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Response Time</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatResponseTime(
                      Object.values(responseTimers).reduce((a, b) => a + b, 0) / 
                      Math.max(Object.values(responseTimers).length, 1)
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Teams Dispatched</div>
                  <div className="text-xl font-bold text-orange-600">
                    {responseResources.volunteers.filter(v => v.status === 'Dispatched' || v.status === 'En Route').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Geo-fence Creation Indicator */}
            {isCreatingGeoFence && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Square className="w-4 h-4" />
                  <span>Click and drag to create geo-fence</span>
                </div>
              </div>
            )}
          </div>

          {/* Context Menu */}
          <ContextMenu
            contextMenu={contextMenu}
            onClose={() => actions.setContextMenu(null)}
            actions={contextMenuActions}
          />

          {/* Floating Action Panel */}
          <FloatingActionPanel
            isVisible={true}
            actions={floatingActions}
            position="bottom-right"
          />
        </CardContent>
      </Card>

      {/* Tourist Detail Panel */}
      {selectedItem && selectedItem.name && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out">
          <TouristDetailPanel
            tourist={selectedItem}
            isOpen={true}
            onClose={() => actions.setSelectedItem(null)}
            onAction={handleTouristAction}
            className="h-full"
          />
        </div>
      )}
      
      {/* Selected Emergency Details Panel */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Emergency Details</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEmergency(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium">Tourist:</span> {selectedEmergency.name} ({selectedEmergency.touristId})
              </div>
              <div>
                <span className="font-medium">Alert Type:</span> {selectedEmergency.alertType}
              </div>
              <div>
                <span className="font-medium">Location:</span> {selectedEmergency.location}
              </div>
              <div>
                <span className="font-medium">Description:</span> {selectedEmergency.description}
              </div>
              <div>
                <span className="font-medium">Response Time:</span> 
                <span className="ml-2 font-bold text-red-600">
                  {formatResponseTime(responseTimers[selectedEmergency.id] || 0)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                Dispatch Team
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Tourist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyResponseMap;