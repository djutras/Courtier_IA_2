import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, UserPlus, Home, TestTube, Zap, FileText, PlayCircle } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
          </div>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/chat"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/chat')
                  ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MessageCircle size={16} />
              Chat
            </Link>
            
            <Link
              to="/vehicle-form"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vehicle-form')
                  ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText size={16} />
              Form
            </Link>
            
            <Link
              to="/vehicle-step/1"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/vehicle-step')
                  ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText size={16} />
              Steps
            </Link>
            
            <Link
              to="/automated-test"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/automated-test')
                  ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Zap size={16} />
              Auto Test
            </Link>
            
            <Link
              to="/auto-test-form"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/auto-test-form')
                  ? 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <PlayCircle size={16} />
              Auto Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}