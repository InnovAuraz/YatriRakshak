import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  AlertTriangle, 
  MessageSquare, 
  Route,
  User,
  Heart,
  Shield
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.jsx";

const TouristDetailsPanel = ({ tourist, onClose, onShowRoute, isRouteVisible }) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  if (!tourist) return null;

  const getRiskColor = (score) => {
    if (score < 30) return "text-success bg-success/10 border-success";
    if (score < 70) return "text-warning bg-warning/10 border-warning";
    return "text-emergency bg-emergency/10 border-emergency";
  };

  const getRiskLabel = (score) => {
    if (score < 30) return "LOW RISK";
    if (score < 70) return "MEDIUM RISK";
    return "HIGH RISK";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "safe":
        return <Badge className="bg-success/10 text-success border-success">Safe</Badge>;
      case "alert":
        return <Badge className="bg-warning/10 text-warning border-warning">Alert</Badge>;
      case "emergency":
        return <Badge className="bg-emergency/10 text-emergency border-emergency">Emergency</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCheckInStatusBadge = (status) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-success/10 text-success border-success">Checked In</Badge>;
      case "overdue":
        return <Badge className="bg-warning/10 text-warning border-warning">Check-in Overdue</Badge>;
      case "emergency":
        return <Badge className="bg-emergency/10 text-emergency border-emergency">Emergency Status</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSendAlert = () => {
    // Simulate sending alert
    console.log(`Sending alert to ${tourist.name} (${tourist.id})`);
    setIsAlertDialogOpen(false);
    // Here you would typically make an API call
  };

  const handleContactTourist = (method) => {
    // Simulate contacting tourist
    console.log(`Contacting ${tourist.name} via ${method}`);
    setIsContactDialogOpen(false);
    // Here you would typically initiate the contact method
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold font-poppins">Tourist Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tourist Profile */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={tourist.photo} alt={tourist.name} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{tourist.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{tourist.id}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusBadge(tourist.status)}
                  {getCheckInStatusBadge(tourist.checkInStatus)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Current Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="font-medium">{tourist.location.name}, {tourist.location.state}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Last updated: {tourist.lastUpdate}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowRoute(tourist.id)}
                className="w-full"
              >
                <Route className="w-4 h-4 mr-2" />
                {isRouteVisible ? "Hide Route" : "Show Route"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Score</span>
                <Badge className={`${getRiskColor(tourist.riskScore)} font-bold`}>
                  {tourist.riskScore}/100
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    tourist.riskScore < 30 ? 'bg-success' :
                    tourist.riskScore < 70 ? 'bg-warning' : 'bg-emergency'
                  }`}
                  style={{ width: `${tourist.riskScore}%` }}
                ></div>
              </div>
              <p className={`text-xs font-medium ${getRiskColor(tourist.riskScore).split(' ')[0]}`}>
                {getRiskLabel(tourist.riskScore)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {tourist.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relation}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {tourist.activities.map((activity, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {index < tourist.activities.length - 1 && (
                      <div className="w-px h-6 bg-border mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border p-4 space-y-3">
        <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="destructive">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Emergency Alert</DialogTitle>
              <DialogDescription>
                Are you sure you want to send an emergency alert to {tourist.name}? 
                This will notify them immediately and may trigger emergency protocols.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSendAlert}>
                Send Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Tourist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact {tourist.name}</DialogTitle>
              <DialogDescription>
                Choose how you would like to contact this tourist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handleContactTourist("SMS")}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
              <Button onClick={() => handleContactTourist("Call")}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button onClick={() => handleContactTourist("Push")}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Push Notification
              </Button>
              <Button onClick={() => handleContactTourist("WhatsApp")}>
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Wellness Check
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            <MapPin className="w-4 h-4 mr-2" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TouristDetailsPanel;