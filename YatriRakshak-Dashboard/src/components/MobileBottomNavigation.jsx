import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Building2, 
  BarChart3
} from "lucide-react";
import { Badge } from "./ui/badge";

const MobileBottomNavigation = ({ activeSection, onSectionChange }) => {
  const primaryMenuItems = [
    {
      id: "dashboard",
      title: "Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "tracking",
      title: "Tracking",
      icon: MapPin,
      badge: "18.5K"
    },
    {
      id: "emergency",
      title: "Emergency",
      icon: AlertTriangle,
      badge: "3"
    },
    {
      id: "volunteers",
      title: "Volunteers",
      icon: Users,
      badge: "2.8K"
    },
    {
      id: "hotels",
      title: "Hotels",
      icon: Building2,
      badge: null
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-6 h-16">
        {primaryMenuItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              activeSection === item.id
                ? "bg-primary/10 text-primary border-t-2 border-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            onClick={() => onSectionChange && onSectionChange(item.id)}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 mb-1 ${
                activeSection === item.id ? "text-primary" : ""
              }`} />
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className={`absolute -top-2 -right-2 text-xs px-1 py-0 h-4 min-w-4 ${
                    item.badge === "3" 
                      ? "bg-red-500 text-white" 
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium truncate max-w-full">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;