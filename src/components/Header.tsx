import React, { useState } from 'react';
import { FileText, Bell, Search, Plus, Settings, User, X, Database } from 'lucide-react';
import { notifications, currentUser } from '../data/mockData';
import { Notification } from '../types';
import { formatDateTime } from '../utils/formatters';
import NotificationPanel from './NotificationPanel';
import SettingsPanel from './SettingsPanel';
import UserPanel from './UserPanel';
import ManagementPanel from './ManagementPanel';

interface HeaderProps {
  onNewInstrument: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewInstrument }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const closeAllPanels = () => {
    setShowNotifications(false);
    setShowSettings(false);
    setShowUserPanel(false);
    setShowManagement(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InstrumentTracker</h1>
              <p className="text-sm text-gray-500">Sistema de Acompanhamento de Instrumentos</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                closeAllPanels();
                setShowManagement(!showManagement);
              }}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Database className="w-4 h-4" />
              Cadastros
            </button>
            
            <button
              onClick={onNewInstrument}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Novo Instrumento
            </button>
            
            <button 
              onClick={() => {
                closeAllPanels();
                setShowNotifications(!showNotifications);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => {
                closeAllPanels();
                setShowSettings(!showSettings);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => {
                closeAllPanels();
                setShowUserPanel(!showUserPanel);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* User Panel */}
      {showUserPanel && (
        <UserPanel 
          isOpen={showUserPanel}
          onClose={() => setShowUserPanel(false)}
        />
      )}

      {/* Management Panel */}
      {showManagement && (
        <ManagementPanel 
          isOpen={showManagement}
          onClose={() => setShowManagement(false)}
        />
      )}
    </header>
  );
};

export default Header;
