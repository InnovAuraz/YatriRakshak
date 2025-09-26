import { useState, useEffect, useCallback } from 'react';
import { Badge } from './ui/badge.jsx';
import { useWebSocket, ConnectionStatus } from '../services/websocket.jsx';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  Activity,
  Zap,
  Radio,
  Signal
} from 'lucide-react';

// Auto-refresh hook with customizable intervals
export const useAutoRefresh = (callback, interval = 30000, dependencies = []) => {
  const [isActive, setIsActive] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [nextRefresh, setNextRefresh] = useState(null);

  const refresh = useCallback(async () => {
    try {
      await callback();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Auto-refresh error:', error);
    }
  }, dependencies);

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      refresh();
    }, interval);

    // Set next refresh time
    setNextRefresh(new Date(Date.now() + interval));

    return () => clearInterval(intervalId);
  }, [refresh, interval, isActive]);

  const toggleAutoRefresh = () => {
    setIsActive(!isActive);
  };

  const manualRefresh = () => {
    refresh();
  };

  return {
    isActive,
    lastRefresh,
    nextRefresh,
    toggleAutoRefresh,
    manualRefresh
  };
};

// Connection Status Indicator
export const ConnectionStatusIndicator = ({ showText = true, className = "" }) => {
  const { connectionStatus } = useWebSocket();

  const statusConfig = {
    [ConnectionStatus.CONNECTED]: {
      icon: Wifi,
      text: 'Connected',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      pulseColor: 'bg-green-400'
    },
    [ConnectionStatus.CONNECTING]: {
      icon: Radio,
      text: 'Connecting',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      pulseColor: 'bg-yellow-400'
    },
    [ConnectionStatus.RECONNECTING]: {
      icon: RefreshCw,
      text: 'Reconnecting',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      pulseColor: 'bg-orange-400'
    },
    [ConnectionStatus.DISCONNECTED]: {
      icon: WifiOff,
      text: 'Disconnected',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pulseColor: 'bg-red-400'
    },
    [ConnectionStatus.ERROR]: {
      icon: WifiOff,
      text: 'Connection Error',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pulseColor: 'bg-red-400'
    }
  };

  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.pulseColor} animate-pulse`} />
        <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.pulseColor} animate-ping opacity-75`} />
      </div>
      <Icon className={`w-4 h-4 ${config.color} ${connectionStatus === ConnectionStatus.RECONNECTING ? 'animate-spin' : ''}`} />
      {showText && (
        <span className={`text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
      )}
    </div>
  );
};

// Live Data Counter
export const LiveDataCounter = ({ 
  label, 
  value, 
  formatValue = (v) => v,
  refreshInterval = 30000,
  className = "" 
}) => {
  const [animatedValue, setAnimatedValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (value !== animatedValue) {
      setIsUpdating(true);
      
      // Animate value change
      const startValue = animatedValue;
      const endValue = value;
      const duration = 500;
      const steps = 20;
      const stepValue = (endValue - startValue) / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedValue(Math.round(startValue + stepValue * currentStep));
        } else {
          setAnimatedValue(endValue);
          setIsUpdating(false);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [value, animatedValue]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Activity className={`w-3 h-3 text-blue-500 ${isUpdating ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-gray-600">{label}:</span>
      </div>
      <span className={`font-mono text-sm font-medium transition-colors duration-300 ${
        isUpdating ? 'text-blue-600' : 'text-gray-900'
      }`}>
        {formatValue(animatedValue)}
      </span>
    </div>
  );
};

// Auto Refresh Status
export const AutoRefreshStatus = ({ 
  isActive, 
  lastRefresh, 
  nextRefresh, 
  onToggle, 
  onManualRefresh,
  className = "" 
}) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isActive || !nextRefresh) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((nextRefresh - now) / 1000));
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, nextRefresh]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatLastRefresh = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className={`flex items-center space-x-4 text-sm ${className}`}>
      {/* Auto-refresh toggle */}
      <button
        onClick={onToggle}
        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
          isActive 
            ? 'text-green-600 hover:bg-green-50' 
            : 'text-gray-500 hover:bg-gray-50'
        }`}
        title={isActive ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
      >
        <Zap className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
        <span>{isActive ? 'Auto' : 'Manual'}</span>
      </button>

      {/* Countdown */}
      {isActive && (
        <div className="flex items-center space-x-1 text-gray-600">
          <Clock className="w-3 h-3" />
          <span className="font-mono">
            Next: {formatCountdown(countdown)}
          </span>
        </div>
      )}

      {/* Last refresh */}
      <div className="flex items-center space-x-1 text-gray-500">
        <span>Updated:</span>
        <span className="font-mono">
          {formatLastRefresh(lastRefresh)}
        </span>
      </div>

      {/* Manual refresh button */}
      <button
        onClick={onManualRefresh}
        className="flex items-center space-x-1 px-2 py-1 rounded text-gray-600 hover:bg-gray-50 transition-colors"
        title="Refresh now"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Refresh</span>
      </button>
    </div>
  );
};

// Live Status Badge
export const LiveStatusBadge = ({ 
  status = 'live', 
  count = null, 
  label = 'Live',
  className = "" 
}) => {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    if (status === 'live') {
      const interval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const statusConfig = {
    live: {
      color: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-500'
    },
    updating: {
      color: 'bg-blue-500',
      textColor: 'text-white',
      borderColor: 'border-blue-500'
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-500'
    },
    offline: {
      color: 'bg-gray-500',
      textColor: 'text-white',
      borderColor: 'border-gray-500'
    }
  };

  const config = statusConfig[status] || statusConfig.live;

  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${config.textColor} border ${config.borderColor} ${className}`}
    >
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full bg-white ${isPulsing && status === 'live' ? 'animate-pulse' : ''}`} />
        <span>{label}</span>
        {count !== null && (
          <span className="ml-1 font-mono">
            {typeof count === 'number' ? count.toLocaleString() : count}
          </span>
        )}
      </div>
    </Badge>
  );
};

// Data Freshness Indicator
export const DataFreshnessIndicator = ({ 
  lastUpdated, 
  maxAge = 300000, // 5 minutes
  className = "" 
}) => {
  const [freshness, setFreshness] = useState('fresh');
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateFreshness = () => {
      if (!lastUpdated) {
        setFreshness('unknown');
        setTimeAgo('Never updated');
        return;
      }

      const now = new Date();
      const diff = now - lastUpdated;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      // Update time ago text
      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m ago`);
      } else {
        setTimeAgo(`${hours}h ago`);
      }

      // Update freshness status
      if (diff < 30000) { // Less than 30 seconds
        setFreshness('fresh');
      } else if (diff < 120000) { // Less than 2 minutes
        setFreshness('recent');
      } else if (diff < maxAge) { // Less than max age
        setFreshness('stale');
      } else {
        setFreshness('expired');
      }
    };

    updateFreshness();
    const interval = setInterval(updateFreshness, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated, maxAge]);

  const freshnessConfig = {
    fresh: {
      color: 'text-green-600',
      icon: Activity
    },
    recent: {
      color: 'text-blue-600',
      icon: Clock
    },
    stale: {
      color: 'text-yellow-600',
      icon: Clock
    },
    expired: {
      color: 'text-red-600',
      icon: WifiOff
    },
    unknown: {
      color: 'text-gray-500',
      icon: WifiOff
    }
  };

  const config = freshnessConfig[freshness];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-1 text-xs ${config.color} ${className}`}>
      <Icon className="w-3 h-3" />
      <span>{timeAgo}</span>
    </div>
  );
};

// Network Quality Indicator
export const NetworkQualityIndicator = ({ className = "" }) => {
  const { connectionStatus, isConnected } = useWebSocket();
  const [quality, setQuality] = useState('good');
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      setQuality('poor');
      setLatency(null);
      return;
    }

    // Simulate network quality measurement
    const measureQuality = () => {
      const start = Date.now();
      // In a real implementation, this would ping the server
      setTimeout(() => {
        const end = Date.now();
        const pingTime = end - start;
        setLatency(pingTime);
        
        if (pingTime < 100) setQuality('excellent');
        else if (pingTime < 300) setQuality('good');
        else if (pingTime < 1000) setQuality('fair');
        else setQuality('poor');
      }, Math.random() * 200 + 50); // Simulate network delay
    };

    measureQuality();
    const interval = setInterval(measureQuality, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [isConnected]);

  const qualityConfig = {
    excellent: {
      color: 'text-green-600',
      bars: 4,
      label: 'Excellent'
    },
    good: {
      color: 'text-green-500',
      bars: 3,
      label: 'Good'
    },
    fair: {
      color: 'text-yellow-500',
      bars: 2,
      label: 'Fair'
    },
    poor: {
      color: 'text-red-500',
      bars: 1,
      label: 'Poor'
    }
  };

  const config = qualityConfig[quality];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Signal bars */}
      <div className="flex items-end space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 bg-current transition-opacity ${
              bar <= config.bars ? 'opacity-100' : 'opacity-30'
            } ${config.color}`}
            style={{ height: `${bar * 3 + 2}px` }}
          />
        ))}
      </div>
      
      {/* Quality label and latency */}
      <div className={`text-xs ${config.color}`}>
        <div>{config.label}</div>
        {latency && (
          <div className="font-mono">{latency}ms</div>
        )}
      </div>
    </div>
  );
};

export default {
  useAutoRefresh,
  ConnectionStatusIndicator,
  LiveDataCounter,
  AutoRefreshStatus,
  LiveStatusBadge,
  DataFreshnessIndicator,
  NetworkQualityIndicator
};