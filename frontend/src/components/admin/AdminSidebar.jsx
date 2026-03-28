import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Package, Users, Heart, Mail, BarChart3 } from 'lucide-react';
import '../../styles/admin/Sidebar.css';
import '../../styles/admin/Buttons.css';

const AdminSidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/foods', icon: Package, label: 'Food Management' },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/wishlist', icon: Heart, label: 'Wishlist Monitor' },
    { to: '/admin/contacts', icon: Mail, label: 'Contacts' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>KFOOD Admin</h2>
        <p>Welcome, {user?.name}</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-danger btn-small logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

