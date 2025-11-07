import React from 'react';
import './theme.css';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * App is the global layout shell containing the Navbar, Sidebar, and routed page Outlet.
 */
function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="content" id="main-content" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
