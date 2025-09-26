import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

const IndiaMap = () => {
  // Sample tourist locations data
  const touristLocations = [
    { id: 1, name: "Mumbai", count: 2847, status: "safe", x: 25, y: 65 },
    { id: 2, name: "Delhi", count: 3521, status: "safe", x: 35, y: 25 },
    { id: 3, name: "Bangalore", count: 1923, status: "safe", x: 32, y: 75 },
    { id: 4, name: "Goa", count: 1245, status: "alert", x: 22, y: 70 },
    { id: 5, name: "Kerala", count: 1876, status: "safe", x: 28, y: 85 },
    { id: 6, name: "Rajasthan", count: 2134, status: "safe", x: 25, y: 35 },
    { id: 7, name: "Kashmir", count: 567, status: "emergency", x: 38, y: 15 },
    { id: 8, name: "Himachal", count: 892, status: "safe", x: 33, y: 20 },
    { id: 9, name: "Tamil Nadu", count: 1654, status: "safe", x: 35, y: 80 },
    { id: 10, name: "West Bengal", count: 1298, status: "alert", x: 58, y: 45 }
  ];

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

  const getStatusSize = (count) => {
    if (count > 3000) return "w-4 h-4";
    if (count > 2000) return "w-3 h-3";
    if (count > 1000) return "w-2.5 h-2.5";
    return "w-2 h-2";
  };

  return (
    <Card className="map-container h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-poppins">Live Tourist Tracking</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.openFullScreenMap?.()}>
                <Maximize2 className="w-4 h-4 mr-2" />
                Full Screen
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Map Container */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 h-80 overflow-hidden">
          {/* India Map Outline - Simplified SVG representation */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full opacity-20"
            fill="none"
            stroke="currentColor"
          >
            {/* Simplified India outline */}
            <path
              d="M20 20 Q30 15 40 20 Q50 18 60 25 Q70 30 75 40 Q80 50 75 60 Q70 70 60 75 Q50 80 40 78 Q30 75 25 70 Q20 60 18 50 Q15 40 20 20 Z"
              strokeWidth="1"
              fill="rgba(59, 130, 246, 0.1)"
              className="text-primary"
            />
          </svg>

          {/* Tourist Location Dots */}
          {touristLocations.map((location) => (
            <div
              key={location.id}
              className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
            >
              {/* Pulsing Ring */}
              <div className={`absolute inset-0 rounded-full animate-ping ${getStatusColor(location.status)} opacity-75`}></div>
              
              {/* Main Dot */}
              <div className={`relative rounded-full border-2 ${getStatusColor(location.status)} ${getStatusSize(location.count)} animate-pulse`}></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-lg shadow-lg p-3 min-w-max z-10">
                <h4 className="font-medium text-foreground">{location.name}</h4>
                <p className="text-sm text-muted-foreground">{location.count.toLocaleString()} tourists</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(location.status)}`}></div>
                  <span className="text-xs capitalize text-muted-foreground">{location.status}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Heat Map Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-primary/5 pointer-events-none"></div>
        </div>

        {/* Map Legend */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success border border-success/50"></div>
                <span className="text-sm text-foreground">Safe (16,234)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning border border-warning/50"></div>
                <span className="text-sm text-foreground">Alert (2,543)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emergency border border-emergency/50"></div>
                <span className="text-sm text-foreground">Emergency (567)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total: 19,344 active tourists</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndiaMap;