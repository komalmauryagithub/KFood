import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../../styles/admin/AdminLayout.css';
import '../../styles/admin/Buttons.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen || !isMobile} />
      
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      
      <main className={`admin-main ${(!isMobile || sidebarOpen) ? 'shifted' : ''}`}>
        <Outlet />
      </main>

      {/* Mobile hamburger - absolute position top-left */}
      {isMobile && (
        <button 
          className={`mobile-hamburger ${sidebarOpen ? 'open' : ''}`} 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    </div>
  );
};

export default AdminLayout;

