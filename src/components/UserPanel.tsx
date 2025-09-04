import React from 'react';
import { User, Settings, LogOut, Shield, Bell } from 'lucide-react';

interface UserPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleAction = (action: string) => {
    console.log(`Ação: ${action}`);
    onClose();
  };

  return (
    <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">João Silva</h3>
            <p className="text-sm text-gray-500">Administrador</p>
            <p className="text-xs text-gray-400">joao.silva@empresa.com</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-xs text-gray-500">Instrumentos Criados</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-gray-500">Assinados</div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          <button
            onClick={() => handleAction('perfil')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </button>
          
          <button
            onClick={() => handleAction('configuracoes')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
          
          <button
            onClick={() => handleAction('notificacoes')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
          </button>
          
          <button
            onClick={() => handleAction('permissoes')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Permissões</span>
          </button>
          
          <hr className="my-2" />
          
          <button
            onClick={() => handleAction('logout')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserPanel;
