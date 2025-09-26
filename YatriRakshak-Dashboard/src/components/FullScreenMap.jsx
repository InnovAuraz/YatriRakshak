import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Input } from "./ui/input.jsx";
import { 
  MapPin, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search,
  Maximize2,
  X,
  User,
  Shield,
  Clock,
  AlertTriangle,
  MousePointer2,
  Square,
  MessageSquare,
  Phone,
  Navigation,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { 
  useInteractiveMap, 
  InteractiveMarker, 
  ContextMenu, 
  GeoFence,
  DragSelectionOverlay 
} from './InteractiveMapComponents.jsx';
import { TouristDetailPanel, FloatingActionPanel } from './TouristDetailsComponents.jsx';
import TouristDetailsPanel from './TouristDetailsPanel.jsx';
import { useWebSocket } from '../services/websocket.jsx';
import { useNotifications } from '../services/notifications.jsx';

const FullScreenMap = ({ isFullScreen = true, onClose }) => {
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    state: "all",
    riskLevel: "all",
    checkInStatus: "all",
    duration: "all"
  });
  const [showRoutes, setShowRoutes] = useState({});
  const [dragPosition, setDragPosition] = useState(null);

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
  const { success, error, info } = useNotifications();

  // Enhanced tourist data with more detailed information
  const tourists = [
    {
      id: "TN2025001",
      name: "Rajesh Kumar",
      photo: "/placeholder.svg",
      location: { name: "Mumbai", state: "Maharashtra", coordinates: { x: 25, y: 65 } },
      riskScore: 15,
      status: "safe",
      checkInStatus: "checked-in",
      lastUpdate: "2 min ago",
      duration: "3 days",
      emergencyContacts: [
        { name: "Priya Kumar", relation: "Wife", phone: "+91 98765 43210" },
        { name: "Amit Kumar", relation: "Brother", phone: "+91 87654 32109" }
      ],
      activities: [
        { time: "10:30 AM", activity: "Checked into Hotel Taj", location: "Mumbai" },
        { time: "2:15 PM", activity: "Visited Gateway of India", location: "Mumbai" },
        { time: "6:45 PM", activity: "Dinner at Local Restaurant", location: "Mumbai" }
      ],
      route: [
        { x: 23, y: 63, time: "8:00 AM" },
        { x: 24, y: 64, time: "10:00 AM" },
        { x: 25, y: 65, time: "2:00 PM" }
      ]
    },
    {
      id: "TN2025002",
      name: "Sarah Johnson",
      photo: "/placeholder.svg",
      location: { name: "Delhi", state: "Delhi", coordinates: { x: 35, y: 25 } },
      riskScore: 8,
      status: "safe",
      checkInStatus: "checked-in",
      lastUpdate: "5 min ago",
      duration: "1 week",
      emergencyContacts: [
        { name: "John Johnson", relation: "Husband", phone: "+1 555 123 4567" }
      ],
      activities: [
        { time: "9:00 AM", activity: "Red Fort Visit", location: "Delhi" },
        { time: "1:30 PM", activity: "Lunch at Connaught Place", location: "Delhi" },
        { time: "4:00 PM", activity: "India Gate Photo Session", location: "Delhi" }
      ],
      route: [
        { x: 33, y: 23, time: "7:00 AM" },
        { x: 34, y: 24, time: "9:00 AM" },
        { x: 35, y: 25, time: "1:00 PM" }
      ]
    },
    {
      id: "TN2025003",
      name: "Akash Sharma",
      photo: "/placeholder.svg",
      location: { name: "Goa", state: "Goa", coordinates: { x: 22, y: 70 } },
      riskScore: 45,
      status: "alert",
      checkInStatus: "overdue",
      lastUpdate: "2 hours ago",
      duration: "5 days",
      emergencyContacts: [
        { name: "Sunita Sharma", relation: "Mother", phone: "+91 99887 76655" }
      ],
      activities: [
        { time: "11:00 AM", activity: "Beach Visit - Baga Beach", location: "Goa" },
        { time: "3:00 PM", activity: "Water Sports Activity", location: "Goa" },
        { time: "7:00 PM", activity: "Missed Check-in", location: "Goa" }
      ],
      route: [
        { x: 20, y: 68, time: "10:00 AM" },
        { x: 21, y: 69, time: "12:00 PM" },
        { x: 22, y: 70, time: "3:00 PM" }
      ]
    },
    {
      id: "TN2025004",
      name: "Meera Patel",
      photo: "/placeholder.svg",
      location: { name: "Kashmir", state: "Jammu & Kashmir", coordinates: { x: 38, y: 15 } },
      riskScore: 85,
      status: "emergency",
      checkInStatus: "emergency",
      lastUpdate: "30 min ago",
      duration: "2 days",
      emergencyContacts: [
        { name: "Vikram Patel", relation: "Husband", phone: "+91 98765 11111" },
        { name: "Emergency Services", relation: "Local", phone: "112" }
      ],
      activities: [
        { time: "8:00 AM", activity: "Trekking Started", location: "Kashmir" },
        { time: "12:00 PM", activity: "Lost Communication", location: "Kashmir" },
        { time: "3:30 PM", activity: "Emergency Alert Triggered", location: "Kashmir" }
      ],
      route: [
        { x: 36, y: 13, time: "6:00 AM" },
        { x: 37, y: 14, time: "8:00 AM" },
        { x: 38, y: 15, time: "12:00 PM" }
      ]
    }
  ];

  // Predefined geo-fence data for display  
  const predefinedGeoFences = [
    // Safe zones (green)
    { type: "safe", name: "Mumbai Safe Zone", path: "M20 60 Q30 60 30 70 Q20 70 20 60", color: "rgba(34, 197, 94, 0.3)" },
    { type: "safe", name: "Delhi Safe Zone", path: "M30 20 Q40 20 40 30 Q30 30 30 20", color: "rgba(34, 197, 94, 0.3)" },
    // Restricted zones (red)
    { type: "restricted", name: "High Risk Area", path: "M35 10 Q45 10 45 20 Q35 20 35 10", color: "rgba(239, 68, 68, 0.3)" },
    { type: "restricted", name: "Border Restricted Zone", path: "M60 40 Q70 40 70 50 Q60 50 60 40", color: "rgba(239, 68, 68, 0.3)" }
  ];

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = !searchQuery || 
      tourist.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.location.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = filters.state === "all" || tourist.location.state === filters.state;
    const matchesRiskLevel = filters.riskLevel === "all" || 
      (filters.riskLevel === "low" && tourist.riskScore < 30) ||
      (filters.riskLevel === "medium" && tourist.riskScore >= 30 && tourist.riskScore < 70) ||
      (filters.riskLevel === "high" && tourist.riskScore >= 70);
    const matchesCheckIn = filters.checkInStatus === "all" || tourist.checkInStatus === filters.checkInStatus;
    const matchesDuration = filters.duration === "all" || 
      (filters.duration === "1-3" && tourist.duration.includes("1") || tourist.duration.includes("2") || tourist.duration.includes("3")) ||
      (filters.duration === "4-7" && (tourist.duration.includes("4") || tourist.duration.includes("5") || tourist.duration.includes("6") || tourist.duration.includes("7"))) ||
      (filters.duration === "week+" && tourist.duration.includes("week"));

    return matchesSearch && matchesState && matchesRiskLevel && matchesCheckIn && matchesDuration;
  });

  const getRiskColor = (score) => {
    if (score < 30) return "text-success bg-success/10 border-success/20";
    if (score < 70) return "text-warning bg-warning/10 border-warning/20";
    return "text-emergency bg-emergency/10 border-emergency/20";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "bg-success border-success/50";
      case "alert":
        return "bg-warning border-warning/50";
      case "emergency":
        return "bg-emergency border-emergency/50";
      default:
        return "bg-primary border-primary/50";
    }
  };

  const handleTouristClick = (tourist) => {
    setSelectedTourist(tourist);
  };

  const toggleRoute = (touristId) => {
    setShowRoutes(prev => ({
      ...prev,
      [touristId]: !prev[touristId]
    }));
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
        toggleRoute(tourist.id);
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
      onClick: () => info('Selection Mode', 'Click tourists for details')
    }
  ];

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-background" : "w-full h-full"}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-lg md:text-2xl font-bold font-poppins">Live Tourist Tracking Map</h1>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">Live</span>
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-1 md:space-x-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find tourist by ID, name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          
          {/* Mobile Search Button */}
          <Button variant="outline" size="sm" className="lg:hidden">
            <Search className="w-4 h-4" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-3">
            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Goa">Goa</SelectItem>
                <SelectItem value="Jammu & Kashmir">J&K</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low (0-29)</SelectItem>
                <SelectItem value="medium">Medium (30-69)</SelectItem>
              <SelectItem value="high">High (70-100)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>

          {isFullScreen && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef}
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden map-background"
          onClick={handlers.onMapClick}
          onMouseDown={handlers.onDragStart}
          onMouseMove={handleMouseMove}
          onMouseUp={handlers.onDragEnd}
        >
          {/* India Map Outline */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full opacity-30"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M20 20 Q30 15 40 20 Q50 18 60 25 Q70 30 75 40 Q80 50 75 60 Q70 70 60 75 Q50 80 40 78 Q30 75 25 70 Q20 60 18 50 Q15 40 20 20 Z"
              strokeWidth="1"
              fill="rgba(59, 130, 246, 0.1)"
              className="text-primary"
            />

            {/* Predefined geo-fence boundaries */}
            {predefinedGeoFences.map((fence, index) => (
              <path
                key={index}
                d={fence.path}
                fill={fence.color}
                stroke={fence.type === "safe" ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                strokeDasharray={fence.type === "restricted" ? "5,5" : "none"}
              />
            ))}
          </svg>

          {/* Interactive Geo-fences */}
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

          {/* Route Lines */}
          {filteredTourists.map((tourist) => 
            showRoutes[tourist.id] && (
              <svg 
                key={`route-${tourist.id}`}
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <path
                  d={`M ${tourist.route.map(point => `${point.x} ${point.y}`).join(' L ')}`}
                  stroke={tourist.status === "emergency" ? "#ef4444" : "#3b82f6"}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3,3"
                  className="animate-pulse"
                />
                {tourist.route.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x}
                    cy={point.y}
                    r="1"
                    fill={tourist.status === "emergency" ? "#ef4444" : "#3b82f6"}
                    opacity="0.7"
                  />
                ))}
              </svg>
            )
          )}

          {/* Interactive Tourist Markers */}
          {filteredTourists.map((tourist) => (
            <InteractiveMarker
              key={tourist.id}
              item={tourist}
              position={tourist.location.coordinates}
              isSelected={selectedItem?.id === tourist.id}
              isHovered={hoveredItem?.id === tourist.id}
              handlers={handlers}
            >
              {/* Pulsing Ring */}
              <div className={`absolute inset-0 rounded-full animate-ping ${getStatusColor(tourist.status)} opacity-75 w-8 h-8`}></div>
              
              {/* Main Marker */}
              <div className={`relative rounded-full border-2 ${getStatusColor(tourist.status)} w-8 h-8 flex items-center justify-center bg-white shadow-lg`}>
                <User className="w-4 h-4 text-gray-700" />
              </div>
              
              {/* Tourist ID Badge */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded px-2 py-1 text-xs font-mono whitespace-nowrap shadow-md">
                {tourist.id}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-lg shadow-lg p-3 min-w-max z-10">
                <div className="font-medium text-foreground">{tourist.name}</div>
                <div className="text-sm text-muted-foreground">{tourist.id}</div>
                <div className="text-sm text-muted-foreground">{tourist.location.name}, {tourist.location.state}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getRiskColor(tourist.riskScore)}>
                    Risk: {tourist.riskScore}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{tourist.lastUpdate}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRoute(tourist.id);
                  }}
                >
                  {showRoutes[tourist.id] ? "Hide Route" : "Show Route"}
                </Button>
              </div>
            </InteractiveMarker>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Panel */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">{filteredTourists.filter(t => t.status === "safe").length}</div>
              <div className="text-sm text-muted-foreground">Safe</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{filteredTourists.filter(t => t.status === "alert").length}</div>
              <div className="text-sm text-muted-foreground">Alert</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emergency">{filteredTourists.filter(t => t.status === "emergency").length}</div>
              <div className="text-sm text-muted-foreground">Emergency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{filteredTourists.length}</div>
              <div className="text-sm text-muted-foreground">Total Visible</div>
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
      </div>

      {/* Interactive Tourist Details Panel */}
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

      {/* Legacy Tourist Details Panel (for backward compatibility) */}
      {selectedTourist && !selectedItem && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-30">
          <TouristDetailsPanel 
            tourist={selectedTourist}
            onClose={() => setSelectedTourist(null)}
            onShowRoute={toggleRoute}
            isRouteVisible={selectedTourist ? showRoutes[selectedTourist.id] : false}
          />
        </div>
      )}
    </div>
  );
};

export default FullScreenMap;