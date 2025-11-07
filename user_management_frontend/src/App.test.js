import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';

// Keep a minimal sanity test; detailed smoke tests live under src/__tests__
test('App shell renders Navbar', () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <App />,
      children: [{ index: true, element: <Dashboard /> }]
    }
  ]);
  render(<RouterProvider router={router} />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});
