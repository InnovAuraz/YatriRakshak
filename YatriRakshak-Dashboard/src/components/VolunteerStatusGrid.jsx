import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  CheckCircle, 
  Search,
  Filter,
  Phone,
  MessageSquare,
  Heart,
  Car,
  Languages,
  Stethoscope
} from 'lucide-react';

const VolunteerStatusGrid = ({ onVolunteerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [volunteers, setVolunteers] = useState([
    {
      id: 'V001',
      name: 'Dr. Rajesh Kumar',
      photo: '/placeholder.svg',
      location: 'Kedarnath, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      status: 'online',
      rating: 4.9,
      totalHelped: 127,
      avgResponseTime: 8, // minutes
      skills: ['first-aid', 'medical', 'hindi', 'english'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(),
      joinDate: '2023-03-15',
      specializations: ['Emergency Medicine', 'Mountain Rescue'],
      languages: ['Hindi', 'English', 'Garhwali'],
      vehicleAccess: true,
      currentAssignment: null,
      experience: '5 years',
      contactNumber: '+91 98765 43210'
    },
    {
      id: 'V002',
      name: 'Priya Sharma',
      photo: '/placeholder.svg',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      status: 'busy',
      rating: 4.7,
      totalHelped: 89,
      avgResponseTime: 12,
      skills: ['first-aid', 'hindi', 'english', 'vehicle'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: false
      },
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      joinDate: '2023-06-20',
      specializations: ['Tourist Assistance', 'Local Guide'],
      languages: ['Hindi', 'English', 'Punjabi'],
      vehicleAccess: true,
      currentAssignment: 'EMG002',
      experience: '2 years',
      contactNumber: '+91 87654 32109'
    },
    {
      id: 'V003',
      name: 'Amit Singh',
      photo: '/placeholder.svg',
      location: 'Rishikesh, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      status: 'online',
      rating: 4.8,
      totalHelped: 156,
      avgResponseTime: 6,
      skills: ['first-aid', 'water-rescue', 'hindi', 'english'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      joinDate: '2022-11-10',
      specializations: ['Water Rescue', 'Adventure Sports Safety'],
      languages: ['Hindi', 'English'],
      vehicleAccess: false,
      currentAssignment: null,
      experience: '3 years',
      contactNumber: '+91 76543 21098'
    },
    {
      id: 'V004',
      name: 'Sneha Reddy',
      photo: '/placeholder.svg',
      location: 'Ooty, Tamil Nadu',
      coordinates: { lat: 11.4064, lng: 76.6932 },
      status: 'offline',
      rating: 4.6,
      totalHelped: 73,
      avgResponseTime: 15,
      skills: ['first-aid', 'tamil', 'english', 'kannada'],
      verifications: {
        idVerified: true,
        trainingComplete: false,
        backgroundCheck: true
      },
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: '2023-08-05',
      specializations: ['Tourist Information', 'Cultural Guide'],
      languages: ['Tamil', 'English', 'Kannada', 'Hindi'],
      vehicleAccess: true,
      currentAssignment: null,
      experience: '1 year',
      contactNumber: '+91 65432 10987'
    },
    {
      id: 'V005',
      name: 'Captain Vikram',
      photo: '/placeholder.svg',
      location: 'Leh, Ladakh',
      coordinates: { lat: 34.1526, lng: 77.5771 },
      status: 'online',
      rating: 5.0,
      totalHelped: 203,
      avgResponseTime: 4,
      skills: ['first-aid', 'mountain-rescue', 'hindi', 'english', 'vehicle'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(),
      joinDate: '2022-05-01',
      specializations: ['High Altitude Rescue', 'Military Training'],
      languages: ['Hindi', 'English', 'Ladakhi'],
      vehicleAccess: true,
      currentAssignment: null,
      experience: '8 years',
      contactNumber: '+91 54321 09876'
    },
    {
      id: 'V006',
      name: 'Maya Patel',
      photo: '/placeholder.svg',
      location: 'Goa Beach, Goa',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      status: 'busy',
      rating: 4.5,
      totalHelped: 98,
      avgResponseTime: 10,
      skills: ['first-aid', 'water-rescue', 'gujarati', 'english', 'hindi'],
      verifications: {
        idVerified: true,
        trainingComplete: true,
        backgroundCheck: true
      },
      lastSeen: new Date(Date.now() - 45 * 60 * 1000),
      joinDate: '2023-01-12',
      specializations: ['Beach Safety', 'Water Sports'],
      languages: ['Gujarati', 'Hindi', 'English'],
      vehicleAccess: false,
      currentAssignment: 'EMG006',
      experience: '2 years',
      contactNumber: '+91 43210 98765'
    }
  ]);

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    
    const matchesSkill = skillFilter === 'all' || volunteer.skills.includes(skillFilter);
    
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Busy
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="outline" className="text-gray-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            Offline
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'first-aid':
        return <Stethoscope className="h-4 w-4" />;
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'water-rescue':
        return <Heart className="h-4 w-4" />;
      case 'mountain-rescue':
        return <Shield className="h-4 w-4" />;
      default:
        return <Languages className="h-4 w-4" />;
    }
  };

  const getVerificationScore = (verifications) => {
    const total = Object.keys(verifications).length;
    const verified = Object.values(verifications).filter(Boolean).length;
    return Math.round((verified / total) * 100);
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const diff = now - lastSeen;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleContactVolunteer = (volunteer, method) => {
    // Handle volunteer contact
    console.log(`Contacting ${volunteer.name} via ${method}`);
  };

  const handleAssignVolunteer = (volunteer) => {
    // Handle volunteer assignment
    console.log(`Assigning volunteer ${volunteer.name}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Volunteer Status Grid
            <Badge variant="secondary" className="ml-2">
              {filteredVolunteers.length} Available
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Export List
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
          
          <select 
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Skills</option>
            <option value="first-aid">First Aid</option>
            <option value="vehicle">Vehicle Access</option>
            <option value="water-rescue">Water Rescue</option>
            <option value="mountain-rescue">Mountain Rescue</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                {/* Header with Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={volunteer.photo} alt={volunteer.name} />
                      <AvatarFallback>{volunteer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{volunteer.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {volunteer.location}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(volunteer.status)}
                </div>
                
                {/* Rating and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{volunteer.rating}</span>
                    <span className="text-sm text-gray-600">({volunteer.totalHelped} helped)</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {volunteer.experience} exp
                  </div>
                </div>
                
                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {volunteer.verifications.idVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ID Verified
                    </Badge>
                  )}
                  {volunteer.verifications.trainingComplete && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Training Complete
                    </Badge>
                  )}
                  {volunteer.verifications.backgroundCheck && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Background Checked
                    </Badge>
                  )}
                </div>
                
                {/* Skills */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Skills & Languages</div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs flex items-center gap-1">
                        {getSkillIcon(skill)}
                        {skill.replace('-', ' ')}
                      </Badge>
                    ))}
                    {volunteer.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{volunteer.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{volunteer.totalHelped}</div>
                    <div className="text-xs text-gray-600">Total Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{volunteer.avgResponseTime}m</div>
                    <div className="text-xs text-gray-600">Avg Response</div>
                  </div>
                </div>
                
                {/* Current Assignment */}
                {volunteer.currentAssignment && (
                  <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded">
                    <div className="text-sm font-medium text-orange-800">
                      Currently assigned to: {volunteer.currentAssignment}
                    </div>
                  </div>
                )}
                
                {/* Last Seen */}
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last seen: {formatLastSeen(volunteer.lastSeen)}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactVolunteer(volunteer, 'call')}
                    disabled={volunteer.status === 'offline'}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactVolunteer(volunteer, 'message')}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  {volunteer.status === 'online' && !volunteer.currentAssignment && (
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleAssignVolunteer(volunteer)}
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredVolunteers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No volunteers found matching the criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerStatusGrid;