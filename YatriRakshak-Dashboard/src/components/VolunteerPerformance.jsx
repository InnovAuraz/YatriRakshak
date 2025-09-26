import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Calendar,
  Star,
  Users,
  Clock,
  Target,
  Gift,
  Medal,
  Crown,
  Zap,
  Heart,
  Download
} from 'lucide-react';

const VolunteerPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('totalHelped');

  const [performanceData, setPerformanceData] = useState({
    leaderboard: [
      {
        rank: 1,
        id: 'V005',
        name: 'Captain Vikram',
        photo: '/placeholder.svg',
        location: 'Leh, Ladakh',
        totalHelped: 203,
        avgResponseTime: 4,
        rating: 5.0,
        points: 2850,
        badges: ['top-performer', 'quick-responder', 'hero'],
        monthlyStats: {
          helpCount: 28,
          responseTime: 4,
          rating: 5.0,
          emergenciesHandled: 15
        },
        rewards: ['Hero Badge', 'Quick Response Award', 'Excellence Certificate'],
        joinDate: '2022-05-01',
        totalPoints: 15420,
        level: 'Gold'
      },
      {
        rank: 2,
        id: 'V003',
        name: 'Amit Singh',
        photo: '/placeholder.svg',
        location: 'Rishikesh, Uttarakhand',
        totalHelped: 156,
        avgResponseTime: 6,
        rating: 4.8,
        points: 2340,
        badges: ['water-expert', 'reliable', 'mentor'],
        monthlyStats: {
          helpCount: 22,
          responseTime: 6,
          rating: 4.8,
          emergenciesHandled: 12
        },
        rewards: ['Water Rescue Expert', 'Reliability Award'],
        joinDate: '2022-11-10',
        totalPoints: 12680,
        level: 'Gold'
      },
      {
        rank: 3,
        id: 'V001',
        name: 'Dr. Rajesh Kumar',
        photo: '/placeholder.svg',
        location: 'Kedarnath, Uttarakhand',
        totalHelped: 127,
        avgResponseTime: 8,
        rating: 4.9,
        points: 2190,
        badges: ['medical-expert', 'lifesaver', 'professional'],
        monthlyStats: {
          helpCount: 18,
          responseTime: 8,
          rating: 4.9,
          emergenciesHandled: 10
        },
        rewards: ['Medical Excellence', 'Life Saver Award'],
        joinDate: '2023-03-15',
        totalPoints: 9850,
        level: 'Silver'
      },
      {
        rank: 4,
        id: 'V006',
        name: 'Maya Patel',
        photo: '/placeholder.svg',
        location: 'Goa Beach, Goa',
        totalHelped: 98,
        avgResponseTime: 10,
        rating: 4.5,
        points: 1680,
        badges: ['beach-safety', 'teamwork'],
        monthlyStats: {
          helpCount: 14,
          responseTime: 10,
          rating: 4.5,
          emergenciesHandled: 8
        },
        rewards: ['Beach Safety Expert'],
        joinDate: '2023-01-12',
        totalPoints: 7240,
        level: 'Silver'
      },
      {
        rank: 5,
        id: 'V002',
        name: 'Priya Sharma',
        photo: '/placeholder.svg',
        location: 'Manali, Himachal Pradesh',
        totalHelped: 89,
        avgResponseTime: 12,
        rating: 4.7,
        points: 1520,
        badges: ['helpful', 'dedicated'],
        monthlyStats: {
          helpCount: 12,
          responseTime: 12,
          rating: 4.7,
          emergenciesHandled: 6
        },
        rewards: ['Dedication Award'],
        joinDate: '2023-06-20',
        totalPoints: 6180,
        level: 'Bronze'
      }
    ],
    monthlyTrends: [
      { month: 'Jan', totalHelped: 145, avgResponse: 9.2, satisfaction: 4.6 },
      { month: 'Feb', totalHelped: 167, avgResponse: 8.8, satisfaction: 4.7 },
      { month: 'Mar', totalHelped: 189, avgResponse: 8.1, satisfaction: 4.8 },
      { month: 'Apr', totalHelped: 203, avgResponse: 7.9, satisfaction: 4.8 },
      { month: 'May', totalHelped: 221, avgResponse: 7.5, satisfaction: 4.9 },
      { month: 'Jun', totalHelped: 234, avgResponse: 7.2, satisfaction: 4.9 }
    ]
  });

  const rewardSystem = {
    levels: [
      { name: 'Bronze', minPoints: 0, color: 'bg-amber-600', benefits: ['Basic Recognition'] },
      { name: 'Silver', minPoints: 5000, color: 'bg-gray-400', benefits: ['Priority Support', 'Monthly Rewards'] },
      { name: 'Gold', minPoints: 10000, color: 'bg-yellow-500', benefits: ['Premium Support', 'Exclusive Events', 'Bonus Points'] },
      { name: 'Platinum', minPoints: 20000, color: 'bg-purple-500', benefits: ['VIP Treatment', 'Annual Trip', 'Leadership Program'] }
    ],
    badges: [
      { id: 'top-performer', name: 'Top Performer', icon: '🏆', description: 'Top 3 monthly performer' },
      { id: 'quick-responder', name: 'Quick Responder', icon: '⚡', description: 'Average response time under 5 minutes' },
      { id: 'hero', name: 'Hero', icon: '🦸', description: 'Handled critical emergencies' },
      { id: 'medical-expert', name: 'Medical Expert', icon: '🏥', description: 'Medical emergency specialist' },
      { id: 'water-expert', name: 'Water Rescue Expert', icon: '🌊', description: 'Water rescue specialist' },
      { id: 'reliable', name: 'Reliable', icon: '✅', description: '95%+ availability rate' },
      { id: 'lifesaver', name: 'Life Saver', icon: '❤️', description: 'Saved lives in emergencies' }
    ]
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level) => {
    const levelData = rewardSystem.levels.find(l => l.name === level);
    return levelData ? levelData.color : 'bg-gray-400';
  };

  const getBadgeIcon = (badgeId) => {
    const badge = rewardSystem.badges.find(b => b.id === badgeId);
    return badge ? badge.icon : '🏅';
  };

  const exportLeaderboard = () => {
    const csvContent = [
      ['Rank', 'Name', 'Location', 'Total Helped', 'Avg Response Time', 'Rating', 'Points', 'Level'].join(','),
      ...performanceData.leaderboard.map(volunteer => [
        volunteer.rank,
        volunteer.name,
        volunteer.location,
        volunteer.totalHelped,
        volunteer.avgResponseTime,
        volunteer.rating,
        volunteer.points,
        volunteer.level
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer_leaderboard_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Volunteer Performance & Rewards
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <Button 
                variant="outline" 
                onClick={exportLeaderboard}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold text-blue-600">{performanceData.leaderboard.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assisted</p>
                <p className="text-2xl font-bold text-green-600">
                  {performanceData.leaderboard.reduce((sum, v) => sum + v.totalHelped, 0)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(performanceData.leaderboard.reduce((sum, v) => sum + v.avgResponseTime, 0) / performanceData.leaderboard.length)}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(performanceData.leaderboard.reduce((sum, v) => sum + v.rating, 0) / performanceData.leaderboard.length).toFixed(1)}★
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performers - {selectedPeriod}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.leaderboard.map((volunteer) => (
                <div key={volunteer.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getRankIcon(volunteer.rank)}
                    <div className="text-lg font-bold text-gray-600">#{volunteer.rank}</div>
                  </div>
                  
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={volunteer.photo} alt={volunteer.name} />
                    <AvatarFallback>{volunteer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{volunteer.name}</h3>
                      <Badge className={`${getLevelColor(volunteer.level)} text-white text-xs`}>
                        {volunteer.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{volunteer.location}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {volunteer.monthlyStats.helpCount} helped
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {volunteer.monthlyStats.responseTime}m avg
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {volunteer.monthlyStats.rating}★
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{volunteer.points}</div>
                    <div className="text-xs text-gray-500">points</div>
                    
                    {/* Badges */}
                    <div className="flex gap-1 mt-2">
                      {volunteer.badges.slice(0, 3).map((badgeId) => (
                        <span key={badgeId} className="text-lg" title={rewardSystem.badges.find(b => b.id === badgeId)?.description}>
                          {getBadgeIcon(badgeId)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple Bar Chart Representation */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Monthly Assistance Trend</h4>
                <div className="space-y-2">
                  {performanceData.monthlyTrends.map((trend, index) => (
                    <div key={trend.month} className="flex items-center gap-3">
                      <div className="w-8 text-xs text-gray-600">{trend.month}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(trend.totalHelped / 250) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {trend.totalHelped}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Response Time Improvement</h4>
                <div className="space-y-2">
                  {performanceData.monthlyTrends.map((trend, index) => (
                    <div key={trend.month} className="flex items-center gap-3">
                      <div className="w-8 text-xs text-gray-600">{trend.month}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-green-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(0, (15 - trend.avgResponse) / 15) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {trend.avgResponse}m
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards and Recognition System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {rewardSystem.badges.map((badge) => (
                <div key={badge.id} className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Level System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" />
              Volunteer Levels & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardSystem.levels.map((level) => (
                <div key={level.name} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{level.name} Level</span>
                      <span className="text-xs text-gray-600">({level.minPoints}+ points)</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {level.benefits.join(', ')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {performanceData.leaderboard.filter(v => v.level === level.name).length} volunteers
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerPerformance;