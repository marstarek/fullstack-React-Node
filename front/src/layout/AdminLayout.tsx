import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/shared/Sidebar';
import Header from '@/shared/Header/Header';

interface AdminLayoutProps {
  userRole?: string;
  title?: string;
}

export default function AdminLayout({ userRole , title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        userRole={userRole}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <Header onMenuToggle={toggleSidebar} title={title} />
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}