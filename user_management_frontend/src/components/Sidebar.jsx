import React from 'react';
import { NavLink } from 'react-router-dom';
import '../theme.css';
import './sidebar.css';

/**
 * PUBLIC_INTERFACE
 * Sidebar provides secondary navigation/actions for admin controls.
 * On small screens it becomes a horizontal bar.
 */
function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Admin controls">
      <div className="sidebar-inner">
        <div className="sidebar-section" aria-label="User management">
          <h2 className="sidebar-title">Users</h2>
          <ul className="sidebar-list">
            <li>
              <NavLink to="/users" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
                All Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/users/new" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
                Create User
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
