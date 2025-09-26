import { useState } from "react";
import { ChevronUp, ChevronDown, Activity } from "lucide-react";
import { Button } from "./ui/button";
import ActivityTimeline from "./ActivityTimeline.jsx";

const ResponsiveActivityPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Version - Always visible as sidebar panel */}
      <div className="hidden lg:block">
        <ActivityTimeline />
      </div>

      {/* Mobile Version - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30">
        {/* Collapsed State - Bottom Tab */}
        {!isExpanded && (
          <div className="bg-white border-t border-border shadow-lg">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 h-auto rounded-none"
              onClick={() => setIsExpanded(true)}
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Recent Activity</p>
                  <p className="text-xs text-muted-foreground">5 new updates</p>
                </div>
              </div>
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        )}

        {/* Expanded State - Bottom Sheet */}
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Bottom Sheet */}
            <div className="relative z-30 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
              {/* Handle Bar */}
              <div className="flex items-center justify-center p-4 border-b border-border">
                <div className="w-12 h-1 bg-muted rounded-full mb-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-4"
                  onClick={() => setIsExpanded(false)}
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>

              {/* Activity Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4">
                <ActivityTimeline />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ResponsiveActivityPanel;