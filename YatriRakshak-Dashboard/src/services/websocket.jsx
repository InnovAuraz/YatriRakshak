import { useEffect, useState, useCallback, useRef } from 'react';

// WebSocket connection states
export const ConnectionStatus = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Event types for real-time updates
export const EventTypes = {
  TOURIST_UPDATE: 'tourist_update',
  EMERGENCY_ALERT: 'emergency_alert',
  VOLUNTEER_STATUS: 'volunteer_status',
  SYSTEM_STATUS: 'system_status',
  USER_MESSAGE: 'user_message',
  TYPING_INDICATOR: 'typing_indicator'
};

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this.statusListeners = new Set();
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
  }

  connect(url = 'ws://localhost:8080/ws') {
    try {
      this.ws = new WebSocket(url);
      this.connectionStatus = ConnectionStatus.CONNECTING;
      this.notifyStatusChange();

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.connectionStatus = ConnectionStatus.CONNECTED;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.notifyStatusChange();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        this.stopHeartbeat();
        this.notifyStatusChange();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatus = ConnectionStatus.ERROR;
        this.notifyStatusChange();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.connectionStatus = ConnectionStatus.ERROR;
      this.notifyStatusChange();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this.notifyStatusChange();
  }

  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket not connected, message not sent');
    return false;
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  subscribeToStatus(callback) {
    this.statusListeners.add(callback);
    // Immediately notify with current status
    callback(this.connectionStatus);

    // Return unsubscribe function
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  handleMessage(message) {
    const { type, data } = message;
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket message handler:', error);
        }
      });
    }
  }

  notifyStatusChange() {
    this.statusListeners.forEach(callback => {
      try {
        callback(this.connectionStatus);
      } catch (error) {
        console.error('Error in status change handler:', error);
      }
    });
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.connectionStatus = ConnectionStatus.RECONNECTING;
      this.notifyStatusChange();
      
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // Send ping every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }
}

// Singleton instance
const wsService = new WebSocketService();

// React hook for WebSocket functionality
export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState(wsService.getConnectionStatus());
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribeStatus = wsService.subscribeToStatus(setConnectionStatus);

    // Auto-connect when hook is first used
    if (connectionStatus === ConnectionStatus.DISCONNECTED) {
      wsService.connect();
    }

    return unsubscribeStatus;
  }, []);

  const subscribe = useCallback((eventType, callback) => {
    return wsService.subscribe(eventType, callback);
  }, []);

  const send = useCallback((type, data) => {
    return wsService.send(type, data);
  }, []);

  const connect = useCallback(() => {
    wsService.connect();
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  return {
    connectionStatus,
    lastMessage,
    subscribe,
    send,
    connect,
    disconnect,
    isConnected: connectionStatus === ConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === ConnectionStatus.CONNECTING,
    isReconnecting: connectionStatus === ConnectionStatus.RECONNECTING
  };
};

// Hook for real-time data updates
export const useRealTimeData = (eventType, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, (newData) => {
      setData(newData);
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, [eventType, subscribe]);

  return { data, lastUpdated };
};

// Hook for typing indicators
export const useTypingIndicator = (channel) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const { subscribe, send } = useWebSocket();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribe(EventTypes.TYPING_INDICATOR, (data) => {
      if (data.channel === channel) {
        setTypingUsers(data.users || []);
      }
    });

    return unsubscribe;
  }, [channel, subscribe]);

  const startTyping = useCallback(() => {
    send(EventTypes.TYPING_INDICATOR, {
      channel,
      action: 'start',
      userId: 'current-user' // This should come from auth context
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      send(EventTypes.TYPING_INDICATOR, {
        channel,
        action: 'stop',
        userId: 'current-user'
      });
    }, 3000);
  }, [channel, send]);

  const stopTyping = useCallback(() => {
    send(EventTypes.TYPING_INDICATOR, {
      channel,
      action: 'stop',
      userId: 'current-user'
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [channel, send]);

  return { typingUsers, startTyping, stopTyping };
};

export default wsService;