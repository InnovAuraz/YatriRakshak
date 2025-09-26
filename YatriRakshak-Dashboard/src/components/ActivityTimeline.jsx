import { Clock, MapPin, Shield, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ActivityTimeline = () => {
  const activities = [
    {
      id: "1",
      type: "emergency",
      title: "Emergency Alert Resolved",
      description: "Tourist assistance request in Manali resolved successfully",
      timestamp: "2 min ago",
      location: "Manali, HP",
      status: "resolved"
    },
    {
      id: "2",
      type: "checkin",
      title: "Tourist Check-in",
      description: "Tourist ID: TN2025001 checked into Hotel Taj, Mumbai",
      timestamp: "5 min ago",
      location: "Mumbai, MH"
    },
    {
      id: "3",
      type: "volunteer",
      title: "New Volunteer Verified",
      description: "Local guide verified and added to Rajasthan response team",
      timestamp: "8 min ago",
      location: "Jaipur, RJ"
    },
    {
      id: "4",
      type: "alert",
      title: "Weather Advisory",
      description: "Heavy rainfall alert issued for Kashmir region tourists",
      timestamp: "12 min ago",
      location: "Kashmir, JK",
      status: "active"
    },
    {
      id: "5",
      type: "checkin",
      title: "Group Check-in",
      description: "Foreign tourist group (12 members) checked into Kerala backwaters",
      timestamp: "15 min ago",
      location: "Alleppey, KL"
    },
    {
      id: "6",
      type: "resolution",
      title: "Medical Assistance Complete",
      description: "Tourist medical emergency resolved - Response time: 18 min",
      timestamp: "22 min ago",
      location: "Rishikesh, UK",
      status: "resolved"
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "emergency":
        return AlertTriangle;
      case "checkin":
        return MapPin;
      case "volunteer":
        return Users;
      case "alert":
        return Shield;
      case "resolution":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getIconColor = (type, status) => {
    if (status === "resolved") return "text-success bg-success/10";
    if (status === "active") return "text-warning bg-warning/10";
    
    switch (type) {
      case "emergency":
        return "text-emergency bg-emergency/10";
      case "checkin":
        return "text-primary bg-primary/10";
      case "volunteer":
        return "text-success bg-success/10";
      case "alert":
        return "text-warning bg-warning/10";
      case "resolution":
        return "text-success bg-success/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    switch (status) {
      case "resolved":
        return <Badge className="badge-success">Resolved</Badge>;
      case "active":
        return <Badge className="badge-warning">Active</Badge>;
      case "pending":
        return <Badge className="badge-emergency">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-poppins">Recent Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Feed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="activity-timeline px-6 pb-6">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type, activity.status);
            
            return (
              <div key={activity.id} className="timeline-item">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                        {activity.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {activity.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-shrink-0">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="px-6 py-3 border-t border-border bg-muted/30">
          <button className="text-sm text-primary hover:text-primary-hover font-medium">
            View All Activities →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;