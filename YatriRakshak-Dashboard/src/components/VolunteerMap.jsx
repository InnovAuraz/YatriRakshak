import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Map, 
  Users, 
  Filter, 
  Maximize2, 
  Minimize2,
  MapPin,
  Car,
  Stethoscope,
  Languages,
  Shield,
  Heart,
  Search,
  RefreshCw
} from 'lucide-react';

const VolunteerMap = ({ volunteers = [], onVolunteerClick }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    skills: 'all',
    coverage: true
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  
  // Default volunteers data if not provided
  const defaultVolunteers = [
    {
      id: 'V001',
      name: 'Dr. Rajesh Kumar',
      location: 'Kedarnath, Uttarakhand',
      coordinates: { lat: 30.7346, lng: 79.0669 },
      status: 'available',
      skills: ['first-aid', 'medical', 'hindi'],
      rating: 4.9,
      responseRadius: 2, // km
      totalHelped: 127,
      avgResponseTime: 8,
      vehicleAccess: false,
      languages: ['Hindi', 'English', 'Garhwali'],
      specialization: 'Emergency Medicine'
    },
    {
      id: 'V002',
      name: 'Priya Sharma',
      location: 'Manali, Himachal Pradesh',
      coordinates: { lat: 32.2432, lng: 77.1892 },
      status: 'busy',
      skills: ['first-aid', 'vehicle', 'hindi', 'english'],
      rating: 4.7,
      responseRadius: 3,
      totalHelped: 89,
      avgResponseTime: 12,
      vehicleAccess: true,
      languages: ['Hindi', 'English', 'Punjabi'],
      specialization: 'Tourist Assistance'
    },
    {
      id: 'V003',
      name: 'Amit Singh',
      location: 'Rishikesh, Uttarakhand',
      coordinates: { lat: 30.0869, lng: 78.2676 },
      status: 'available',
      skills: ['water-rescue', 'first-aid', 'hindi'],
      rating: 4.8,
      responseRadius: 1.5,
      totalHelped: 156,
      avgResponseTime: 6,
      vehicleAccess: false,
      languages: ['Hindi', 'English'],
      specialization: 'Water Rescue'
    },
    {
      id: 'V004',
      name: 'Captain Vikram',
      location: 'Leh, Ladakh',
      coordinates: { lat: 34.1526, lng: 77.5771 },
      status: 'available',
      skills: ['mountain-rescue', 'first-aid', 'vehicle', 'hindi', 'english'],
      rating: 5.0,
      responseRadius: 5,
      totalHelped: 203,
      avgResponseTime: 4,
      vehicleAccess: true,
      languages: ['Hindi', 'English', 'Ladakhi'],
      specialization: 'High Altitude Rescue'
    },
    {
      id: 'V005',
      name: 'Maya Patel',
      location: 'Goa Beach, Goa',
      coordinates: { lat: 15.2993, lng: 74.1240 },
      status: 'busy',
      skills: ['water-rescue', 'first-aid', 'gujarati'],
      rating: 4.5,
      responseRadius: 2,
      totalHelped: 98,
      avgResponseTime: 10,
      vehicleAccess: false,
      languages: ['Gujarati', 'Hindi', 'English'],
      specialization: 'Beach Safety'
    },
    {
      id: 'V006',
      name: 'Sneha Reddy',
      location: 'Ooty, Tamil Nadu',
      coordinates: { lat: 11.4064, lng: 76.6932 },
      status: 'available',
      skills: ['first-aid', 'tamil', 'vehicle'],
      rating: 4.6,
      responseRadius: 2.5,
      totalHelped: 73,
      avgResponseTime: 15,
      vehicleAccess: true,
      languages: ['Tamil', 'English', 'Kannada'],
      specialization: 'Cultural Guide'
    }
  ];

  const volunteerData = volunteers.length > 0 ? volunteers : defaultVolunteers;

  const filteredVolunteers = volunteerData.filter(volunteer => {
    const statusMatch = selectedFilters.status === 'all' || volunteer.status === selectedFilters.status;
    const skillMatch = selectedFilters.skills === 'all' || volunteer.skills.includes(selectedFilters.skills);
    return statusMatch && skillMatch;
  });

  const getVolunteerDotColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 border-green-600';
      case 'busy':
        return 'bg-blue-500 border-blue-600';
      case 'offline':
        return 'bg-gray-400 border-gray-500';
      default:
        return 'bg-gray-400 border-gray-500';
    }
  };

  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'first-aid':
        return <Stethoscope className="h-3 w-3" />;
      case 'vehicle':
        return <Car className="h-3 w-3" />;
      case 'water-rescue':
        return <Heart className="h-3 w-3" />;
      case 'mountain-rescue':
        return <Shield className="h-3 w-3" />;
      default:
        return <Languages className="h-3 w-3" />;
    }
  };

  const handleVolunteerMarkerClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    if (onVolunteerClick) {
      onVolunteerClick(volunteer);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const calculateCoverageRadius = (responseRadius) => {
    // Convert km to percentage for display
    return Math.min(responseRadius * 2, 8); // Cap at 8% of map width
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'w-full'}`}>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              Volunteer Coverage Map
              <Badge variant="secondary" className="ml-2">
                {filteredVolunteers.filter(v => v.status === 'available').length} Available
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select 
                value={selectedFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            
            <select 
              value={selectedFilters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Skills</option>
              <option value="first-aid">First Aid</option>
              <option value="vehicle">Vehicle Access</option>
              <option value="water-rescue">Water Rescue</option>
              <option value="mountain-rescue">Mountain Rescue</option>
            </select>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFilters.coverage}
                onChange={(e) => handleFilterChange('coverage', e.target.checked)}
                className="rounded"
              />
              Show Coverage Areas
            </label>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className={`relative bg-gradient-to-br from-green-50 to-blue-50 ${isFullScreen ? 'h-screen' : 'h-96'}`}>
            {/* India Map Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <path
                d="M100,200 L150,180 L200,160 L250,140 L300,160 L350,180 L400,200 L450,220 L400,250 L350,280 L300,300 L250,320 L200,300 L150,280 L100,260 Z"
                fill="none"
                stroke="#4B5563"
                strokeWidth="2"
              />
            </svg>
            
            {/* Volunteer Markers and Coverage Areas */}
            {filteredVolunteers.map((volunteer) => (
              <div key={volunteer.id} className="absolute">
                {/* Coverage Area Circle */}
                {selectedFilters.coverage && (
                  <div
                    className="absolute rounded-full border-2 border-opacity-30 bg-opacity-10"
                    style={{
                      left: `${25 + (volunteer.coordinates.lng || 77) * 0.6}%`,
                      top: `${60 - (volunteer.coordinates.lat || 28) * 1.2}%`,
                      width: `${calculateCoverageRadius(volunteer.responseRadius)}%`,
                      height: `${calculateCoverageRadius(volunteer.responseRadius)}%`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: volunteer.status === 'available' ? '#10B981' : '#3B82F6',
                      backgroundColor: volunteer.status === 'available' ? '#10B981' : '#3B82F6'
                    }}
                  />
                )}
                
                {/* Volunteer Marker */}
                <div
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${25 + (volunteer.coordinates.lng || 77) * 0.6}%`,
                    top: `${60 - (volunteer.coordinates.lat || 28) * 1.2}%`
                  }}
                  onClick={() => handleVolunteerMarkerClick(volunteer)}
                >
                  <div className="relative">
                    {/* Main Dot */}
                    <div className={`w-4 h-4 rounded-full border-2 ${getVolunteerDotColor(volunteer.status)} shadow-lg ${
                      volunteer.status === 'available' ? 'animate-pulse' : ''
                    }`}></div>
                    
                    {/* Vehicle Access Indicator */}
                    {volunteer.vehicleAccess && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                        <Car className="h-2 w-2 text-blue-600" />
                      </div>
                    )}
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="font-medium">{volunteer.name}</div>
                      <div>{volunteer.location}</div>
                      <div>Status: {volunteer.status}</div>
                      <div>Rating: {volunteer.rating}★</div>
                      <div>Response: {volunteer.avgResponseTime}m</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Map Legend */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <h3 className="font-medium mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600"></div>
                  <span>Available Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border border-blue-600"></div>
                  <span>Busy Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
                  <span>Offline Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-3 w-3 text-blue-600" />
                  <span>Vehicle Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-green-300 bg-green-100"></div>
                  <span>Coverage Area (2km)</span>
                </div>
              </div>
            </div>
            
            {/* Statistics Panel */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-medium mb-3">Coverage Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Available</div>
                  <div className="text-xl font-bold text-green-600">
                    {filteredVolunteers.filter(v => v.status === 'available').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Busy</div>
                  <div className="text-xl font-bold text-blue-600">
                    {filteredVolunteers.filter(v => v.status === 'busy').length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Rating</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {(filteredVolunteers.reduce((sum, v) => sum + v.rating, 0) / filteredVolunteers.length).toFixed(1)}★
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">With Vehicles</div>
                  <div className="text-xl font-bold text-purple-600">
                    {filteredVolunteers.filter(v => v.vehicleAccess).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Volunteer Details</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedVolunteer(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium">Name:</span> {selectedVolunteer.name}
              </div>
              <div>
                <span className="font-medium">Location:</span> {selectedVolunteer.location}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <Badge 
                  variant={selectedVolunteer.status === 'available' ? 'secondary' : 'outline'}
                  className={`ml-2 ${selectedVolunteer.status === 'available' ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {selectedVolunteer.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Rating:</span> {selectedVolunteer.rating}★
              </div>
              <div>
                <span className="font-medium">Specialization:</span> {selectedVolunteer.specialization}
              </div>
              <div>
                <span className="font-medium">Response Time:</span> {selectedVolunteer.avgResponseTime} minutes
              </div>
              <div>
                <span className="font-medium">Coverage Radius:</span> {selectedVolunteer.responseRadius} km
              </div>
              <div>
                <span className="font-medium">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedVolunteer.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs flex items-center gap-1">
                      {getSkillIcon(skill)}
                      {skill.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                Contact Volunteer
              </Button>
              {selectedVolunteer.status === 'available' && (
                <Button variant="outline" className="flex-1">
                  Assign Task
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerMap;