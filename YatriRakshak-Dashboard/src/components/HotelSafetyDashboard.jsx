import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Star,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  FileCheck,
  Flame,
  HeartHandshake,
  GraduationCap,
  Video,
  MessageSquare,
  Calendar
} from "lucide-react";

const HotelSafetyDashboard = () => {
  const [selectedView, setSelectedView] = useState("overview");

  // Sample hotel data with safety metrics
  const hotels = [
    {
      id: "HTL001",
      name: "Taj Mahal Palace",
      location: "Mumbai, Maharashtra",
      category: "5 Star",
      safetyScore: 96,
      blockchainVerified: true,
      status: "excellent",
      lastInspection: "2025-09-20",
      totalRooms: 285,
      occupancyRate: 78,
      guestRating: 4.8,
      reviews: 2847,
      certifications: ["ISO 14001", "Fire Safety", "Health & Hygiene"],
      metrics: {
        fireSafety: 98,
        emergencyResponse: 95,
        staffTraining: 92,
        securitySystem: 97,
        guestSatisfaction: 96
      },
      recentIncidents: 0,
      complianceIssues: []
    },
    {
      id: "HTL002",
      name: "The Leela Palace",
      location: "New Delhi",
      category: "5 Star",
      safetyScore: 94,
      blockchainVerified: true,
      status: "excellent",
      lastInspection: "2025-09-15",
      totalRooms: 254,
      occupancyRate: 82,
      guestRating: 4.7,
      reviews: 1923,
      certifications: ["ISO 9001", "Fire Safety", "Security Standard"],
      metrics: {
        fireSafety: 96,
        emergencyResponse: 93,
        staffTraining: 90,
        securitySystem: 95,
        guestSatisfaction: 94
      },
      recentIncidents: 1,
      complianceIssues: ["Emergency lighting in floor 3"]
    },
    {
      id: "HTL003",
      name: "ITC Grand Chola",
      location: "Chennai, Tamil Nadu",
      category: "5 Star",
      safetyScore: 88,
      blockchainVerified: true,
      status: "good",
      lastInspection: "2025-09-10",
      totalRooms: 600,
      occupancyRate: 75,
      guestRating: 4.6,
      reviews: 3241,
      certifications: ["Fire Safety", "Health Certificate"],
      metrics: {
        fireSafety: 89,
        emergencyResponse: 87,
        staffTraining: 85,
        securitySystem: 91,
        guestSatisfaction: 88
      },
      recentIncidents: 2,
      complianceIssues: ["Staff training completion", "Security camera maintenance"]
    },
    {
      id: "HTL004",
      name: "The Oberoi Udaivilas",
      location: "Udaipur, Rajasthan",
      category: "5 Star",
      safetyScore: 92,
      blockchainVerified: true,
      status: "excellent",
      lastInspection: "2025-09-18",
      totalRooms: 87,
      occupancyRate: 89,
      guestRating: 4.9,
      reviews: 1564,
      certifications: ["ISO 14001", "Fire Safety", "Heritage Preservation"],
      metrics: {
        fireSafety: 94,
        emergencyResponse: 91,
        staffTraining: 88,
        securitySystem: 93,
        guestSatisfaction: 95
      },
      recentIncidents: 0,
      complianceIssues: []
    },
    {
      id: "HTL005",
      name: "Hotel Sea Palace",
      location: "Goa",
      category: "3 Star",
      safetyScore: 76,
      blockchainVerified: false,
      status: "needs_improvement",
      lastInspection: "2025-08-25",
      totalRooms: 120,
      occupancyRate: 65,
      guestRating: 4.2,
      reviews: 892,
      certifications: ["Fire Safety"],
      metrics: {
        fireSafety: 78,
        emergencyResponse: 72,
        staffTraining: 68,
        securitySystem: 75,
        guestSatisfaction: 79
      },
      recentIncidents: 3,
      complianceIssues: ["Blockchain verification pending", "Staff training incomplete", "Emergency response drill overdue"]
    },
    {
      id: "HTL006",
      name: "Backpacker's Inn",
      location: "Rishikesh, Uttarakhand",
      category: "Budget",
      safetyScore: 68,
      blockchainVerified: false,
      status: "critical",
      lastInspection: "2025-08-15",
      totalRooms: 45,
      occupancyRate: 58,
      guestRating: 3.8,
      reviews: 445,
      certifications: [],
      metrics: {
        fireSafety: 65,
        emergencyResponse: 60,
        staffTraining: 55,
        securitySystem: 70,
        guestSatisfaction: 75
      },
      recentIncidents: 5,
      complianceIssues: ["Fire safety inspection overdue", "No blockchain verification", "Staff training not completed", "Security system upgrade needed"]
    }
  ];

  // Calculate summary metrics
  const totalHotels = hotels.length;
  const averageSafetyScore = Math.round(hotels.reduce((sum, hotel) => sum + hotel.safetyScore, 0) / totalHotels);
  const verifiedHotels = hotels.filter(h => h.blockchainVerified).length;
  const criticalHotels = hotels.filter(h => h.status === "critical").length;
  const excellentHotels = hotels.filter(h => h.status === "excellent").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "needs_improvement":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Safety Certification Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hotels</p>
                <p className="text-2xl font-bold">{totalHotels}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Safety Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageSafetyScore)}`}>{averageSafetyScore}/100</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% this month
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blockchain Verified</p>
                <p className="text-2xl font-bold text-purple-600">{verifiedHotels}/{totalHotels}</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {Math.round((verifiedHotels/totalHotels)*100)}% verified
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{criticalHotels}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Hotel Status Cards</TabsTrigger>
          <TabsTrigger value="metrics">Safety Metrics</TabsTrigger>
          <TabsTrigger value="reports">Inspection Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{hotel.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {hotel.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(hotel.status)}>
                      {hotel.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Safety Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Safety Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(hotel.safetyScore)}`}>
                        {hotel.safetyScore}/100
                      </span>
                    </div>
                    <Progress 
                      value={hotel.safetyScore} 
                      className="h-2"
                      style={{
                        background: `linear-gradient(to right, ${getProgressColor(hotel.safetyScore)} ${hotel.safetyScore}%, #e2e8f0 ${hotel.safetyScore}%)`
                      }}
                    />
                  </div>

                  {/* Blockchain Verification */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Blockchain Verified</span>
                    {hotel.blockchainVerified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>

                  {/* Last Inspection */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Last Inspection</span>
                    <span className="text-sm font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(hotel.lastInspection).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Guest Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Guest Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{hotel.guestRating}</span>
                      <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
                    </div>
                  </div>

                  {/* Compliance Issues */}
                  {hotel.complianceIssues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-700">
                          {hotel.complianceIssues.length} Compliance Issue(s)
                        </span>
                      </div>
                      <ul className="text-xs text-red-600 space-y-1">
                        {hotel.complianceIssues.slice(0, 2).map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                        {hotel.complianceIssues.length > 2 && (
                          <li>• +{hotel.complianceIssues.length - 2} more...</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <Button variant="outline" className="w-full" size="sm">
                    <FileCheck className="w-4 h-4 mr-2" />
                    View Full Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fire Safety Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="w-5 h-5 mr-2 text-red-500" />
                  Fire Safety Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.slice(0, 4).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(hotel.metrics.fireSafety)}`}>
                          {hotel.metrics.fireSafety}%
                        </p>
                        <Progress value={hotel.metrics.fireSafety} className="w-24 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Response Readiness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Emergency Response Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.slice(0, 4).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(hotel.metrics.emergencyResponse)}`}>
                          {hotel.metrics.emergencyResponse}%
                        </p>
                        <Progress value={hotel.metrics.emergencyResponse} className="w-24 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staff Training Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                  Staff Training Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.slice(0, 4).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(hotel.metrics.staffTraining)}`}>
                          {hotel.metrics.staffTraining}%
                        </p>
                        <Progress value={hotel.metrics.staffTraining} className="w-24 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  Security System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.slice(0, 4).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(hotel.metrics.securitySystem)}`}>
                          {hotel.metrics.securitySystem}%
                        </p>
                        <Progress value={hotel.metrics.securitySystem} className="w-24 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guest Feedback Trends Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                Guest Feedback Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <p className="font-bold text-lg">{hotel.guestRating}</p>
                    <p className="text-sm text-muted-foreground truncate">{hotel.name}</p>
                    <p className="text-xs text-muted-foreground">{hotel.reviews} reviews</p>
                    <div className="mt-2">
                      <Progress value={hotel.guestRating * 20} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Inspections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Inspection Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.slice(0, 5).map((hotel) => (
                    <div key={hotel.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.location}</p>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className="text-xs text-muted-foreground">
                            Inspected: {new Date(hotel.lastInspection).toLocaleDateString()}
                          </span>
                          <Badge className={getStatusColor(hotel.status)} size="sm">
                            {hotel.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(hotel.safetyScore)}`}>
                          {hotel.safetyScore}/100
                        </p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Certification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{hotel.name}</p>
                        <Badge className={hotel.blockchainVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {hotel.blockchainVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hotel.certifications.length > 0 ? (
                          hotel.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No certifications</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelSafetyDashboard;