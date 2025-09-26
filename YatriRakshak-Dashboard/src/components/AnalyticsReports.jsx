import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  MapPin,
  Shield,
  AlertTriangle,
  Star,
  Clock
} from "lucide-react";

const AnalyticsReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [selectedState, setSelectedState] = useState("all");

  // Tourist Arrivals Data (Last 12 Months)
  const touristArrivalsData = [
    { month: "Oct 2024", arrivals: 45200, growth: 8.5 },
    { month: "Nov 2024", arrivals: 52100, growth: 15.3 },
    { month: "Dec 2024", arrivals: 68900, growth: 32.2 },
    { month: "Jan 2025", arrivals: 58700, growth: -14.8 },
    { month: "Feb 2025", arrivals: 49200, growth: -16.2 },
    { month: "Mar 2025", arrivals: 55800, growth: 13.4 },
    { month: "Apr 2025", arrivals: 62400, growth: 11.8 },
    { month: "May 2025", arrivals: 47300, growth: -24.2 },
    { month: "Jun 2025", arrivals: 41800, growth: -11.6 },
    { month: "Jul 2025", arrivals: 59200, growth: 41.6 },
    { month: "Aug 2025", arrivals: 66700, growth: 12.7 },
    { month: "Sep 2025", arrivals: 71500, growth: 7.2 }
  ];

  // Emergency Incidents by State Data
  const emergencyIncidentsData = [
    { state: "Rajasthan", incidents: 45, resolved: 42, pending: 3 },
    { state: "Goa", incidents: 32, resolved: 30, pending: 2 },
    { state: "Kerala", incidents: 28, resolved: 26, pending: 2 },
    { state: "Himachal Pradesh", incidents: 38, resolved: 35, pending: 3 },
    { state: "Uttarakhand", incidents: 41, resolved: 37, pending: 4 },
    { state: "Maharashtra", incidents: 52, resolved: 48, pending: 4 },
    { state: "Delhi", incidents: 29, resolved: 27, pending: 2 },
    { state: "Tamil Nadu", incidents: 35, resolved: 33, pending: 2 }
  ];

  // Response Time Improvements Data
  const responseTimeData = [
    { month: "Oct", current: 12, previous: 18, target: 10 },
    { month: "Nov", current: 11, previous: 17, target: 10 },
    { month: "Dec", current: 15, previous: 19, target: 10 },
    { month: "Jan", current: 10, previous: 16, target: 10 },
    { month: "Feb", current: 9, previous: 15, target: 10 },
    { month: "Mar", current: 8, previous: 14, target: 10 },
    { month: "Apr", current: 9, previous: 13, target: 10 },
    { month: "May", current: 7, previous: 12, target: 10 },
    { month: "Jun", current: 8, previous: 14, target: 10 },
    { month: "Jul", current: 6, previous: 11, target: 10 },
    { month: "Aug", current: 7, previous: 13, target: 10 },
    { month: "Sep", current: 6, previous: 12, target: 10 }
  ];

  // Tourist Satisfaction Scores Data
  const satisfactionData = [
    { name: "Excellent", value: 45, count: 8965, color: "#22c55e" },
    { name: "Good", value: 32, count: 6378, color: "#3b82f6" },
    { name: "Average", value: 18, count: 3587, color: "#f59e0b" },
    { name: "Poor", value: 3, count: 598, color: "#ef4444" },
    { name: "Very Poor", value: 2, count: 398, color: "#dc2626" }
  ];

  // Safety Incidents by Category Data
  const safetyIncidentsData = [
    { name: "Medical Emergency", value: 35, color: "#ef4444", count: 142 },
    { name: "Lost Tourist", value: 25, color: "#f59e0b", count: 101 },
    { name: "Theft/Fraud", value: 20, color: "#dc2626", count: 81 },
    { name: "Natural Disaster", value: 8, color: "#7c3aed", count: 32 },
    { name: "Transportation", value: 7, color: "#3b82f6", count: 28 },
    { name: "Accommodation", value: 5, color: "#059669", count: 20 }
  ];

  // Volunteer Activity Heatmap Data
  const volunteerHeatmapData = [
    { state: "Rajasthan", volunteers: 245, activities: 1250, efficiency: 85 },
    { state: "Goa", volunteers: 189, activities: 890, efficiency: 92 },
    { state: "Kerala", volunteers: 178, activities: 945, efficiency: 88 },
    { state: "Himachal Pradesh", volunteers: 156, activities: 820, efficiency: 90 },
    { state: "Uttarakhand", volunteers: 134, activities: 675, efficiency: 87 },
    { state: "Maharashtra", volunteers: 298, activities: 1450, efficiency: 83 },
    { state: "Delhi", volunteers: 167, activities: 789, efficiency: 91 },
    { state: "Tamil Nadu", volunteers: 201, activities: 1120, efficiency: 89 }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626'];

  // Custom Tooltip Components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey === 'arrivals' && ' tourists'}
              {entry.dataKey === 'incidents' && ' incidents'}
              {entry.dataKey.includes('time') && ' minutes'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value}% ({data.payload.count} responses)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive data visualization and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tourists</p>
                <p className="text-2xl font-bold">691.5K</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.3% from last year
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">8.2 min</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -45% improvement
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Incidents</p>
                <p className="text-2xl font-bold">404</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% incidents
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                <p className="text-2xl font-bold">4.2/5</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.3 improvement
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Tourist Arrivals Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Tourist Arrivals Trend (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={touristArrivalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="arrivals" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Incidents by State */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Emergency Incidents by State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emergencyIncidentsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="state" 
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                  <Bar dataKey="pending" fill="#ef4444" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Time Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-500" />
              Response Time Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="5 5" label="Target" />
                  <Area 
                    type="monotone" 
                    dataKey="previous" 
                    stackId="1" 
                    stroke="#94a3b8" 
                    fill="#94a3b8" 
                    fillOpacity={0.3}
                    name="Previous Year"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stackId="2" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                    name="Current Year"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tourist Satisfaction Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Tourist Satisfaction Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Safety Incidents by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-500" />
              Safety Incidents by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safetyIncidentsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                  >
                    {safetyIncidentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Activity Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Volunteer Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {volunteerHeatmapData.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${item.efficiency / 100 * 0.8})`,
                  }}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-sm mb-2">{item.state}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Volunteers:</span>
                        <span className="font-medium">{item.volunteers}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Activities:</span>
                        <span className="font-medium">{item.activities}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Efficiency:</span>
                        <span className="font-medium">{item.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-gray-500" />
            Export & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Charts as PDF
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Download Raw Data (CSV)
            </Button>
            <Button variant="outline" className="justify-start">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsReports;