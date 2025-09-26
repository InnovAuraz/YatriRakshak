import { useEffect, useCallback } from 'react';
import { useNotifications } from '../services/notifications.jsx';

// Keyboard shortcuts hook
export const useKeyboardShortcuts = (actions = {}) => {
  const { info } = useNotifications();

  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in input fields
    if (['input', 'textarea', 'select'].includes(event.target.tagName.toLowerCase())) {
      return;
    }

    // Prevent default browser behavior for our shortcuts
    const shortcutHandled = true;

    switch (event.key.toLowerCase()) {
      case 'escape':
        event.preventDefault();
        actions.clearSelection?.();
        break;

      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.focusSearch?.();
        }
        break;

      case 'g':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.toggleGeoFenceCreation?.();
        }
        break;

      case 'r':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.refreshData?.();
        }
        break;

      case 'm':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.toggleFullScreen?.();
        }
        break;

      case 'h':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.showHelp?.();
        }
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          const index = parseInt(event.key) - 1;
          actions.selectTab?.(index);
        }
        break;

      case 'arrowup':
      case 'arrowdown':
      case 'arrowleft':
      case 'arrowright':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.navigateItems?.(event.key.replace('arrow', ''));
        }
        break;

      case 'enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.confirmAction?.();
        }
        break;

      case 'delete':
      case 'backspace':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          actions.deleteSelected?.();
        }
        break;

      default:
        return false; // Shortcut not handled
    }

    return shortcutHandled;
  }, [actions]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Show keyboard shortcuts help
  const showShortcutsHelp = useCallback(() => {
    info(
      'Keyboard Shortcuts',
      'Press Ctrl+H to see all available shortcuts',
      {
        action: {
          primary: {
            label: 'View All Shortcuts',
            onClick: () => actions.showFullHelp?.()
          }
        },
        duration: 5000
      }
    );
  }, [info, actions]);

  return {
    showShortcutsHelp
  };
};

// Keyboard shortcuts help modal content
export const keyboardShortcuts = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl/Cmd', 'F'], description: 'Focus search bar' },
      { keys: ['Escape'], description: 'Clear selection/Close panels' },
      { keys: ['Ctrl/Cmd', '↑/↓/←/→'], description: 'Navigate between items' },
      { keys: ['Ctrl/Cmd', '1-5'], description: 'Switch between tabs' }
    ]
  },
  {
    category: 'Map Controls',
    shortcuts: [
      { keys: ['Ctrl/Cmd', 'G'], description: 'Toggle geo-fence creation mode' },
      { keys: ['Ctrl/Cmd', 'R'], description: 'Refresh map data' },
      { keys: ['Ctrl/Cmd', 'M'], description: 'Toggle full-screen mode' }
    ]
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: ['Enter'], description: 'Confirm action/Open details' },
      { keys: ['Ctrl/Cmd', 'Enter'], description: 'Execute primary action' },
      { keys: ['Ctrl/Cmd', 'Delete'], description: 'Delete selected item' }
    ]
  },
  {
    category: 'Help',
    shortcuts: [
      { keys: ['Ctrl/Cmd', 'H'], description: 'Show keyboard shortcuts' },
      { keys: ['F1'], description: 'Show help and documentation' }
    ]
  }
];

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {keyboardShortcuts.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, shortcutIndex) => (
                    <div
                      key={shortcutIndex}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{shortcut.description}</span>
                      <div className="flex space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono text-gray-600"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Most shortcuts work with either Ctrl (Windows/Linux) or Cmd (Mac)</li>
              <li>• Shortcuts are disabled when typing in input fields</li>
              <li>• Press Escape to quickly close any open panels or clear selections</li>
              <li>• Use arrow keys with Ctrl/Cmd to navigate between map markers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export/Import functionality
export const useDataExport = () => {
  const { success, error } = useNotifications();

  const exportToCSV = useCallback((data, filename = 'tourist_data') => {
    try {
      if (!data || data.length === 0) {
        error('Export Failed', 'No data available to export');
        return;
      }

      // Convert data to CSV format
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );

      const csvContent = [headers, ...rows].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('Export Successful', `Data exported to ${filename}.csv`);
    } catch (err) {
      error('Export Failed', `Could not export data: ${err.message}`);
    }
  }, [success, error]);

  const exportToPDF = useCallback((data, filename = 'tourist_report') => {
    try {
      // Create a simple HTML report for PDF generation
      const reportContent = `
        <html>
          <head>
            <title>Tourist Safety Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .status-safe { color: #22c55e; }
              .status-warning { color: #f59e0b; }
              .status-emergency { color: #ef4444; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>YatriRakshak Tourist Safety Report</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
              <h2>Summary</h2>
              <p>Total Tourists: ${data.length}</p>
              <p>Safe: ${data.filter(t => t.status === 'safe').length}</p>
              <p>Need Help: ${data.filter(t => t.status === 'help_needed').length}</p>
              <p>Emergency: ${data.filter(t => t.status === 'emergency').length}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tourist ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(tourist => `
                  <tr>
                    <td>${tourist.id || 'N/A'}</td>
                    <td>${tourist.name || 'N/A'}</td>
                    <td class="status-${tourist.status}">${tourist.status || 'unknown'}</td>
                    <td>${tourist.currentLocation?.address || 'Unknown'}</td>
                    <td>${tourist.currentLocation?.lastUpdated || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Open in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      success('PDF Report Generated', 'Report opened in new window for printing/saving');
    } catch (err) {
      error('PDF Export Failed', `Could not generate PDF: ${err.message}`);
    }
  }, [success, error]);

  return {
    exportToCSV,
    exportToPDF
  };
};