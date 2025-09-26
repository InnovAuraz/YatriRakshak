import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Clock, 
  Download, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  FileText,
  Truck,
  Phone
} from 'lucide-react';

const SOSAlertHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');

  const [alertHistory, setAlertHistory] = useState([
    {
      id: 'SOS001',
      touristId: 'TR001',
      touristName: 'Rahul Sharma',
      alertType: 'Medical Emergency',
      severity: 'critical',
      location: 'Kedarnath Trail, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      alertTime: new Date('2024-09-27T10:15:00'),
      responseTime: 12, // minutes
      resolutionTime: new Date('2024-09-27T11:45:00'),
      status: 'Resolved',
      description: 'Severe altitude sickness, difficulty breathing',
      assignedTeam: 'Medical Team Alpha',
      responseNotes: 'Patient stabilized and evacuated to nearest medical facility. Full recovery expected.',
      contactAttempts: 3,
      escalationLevel: 2,
      reportGenerated: true
    },
    {
      id: 'SOS002',
      touristId: 'TR002',
      touristName: 'Priya Patel',
      alertType: 'Vehicle Breakdown',
      severity: 'medium',
      location: 'Manali Highway, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      alertTime: new Date('2024-09-27T08:30:00'),
      responseTime: 25,
      resolutionTime: new Date('2024-09-27T12:15:00'),
      status: 'Resolved',
      description: 'Vehicle broke down in remote area, no network coverage',
      assignedTeam: 'Rescue Team Beta',
      responseNotes: 'Vehicle repaired on-site. Tourist provided with emergency supplies.',
      contactAttempts: 1,
      escalationLevel: 1,
      reportGenerated: true
    },
    {
      id: 'SOS003',
      touristId: 'TR003',
      touristName: 'Amit Kumar',
      alertType: 'Lost/Missing',
      severity: 'critical',
      location: 'Rishikesh Rapids, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      alertTime: new Date('2024-09-27T06:45:00'),
      responseTime: 8,
      resolutionTime: null,
      status: 'In Progress',
      description: 'Lost during river rafting, last seen near Class IV rapids',
      assignedTeam: 'Water Rescue Unit',
      responseNotes: 'Search operation ongoing. Coast guard and local divers deployed.',
      contactAttempts: 5,
      escalationLevel: 3,
      reportGenerated: false
    },
    {
      id: 'SOS004',
      touristId: 'TR004',
      touristName: 'Sneha Reddy',
      alertType: 'Safety Concern',
      severity: 'medium',
      location: 'Ooty Tea Gardens, Tamil Nadu',
      coordinates: { lat: 11.4064, lng: 76.6932 },
      alertTime: new Date('2024-09-26T16:20:00'),
      responseTime: 15,
      resolutionTime: new Date('2024-09-26T18:45:00'),
      status: 'Resolved',
      description: 'Reported suspicious activity in isolated area',
      assignedTeam: 'Security Team Gamma',
      responseNotes: 'False alarm. Tourist safely escorted to main road.',
      contactAttempts: 2,
      escalationLevel: 1,
      reportGenerated: true
    },
    {
      id: 'SOS005',
      touristId: 'TR005',
      touristName: 'Vikash Singh',
      alertType: 'Weather Emergency',
      severity: 'critical',
      location: 'Ladakh Pass, Jammu & Kashmir',
      coordinates: { lat: 34.1526, lng: 77.5771 },
      alertTime: new Date('2024-09-25T14:30:00'),
      responseTime: 35,
      resolutionTime: new Date('2024-09-26T08:15:00'),
      status: 'Resolved',
      description: 'Caught in sudden snowstorm, visibility zero',
      assignedTeam: 'Mountain Rescue Team',
      responseNotes: 'Tourist rescued after 18-hour operation. Treated for mild hypothermia.',
      contactAttempts: 0, // No network coverage
      escalationLevel: 3,
      reportGenerated: true
    },
    {
      id: 'SOS006',
      touristId: 'TR006',
      touristName: 'Anita Sharma',
      alertType: 'Medical Emergency',
      severity: 'medium',
      location: 'Goa Beach Resort, Goa',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      alertTime: new Date('2024-09-24T20:15:00'),
      responseTime: 7,
      resolutionTime: new Date('2024-09-24T21:30:00'),
      status: 'Resolved',
      description: 'Allergic reaction to seafood, difficulty breathing',
      assignedTeam: 'Coastal Medical Unit',
      responseNotes: 'Emergency treatment administered. Tourist stabilized and recovered.',
      contactAttempts: 1,
      escalationLevel: 1,
      reportGenerated: true
    }
  ]);

  const filteredAlerts = useMemo(() => {
    let filtered = alertHistory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.touristId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alertType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => 
        alert.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Time range filter
    const now = new Date();
    if (selectedTimeRange !== 'all') {
      const days = selectedTimeRange === '7days' ? 7 : selectedTimeRange === '30days' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(alert => alert.alertTime >= cutoffDate);
    }

    return filtered.sort((a, b) => b.alertTime - a.alertTime);
  }, [alertHistory, searchTerm, filterStatus, selectedTimeRange]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'In Progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'Escalated':
        return <Badge variant="destructive">Escalated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Ongoing';
    
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Alert ID', 'Tourist ID', 'Name', 'Alert Type', 'Severity', 'Location', 'Alert Time', 'Response Time (min)', 'Resolution Time', 'Status', 'Assigned Team', 'Duration'].join(','),
      ...filteredAlerts.map(alert => [
        alert.id,
        alert.touristId,
        alert.touristName,
        alert.alertType,
        alert.severity,
        alert.location,
        alert.alertTime.toISOString(),
        alert.responseTime,
        alert.resolutionTime ? alert.resolutionTime.toISOString() : 'Ongoing',
        alert.status,
        alert.assignedTeam,
        formatDuration(alert.alertTime, alert.resolutionTime)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sos_alert_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    const total = filteredAlerts.length;
    const resolved = filteredAlerts.filter(a => a.status === 'Resolved').length;
    const inProgress = filteredAlerts.filter(a => a.status === 'In Progress').length;
    const avgResponseTime = filteredAlerts.reduce((sum, a) => sum + a.responseTime, 0) / total || 0;
    
    return { total, resolved, inProgress, avgResponseTime: Math.round(avgResponseTime) };
  };

  const stats = calculateStats();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            SOS Alert History
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="in progress">In Progress</option>
            <option value="escalated">Escalated</option>
          </select>
          
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Total Alerts</div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Resolved</div>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Avg Response</div>
            <div className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}m</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' : 
                    alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-lg">{alert.touristName}</div>
                    <div className="text-sm text-gray-600">{alert.touristId} • {alert.alertType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(alert.status)}
                  <div className="text-sm text-gray-500">
                    {formatDateTime(alert.alertTime)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Response: {alert.responseTime}m</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span>{alert.assignedTeam}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-700 mb-3">
                <strong>Description:</strong> {alert.description}
              </div>
              
              {alert.responseNotes && (
                <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded">
                  <strong>Response Notes:</strong> {alert.responseNotes}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Duration: {formatDuration(alert.alertTime, alert.resolutionTime)}</span>
                  <span>Contact Attempts: {alert.contactAttempts}</span>
                  <span>Escalation Level: {alert.escalationLevel}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {alert.reportGenerated && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Report
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No alerts found for the selected criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SOSAlertHistory;