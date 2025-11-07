import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';

test('renders navbar links', () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <App />,
      children: [{ index: true, element: <Dashboard /> }]
    }
  ]);
  render(<RouterProvider router={router} />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
});
