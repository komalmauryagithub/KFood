import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          KFOOD
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/drama-bites" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Drama Bites
          </NavLink>
          <NavLink 
            to="/popular-foods" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Popular Foods
          </NavLink>
          <NavLink 
            to="/idol-meals" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Idol Meals
          </NavLink>
          {isAuthenticated && (
            <NavLink 
              to="/wishlist" 
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink 
              to="/my-orders" 
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </NavLink>
          )}
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>

          <div className="navbar-auth">
{isAuthenticated ? (
              <>
                <span className="navbar-user-name">Hi, {user?.name} ({user?.role})</span>
                {user?.role === 'admin' && (
                  <NavLink 
                    to="/admin" 
                    className="btn btn-admin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                )}
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
