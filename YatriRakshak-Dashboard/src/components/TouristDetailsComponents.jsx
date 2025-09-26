import React, { useState, useCallback, useMemo } from 'react';
import { Badge } from './ui/badge.jsx';
import { Card } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Separator } from './ui/separator.jsx';
import { Progress } from './ui/progress.jsx';
import { 
  User, 
  MapPin, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  MessageSquare,
  Calendar,
  Star,
  Shield,
  Heart,
  Navigation,
  Camera
} from 'lucide-react';

// Tourist Detail Panel Component
export const TouristDetailPanel = ({ 
  tourist, 
  isOpen = false, 
  onClose,
  onAction,
  className = "" 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!tourist) return null;

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'help_needed': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'safe': return CheckCircle;
      case 'help_needed': return AlertTriangle;
      case 'emergency': return XCircle;
      case 'offline': return Info;
      default: return User;
    }
  }, []);

  const StatusIcon = getStatusIcon(tourist.status);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: Phone }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={tourist.avatar} alt={tourist.name} />
          <AvatarFallback>{tourist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{tourist.name}</h3>
          <p className="text-sm text-gray-600">{tourist.nationality} • {tourist.age} years old</p>
          <Badge className={`mt-1 ${getStatusColor(tourist.status)}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {tourist.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Trip Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Trip Duration</div>
          <div className="font-medium">{tourist.tripDuration} days</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Group Size</div>
          <div className="font-medium">{tourist.groupSize} people</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Check-in</div>
          <div className="font-medium">{new Date(tourist.checkIn).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Check-out</div>
          <div className="font-medium">{new Date(tourist.checkOut).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Safety Score */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Safety Score</span>
          <span className="text-sm font-medium">{tourist.safetyScore}/100</span>
        </div>
        <Progress value={tourist.safetyScore} className="h-2" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </div>

      {/* Recent Alerts */}
      {tourist.recentAlerts && tourist.recentAlerts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
            Recent Alerts
          </h4>
          <div className="space-y-2">
            {tourist.recentAlerts.map((alert, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-sm font-medium text-orange-800">{alert.type}</div>
                <div className="text-xs text-orange-600">{alert.message}</div>
                <div className="text-xs text-orange-500 mt-1">{alert.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationTab = () => (
    <div className="space-y-4">
      {/* Current Location */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
          Current Location
        </h4>
        <div className="text-sm text-gray-600">
          <div>{tourist.currentLocation.address}</div>
          <div className="text-xs mt-1">
            Lat: {tourist.currentLocation.lat}, Lng: {tourist.currentLocation.lng}
          </div>
          <div className="text-xs text-blue-600 mt-2">
            Last updated: {tourist.currentLocation.lastUpdated}
          </div>
        </div>
      </div>

      {/* Location History */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Navigation className="w-4 h-4 mr-1" />
          Recent Locations
        </h4>
        <div className="space-y-2">
          {tourist.locationHistory?.map((location, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium">{location.place}</div>
                  <div className="text-xs text-gray-600">{location.address}</div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div>{location.time}</div>
                  <div>{location.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geo-fence Status */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          Safety Zones
        </h4>
        <div className="space-y-2">
          {tourist.geoFenceStatus?.map((zone, index) => (
            <div key={index} className={`border rounded-lg p-3 ${
              zone.status === 'inside' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{zone.name}</span>
                <Badge variant={zone.status === 'inside' ? 'success' : 'warning'}>
                  {zone.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      {/* Activity Timeline */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {tourist.activityLog?.map((activity, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full -ml-5 bg-white border-2 border-blue-500"></div>
                <span className="text-sm font-medium">{activity.action}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">{activity.details}</div>
              {activity.location && (
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {activity.location}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Health Status */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Heart className="w-4 h-4 mr-1 text-red-500" />
          Health Monitoring
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-700">{tourist.healthMetrics?.heartRate || 'N/A'}</div>
            <div className="text-xs text-green-600">Heart Rate</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">{tourist.healthMetrics?.steps || 'N/A'}</div>
            <div className="text-xs text-blue-600">Steps Today</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactsTab = () => (
    <div className="space-y-4">
      {/* Emergency Contacts */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Phone className="w-4 h-4 mr-1 text-red-500" />
          Emergency Contacts
        </h4>
        <div className="space-y-2">
          {tourist.emergencyContacts?.map((contact, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{contact.name}</div>
                  <div className="text-xs text-gray-600">{contact.relationship}</div>
                  <div className="text-xs text-blue-600 mt-1">{contact.phone}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => onAction?.('call', contact)}>
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Companions */}
      {tourist.travelCompanions && tourist.travelCompanions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <User className="w-4 h-4 mr-1" />
            Travel Companions
          </h4>
          <div className="space-y-2">
            {tourist.travelCompanions.map((companion, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={companion.avatar} />
                  <AvatarFallback>{companion.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{companion.name}</div>
                  <div className="text-xs text-gray-600">{companion.relationship}</div>
                </div>
                <Badge variant={companion.status === 'safe' ? 'success' : 'warning'}>
                  {companion.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Log */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-1" />
          Recent Communications
        </h4>
        <div className="space-y-2">
          {tourist.communicationLog?.map((comm, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium">{comm.type}</div>
                  <div className="text-xs text-gray-600">{comm.message}</div>
                </div>
                <div className="text-xs text-gray-500">{comm.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'location': return renderLocationTab();
      case 'activity': return renderActivityTab();
      case 'contacts': return renderContactsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tourist Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-1 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => onAction?.('message', tourist)}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction?.('call', tourist)}
            className="flex-1"
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction?.('track', tourist)}
            className="flex-1"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Track
          </Button>
        </div>
        {tourist.status === 'emergency' && (
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onAction?.('emergency_response', tourist)}
            className="w-full mt-2"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Dispatch Emergency Response
          </Button>
        )}
      </div>
    </div>
  );
};

// Floating Action Panel Component
export const FloatingActionPanel = ({ 
  isVisible = false,
  actions = [],
  position = 'bottom-right',
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-20 ${className}`}>
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mb-4 space-y-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              disabled={action.disabled}
              className={`w-full shadow-lg ${action.variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : ''}`}
              title={action.tooltip}
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        title="Quick Actions"
      >
        <div className={`transform transition-transform ${isExpanded ? 'rotate-45' : ''}`}>
          +
        </div>
      </Button>
    </div>
  );
};