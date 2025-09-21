import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Home, 
  Heart, 
  ChefHat, 
  Settings, 
  Shield, 
  Menu, 
  X,
  BarChart3,
  FileText,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: <Home className="w-5 h-5" />,
    roles: ['USER', 'RESTAURANT_ADMIN', 'SUPERADMIN']
  },
  {
    path: '/favorites',
    label: 'Favorites',
    icon: <Heart className="w-5 h-5" />,
    roles: ['USER', 'RESTAURANT_ADMIN', 'SUPERADMIN']
  },
  {
    path: '/restaurant-dashboard',
    label: 'Restaurant Dashboard',
    icon: <ChefHat className="w-5 h-5" />,
    roles: ['RESTAURANT_ADMIN', 'SUPERADMIN']
  },
  {
    path: '/superAdmin/users',
    label: 'User Management',
    icon: <Users className="w-5 h-5" />,
    roles: ['SUPERADMIN']
  },
  {
    path: '/superAdmin/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['SUPERADMIN']
  },
  {
    path: '/superAdmin/reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    roles: ['SUPERADMIN']
  },
  {
    path: '/superAdmin/permissions',
    label: 'Permissions',
    icon: <UserCheck className="w-5 h-5" />,
    roles: ['SUPERADMIN']
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['USER', 'RESTAURANT_ADMIN', 'SUPERADMIN']
  }
];

export default function Sidebar({ isOpen, onToggle, userRole = 'USER' }: SidebarProps) {
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#24222263]  z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        w-64 border-r border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {item.icon} 
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}