import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Palette, Globe } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      deadlineAlert: 7,
      dailyDigest: true
    },
    display: {
      theme: 'light',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      currency: 'BRL'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  if (!isOpen) return null;

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    onClose();
  };

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="absolute top-16 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Bell className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-gray-900">Notificações</h4>
          </div>
          
          <div className="space-y-3 pl-6">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Notificações por email</span>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Notificações push</span>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Resumo diário</span>
              <input
                type="checkbox"
                checked={settings.notifications.dailyDigest}
                onChange={(e) => updateSetting('notifications', 'dailyDigest', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Alerta de prazo (dias antes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.notifications.deadlineAlert}
                onChange={(e) => updateSetting('notifications', 'deadlineAlert', parseInt(e.target.value))}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Palette className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-gray-900">Exibição</h4>
          </div>
          
          <div className="space-y-3 pl-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tema</label>
              <select
                value={settings.display.theme}
                onChange={(e) => updateSetting('display', 'theme', e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Idioma</label>
              <select
                value={settings.display.language}
                onChange={(e) => updateSetting('display', 'language', e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Formato de data</label>
              <select
                value={settings.display.dateFormat}
                onChange={(e) => updateSetting('display', 'dateFormat', e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-4 h-4 text-red-600" />
            <h4 className="font-medium text-gray-900">Segurança</h4>
          </div>
          
          <div className="space-y-3 pl-6">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Autenticação de dois fatores</span>
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) => updateSetting('security', 'twoFactor', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Timeout da sessão (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
