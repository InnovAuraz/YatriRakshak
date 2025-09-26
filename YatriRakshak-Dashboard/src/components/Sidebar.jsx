import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  UserCheck, 
  FileText,
  Shield,
  IndianRupee
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "tracking",
      title: "Live Tourist Tracking",
      icon: MapPin,
      badge: "18.5K"
    },
    {
      id: "emergency",
      title: "Emergency Management",
      icon: AlertTriangle,
      badge: "3"
    },
    {
      id: "volunteers",
      title: "Community Volunteers",
      icon: Users,
      badge: "2.8K"
    },
    {
      id: "hotels",
      title: "Hotel & Accommodation",
      icon: Building2,
      badge: null
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      icon: BarChart3,
      badge: null
    },
    {
      id: "settings",
      title: "System Settings",
      icon: Settings,
      badge: null
    },
    {
      id: "users",
      title: "User Management",
      icon: UserCheck,
      badge: null
    },
    {
      id: "logs",
      title: "Audit Logs",
      icon: FileText,
      badge: null
    }
  ];

  return (
    <aside className="hidden md:block w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-poppins font-bold text-lg text-foreground">YatriRakshak</h2>
            <p className="text-xs text-muted-foreground">Smart Tourist Safety</p>
          </div>
        </div>
        
        {/* Government Badge */}
        <div className="mt-4 flex items-center justify-center p-2 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <IndianRupee className="w-3 h-3 text-primary" />
              <span className="text-xs font-bold text-primary">GOVERNMENT OF INDIA</span>
            </div>
            <p className="text-xs text-muted-foreground">Ministry of Tourism</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start h-11 px-3 ${
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSectionChange && onSectionChange(item.id)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left font-medium">{item.title}</span>
            {item.badge && (
              <Badge 
                variant="secondary" 
                className={`ml-2 text-xs ${
                  item.badge === "3" 
                    ? "bg-red-100 text-red-800 border-red-200" 
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/30">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">System Online</span>
          </div>
          <p className="text-xs text-muted-foreground">Smart India Hackathon 2025</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;