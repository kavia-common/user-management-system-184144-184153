import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import UserNew from './pages/UserNew';
import UserDetail from './pages/UserDetail';
import UserEdit from './pages/UserEdit';
import NotFound from './pages/NotFound';
import { ToastProvider } from './components/ui/Toast';

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <UsersList /> },
      { path: 'users/new', element: <UserNew /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'users/:id/edit', element: <UserEdit /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);
