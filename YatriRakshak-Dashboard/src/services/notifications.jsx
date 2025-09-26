import { useState, useCallback, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useWebSocket, EventTypes } from '../services/websocket.jsx';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Bell, 
  User,
  MapPin,
  Shield,
  Users
} from 'lucide-react';

// Notification types and their configurations
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  EMERGENCY: 'emergency'
};

const NotificationConfig = {
  [NotificationTypes.SUCCESS]: {
    icon: CheckCircle,
    className: 'text-green-600',
    duration: 4000
  },
  [NotificationTypes.ERROR]: {
    icon: XCircle,
    className: 'text-red-600',
    duration: 6000
  },
  [NotificationTypes.WARNING]: {
    icon: AlertTriangle,
    className: 'text-yellow-600',
    duration: 5000
  },
  [NotificationTypes.INFO]: {
    icon: Info,
    className: 'text-blue-600',
    duration: 4000
  },
  [NotificationTypes.EMERGENCY]: {
    icon: AlertTriangle,
    className: 'text-red-600',
    duration: 0 // Persistent until dismissed
  }
};

// Custom toast component for rich notifications
const CustomToast = ({ type, title, message, action, data }) => {
  const config = NotificationConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-80">
      <Icon className={`w-5 h-5 mt-0.5 ${config.className}`} />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        {message && <div className="text-sm text-gray-600 mt-1">{message}</div>}
        {data && (
          <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
            {typeof data === 'object' ? JSON.stringify(data, null, 2) : data}
          </div>
        )}
        {action && (
          <div className="mt-3 flex space-x-2">
            {action.primary && (
              <button
                onClick={action.primary.onClick}
                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
              >
                {action.primary.label}
              </button>
            )}
            {action.secondary && (
              <button
                onClick={action.secondary.onClick}
                className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
              >
                {action.secondary.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Notification service class
class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = new Set();
  }

  show(type, title, message = null, options = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      timestamp: new Date(),
      ...options
    };

    // Add to internal store
    this.notifications.unshift(notification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50); // Keep only latest 50
    }

    // Show toast
    const config = NotificationConfig[type];
    const toastOptions = {
      duration: config.duration,
      className: 'custom-toast'
    };

    if (options.action || options.data) {
      toast.custom((t) => (
        <CustomToast
          type={type}
          title={title}
          message={message}
          action={options.action}
          data={options.data}
        />
      ), toastOptions);
    } else {
      const toastFunction = toast[type] || toast;
      toastFunction(title, { description: message, ...toastOptions });
    }

    // Notify listeners
    this.notifyListeners();

    return notification.id;
  }

  success(title, message, options = {}) {
    return this.show(NotificationTypes.SUCCESS, title, message, options);
  }

  error(title, message, options = {}) {
    return this.show(NotificationTypes.ERROR, title, message, options);
  }

  warning(title, message, options = {}) {
    return this.show(NotificationTypes.WARNING, title, message, options);
  }

  info(title, message, options = {}) {
    return this.show(NotificationTypes.INFO, title, message, options);
  }

  emergency(title, message, options = {}) {
    return this.show(NotificationTypes.EMERGENCY, title, message, options);
  }

  dismiss(id) {
    toast.dismiss(id);
  }

  dismissAll() {
    toast.dismiss();
  }

  getNotifications() {
    return this.notifications;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }
}

// Singleton instance
const notificationService = new NotificationService();

// React hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState(notificationService.getNotifications());

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    show: notificationService.show.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    emergency: notificationService.emergency.bind(notificationService),
    dismiss: notificationService.dismiss.bind(notificationService),
    dismissAll: notificationService.dismissAll.bind(notificationService)
  };
};

// React hook for real-time notifications
export const useRealTimeNotifications = () => {
  const { subscribe } = useWebSocket();
  const { success, error, warning, emergency, info } = useNotifications();

  useEffect(() => {
    // Emergency alerts
    const unsubscribeEmergency = subscribe(EventTypes.EMERGENCY_ALERT, (data) => {
      emergency(
        `Emergency Alert: ${data.type}`,
        `Tourist ${data.touristId} needs immediate assistance`,
        {
          data,
          action: {
            primary: {
              label: 'View Details',
              onClick: () => {
                // Navigate to emergency details
                window.location.hash = `#emergency/${data.id}`;
              }
            },
            secondary: {
              label: 'Acknowledge',
              onClick: () => {
                // Send acknowledgment
                console.log('Emergency acknowledged:', data.id);
              }
            }
          }
        }
      );
    });

    // Tourist updates
    const unsubscribeTourist = subscribe(EventTypes.TOURIST_UPDATE, (data) => {
      if (data.statusChanged) {
        const statusMessages = {
          safe: 'Tourist status updated to safe',
          alert: 'Tourist requires attention',
          emergency: 'Tourist in emergency situation'
        };
        
        const notificationType = data.status === 'emergency' ? 'emergency' : 
                               data.status === 'alert' ? 'warning' : 'success';
        
        const notify = notificationType === 'emergency' ? emergency : 
                      notificationType === 'warning' ? warning : success;
        
        notify(
          `Tourist Update: ${data.name}`,
          statusMessages[data.status] || 'Status updated',
          {
            action: {
              primary: {
                label: 'View Tourist',
                onClick: () => {
                  window.location.hash = `#tourist/${data.id}`;
                }
              }
            }
          }
        );
      }
    });

    // Volunteer status updates
    const unsubscribeVolunteer = subscribe(EventTypes.VOLUNTEER_STATUS, (data) => {
      if (data.availability === 'available') {
        success(
          'Volunteer Available',
          `${data.name} is now available for assignments`
        );
      } else if (data.availability === 'busy') {
        info(
          'Volunteer Busy',
          `${data.name} is currently handling an assignment`
        );
      }
    });

    // System status updates
    const unsubscribeSystem = subscribe(EventTypes.SYSTEM_STATUS, (data) => {
      if (data.type === 'maintenance') {
        warning(
          'System Maintenance',
          `Scheduled maintenance: ${data.message}`,
          { data }
        );
      } else if (data.type === 'error') {
        error(
          'System Error',
          data.message,
          { data }
        );
      } else {
        info(
          'System Update',
          data.message,
          { data }
        );
      }
    });

    return () => {
      unsubscribeEmergency();
      unsubscribeTourist();
      unsubscribeVolunteer();
      unsubscribeSystem();
    };
  }, [subscribe, success, error, warning, emergency, info]);
};

// Notification bell component
export const NotificationBell = ({ className = "" }) => {
  const { notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="font-medium text-sm">{notification.title}</div>
                  {notification.message && (
                    <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {notification.timestamp.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Global toast container
export const NotificationProvider = ({ children }) => {
  useRealTimeNotifications();

  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        closeButton
        richColors
        expand={true}
        visibleToasts={5}
      />
    </>
  );
};

export default notificationService;