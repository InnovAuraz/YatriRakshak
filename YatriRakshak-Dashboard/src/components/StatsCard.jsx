import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend = "neutral",
  variant = "default" 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "emergency":
        return "border-emergency/20 bg-emergency/5";
      default:
        return "border-border";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      case "emergency":
        return "bg-emergency/10 text-emergency";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-emergency";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`stats-card ${getVariantStyles()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend !== "neutral" && (
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {trend === "up" ? "↗" : "↘"}
                </span>
              )}
            </div>
            <p className={`text-sm mt-2 ${getTrendColor()}`}>{subtitle}</p>
          </div>
          
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyles()}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;