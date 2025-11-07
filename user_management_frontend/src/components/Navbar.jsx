import React from 'react';
import { NavLink } from 'react-router-dom';
import '../theme.css';
import './navbar.css';

/**
 * PUBLIC_INTERFACE
 * Navbar provides the top application navigation with branding and primary links.
 * It is responsive and includes accessible aria attributes.
 */
function Navbar() {
  return (
    <header className="navbar" role="banner">
      <nav className="navbar-inner" aria-label="Primary">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">🌀</span>
          <span className="brand-name">User Manager</span>
        </div>
        <ul className="nav-links" role="menubar">
          <li role="none">
            <NavLink
              to="/"
              end
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              aria-label="Go to Dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/users"
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              aria-label="Go to Users"
            >
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
