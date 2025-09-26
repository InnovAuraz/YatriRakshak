import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotifications } from '../services/notifications.jsx';

// Hook for interactive map functionality
export const useInteractiveMap = (initialData = []) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [geoFences, setGeoFences] = useState([]);
  const [isCreatingGeoFence, setIsCreatingGeoFence] = useState(false);
  const mapRef = useRef(null);
  const { success, info } = useNotifications();

  // Handle item click
  const handleItemClick = useCallback((item, event) => {
    event.stopPropagation();
    setSelectedItem(item);
    setContextMenu(null);
    
    info(
      `Selected: ${item.name || item.id}`,
      `Click for more details and actions`,
      {
        action: {
          primary: {
            label: 'View Details',
            onClick: () => {
              console.log('View details for:', item);
            }
          }
        }
      }
    );
  }, [info]);

  // Handle item hover
  const handleItemHover = useCallback((item) => {
    setHoveredItem(item);
  }, []);

  // Handle item leave
  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Handle right-click context menu
  const handleContextMenu = useCallback((item, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    setContextMenu({
      item,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pageX: event.pageX,
      pageY: event.pageY
    });
  }, []);

  // Handle double-click for detailed view
  const handleDoubleClick = useCallback((item, event) => {
    event.stopPropagation();
    
    success(
      `Opening detailed view`,
      `Loading detailed information for ${item.name || item.id}`,
      {
        action: {
          primary: {
            label: 'Open in New Tab',
            onClick: () => {
              window.open(`#/details/${item.id}`, '_blank');
            }
          }
        }
      }
    );
  }, [success]);

  // Handle drag start for geo-fence creation
  const handleDragStart = useCallback((event) => {
    if (!isCreatingGeoFence) return;
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setIsDragging(true);
    setDragStart({ x, y });
  }, [isCreatingGeoFence]);

  // Handle drag move
  const handleDragMove = useCallback((event) => {
    if (!isDragging || !dragStart) return;
    
    // Visual feedback during dragging could be implemented here
  }, [isDragging, dragStart]);

  // Handle drag end - create geo-fence
  const handleDragEnd = useCallback((event) => {
    if (!isDragging || !dragStart) return;
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const endX = ((event.clientX - rect.left) / rect.width) * 100;
    const endY = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Calculate bounds
    const bounds = {
      left: Math.min(dragStart.x, endX),
      top: Math.min(dragStart.y, endY),
      right: Math.max(dragStart.x, endX),
      bottom: Math.max(dragStart.y, endY)
    };

    // Create new geo-fence
    const newGeoFence = {
      id: `geo-${Date.now()}`,
      type: 'custom',
      bounds,
      color: 'rgba(59, 130, 246, 0.3)',
      strokeColor: '#3b82f6',
      name: `Custom Zone ${geoFences.length + 1}`,
      created: new Date()
    };

    setGeoFences(prev => [...prev, newGeoFence]);
    setIsDragging(false);
    setDragStart(null);
    setIsCreatingGeoFence(false);

    success(
      'Geo-fence Created',
      `New security zone "${newGeoFence.name}" has been created`,
      {
        action: {
          primary: {
            label: 'Configure',
            onClick: () => {
              setSelectedItem(newGeoFence);
            }
          }
        }
      }
    );
  }, [isDragging, dragStart, geoFences, success]);

  // Clear selection when clicking on empty area
  const handleMapClick = useCallback((event) => {
    if (event.target === mapRef.current || event.target.closest('.map-background')) {
      setSelectedItem(null);
      setContextMenu(null);
    }
  }, []);

  // Toggle geo-fence creation mode
  const toggleGeoFenceCreation = useCallback(() => {
    setIsCreatingGeoFence(!isCreatingGeoFence);
    setContextMenu(null);
    
    if (!isCreatingGeoFence) {
      info(
        'Geo-fence Creation Mode',
        'Click and drag on the map to create a new security zone'
      );
    }
  }, [isCreatingGeoFence, info]);

  // Delete geo-fence
  const deleteGeoFence = useCallback((geoFenceId) => {
    setGeoFences(prev => prev.filter(gf => gf.id !== geoFenceId));
    success('Geo-fence Deleted', 'Security zone has been removed');
  }, [success]);

  return {
    selectedItem,
    hoveredItem,
    contextMenu,
    isDragging,
    isCreatingGeoFence,
    geoFences,
    mapRef,
    handlers: {
      onItemClick: handleItemClick,
      onItemHover: handleItemHover,
      onItemLeave: handleItemLeave,
      onContextMenu: handleContextMenu,
      onDoubleClick: handleDoubleClick,
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      onMapClick: handleMapClick
    },
    actions: {
      toggleGeoFenceCreation,
      deleteGeoFence,
      setSelectedItem,
      setContextMenu
    }
  };
};

