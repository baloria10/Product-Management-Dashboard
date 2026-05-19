import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-extrabold text-indigo-600 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          ProductDash
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-indigo-600 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full lg:w-64 bg-white shadow-lg lg:shadow-none lg:border-r border-gray-200 flex flex-col shrink-0 fixed lg:sticky top-0 h-screen z-30 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100 hidden lg:block">
          <h1 className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2 tracking-tight">
            <LayoutDashboard className="w-7 h-7" />
            ProductDash
          </h1>
        </div>
        <div className="p-6 flex-1 mt-16 lg:mt-0">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100/50">
            <div className="bg-indigo-600 p-2 rounded-full shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.username || 'User'}</p>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 pb-safe lg:pb-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 w-full p-3 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden lg:h-screen w-full">
        <div className="max-w-7xl mx-auto pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