// Interactive Marker Component
export const InteractiveMarker = ({ 
  item, 
  position, 
  isSelected = false, 
  isHovered = false,
  handlers,
  children,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'z-20 scale-110' : 'z-10'
      } ${isHovered ? 'scale-105' : ''} ${isAnimating ? 'animate-pulse' : ''} ${className}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%` 
      }}
      onClick={(e) => handlers.onItemClick(item, e)}
      onDoubleClick={(e) => handlers.onDoubleClick(item, e)}
      onContextMenu={(e) => handlers.onContextMenu(item, e)}
      onMouseEnter={() => handlers.onItemHover(item)}
      onMouseLeave={handlers.onItemLeave}
    >
      {/* Selection ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping scale-150 opacity-75" />
      )}
      
      {/* Hover ring */}
      {isHovered && !isSelected && (
        <div className="absolute inset-0 rounded-full border border-blue-300 scale-125 opacity-50" />
      )}
      
      {children}
    </div>
  );
};

// Context Menu Component
export const ContextMenu = ({ 
  contextMenu, 
  onClose, 
  actions = [] 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!contextMenu) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-40 min-w-48"
      style={{
        left: contextMenu.pageX,
        top: contextMenu.pageY
      }}
    >
      {actions.map((action, index) => (
        <div key={index}>
          {action.type === 'divider' ? (
            <div className="border-t border-gray-200 my-1" />
          ) : (
            <button
              onClick={() => {
                action.onClick(contextMenu.item);
                onClose();
              }}
              disabled={action.disabled}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                action.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              } ${action.danger ? 'text-red-600 hover:bg-red-50' : ''}`}
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              <span>{action.label}</span>
              {action.shortcut && (
                <span className="ml-auto text-xs text-gray-400">
                  {action.shortcut}
                </span>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Geo-fence Component
export const GeoFence = ({ 
  geoFence, 
  isSelected = false,
  onSelect,
  onDelete,
  className = ""
}) => {
  const { bounds, color, strokeColor, name, type } = geoFence;
  
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;

  return (
    <div
      className={`absolute cursor-pointer transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
      } ${className}`}
      style={{
        left: `${bounds.left}%`,
        top: `${bounds.top}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: color,
        border: `2px ${type === 'restricted' ? 'dashed' : 'solid'} ${strokeColor}`,
        borderRadius: '4px'
      }}
      onClick={() => onSelect(geoFence)}
    >
      {/* Label */}
      <div className="absolute top-1 left-1 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
        {name}
      </div>
      
      {/* Delete button (only when selected) */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(geoFence.id);
          }}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          title="Delete geo-fence"
        >
          ×
        </button>
      )}
      
      {/* Resize handles (only when selected) */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
        </>
      )}
    </div>
  );
};

// Drag Selection Overlay
export const DragSelectionOverlay = ({ 
  isDragging, 
  dragStart, 
  currentPosition,
  className = "" 
}) => {
  if (!isDragging || !dragStart || !currentPosition) return null;

  const left = Math.min(dragStart.x, currentPosition.x);
  const top = Math.min(dragStart.y, currentPosition.y);
  const width = Math.abs(currentPosition.x - dragStart.x);
  const height = Math.abs(currentPosition.y - dragStart.y);

  return (
    <div
      className={`absolute pointer-events-none border-2 border-blue-500 border-dashed bg-blue-100 bg-opacity-30 ${className}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`
      }}
    >
      <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
        Creating Geo-fence
      </div>
    </div>
  );
};