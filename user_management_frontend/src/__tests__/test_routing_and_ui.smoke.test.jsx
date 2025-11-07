import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import App from '../App';
import Dashboard from '../pages/Dashboard';
import UsersList from '../pages/UsersList';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';
import { ToastProvider, useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { AppProvider } from '../state/store';

// Helper to render with providers commonly used in the app
function renderWithProviders(ui) {
  return render(
    <ToastProvider>
      <AppProvider>
        {ui}
      </AppProvider>
    </ToastProvider>
  );
}

describe('Navbar and basic routing smoke tests', () => {
  function makeRouter(initialEntries = ['/']) {
    // Build routes similar to index.js but minimal to exercise links and 404
    return createMemoryRouter([
      {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'users', element: <UsersList /> },
          { path: '*', element: <NotFound /> }
        ]
      }
    ], { initialEntries });
  }

  test('Navbar renders with Dashboard and Users links', () => {
    const router = makeRouter(['/']);
    renderWithProviders(<RouterProvider router={router} />);

    // Header role="banner" is set in Navbar
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();

    // Dashboard heading should be present for index route
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  test('navigates to Users route when clicking Users link', () => {
    const router = makeRouter(['/']);
    renderWithProviders(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('link', { name: /users/i }));

    // Users page title present
    expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();

    // New User link from UsersList page present
    expect(screen.getByRole('link', { name: /create a new user/i })).toBeInTheDocument();
  });

  test('renders NotFound for unknown routes', () => {
    const router = makeRouter(['/this/does/not/exist']);
    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    // Provide a way back to dashboard
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toBeInTheDocument();
  });
});

describe('Modal basic interactions', () => {
  function ModalHarness() {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)} aria-label="Open modal">Open Modal</button>
        <Modal
          open={open}
          title="Test Modal"
          onClose={() => setOpen(false)}
          footer={(
            <>
              <button onClick={() => setOpen(false)}>Close</button>
            </>
          )}
        >
          <p>Modal body</p>
        </Modal>
      </div>
    );
  }

  test('opens and closes modal via close button', () => {
    renderWithProviders(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));
    // Modal title should be visible
    expect(screen.getByRole('heading', { name: /test modal/i })).toBeInTheDocument();
    // Body content present
    expect(screen.getByText(/modal body/i)).toBeInTheDocument();

    // Close using header close button (aria-label "Close dialog")
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    // Modal should be removed from DOM
    expect(screen.queryByRole('heading', { name: /test modal/i })).not.toBeInTheDocument();
  });

  test('closes modal by clicking backdrop', () => {
    renderWithProviders(<ModalHarness />);
    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));
    expect(screen.getByRole('heading', { name: /test modal/i })).toBeInTheDocument();

    // The backdrop has role="presentation" and data-backdrop="true"
    // Query using attribute selector from the rendered container
    const backdrop = document.querySelector('.ui-modal-backdrop[data-backdrop="true"]');
    expect(backdrop).toBeTruthy();

    // Mouse down on backdrop triggers onClose
    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole('heading', { name: /test modal/i })).not.toBeInTheDocument();
  });
});

describe('ToastProvider basic interactions', () => {
  function ToastHarness() {
    const toast = useToast();
    return (
      <div>
        <button onClick={() => toast.show({ title: 'Saved', description: 'User created', variant: 'success', duration: 0 })}>
          Show Toast
        </button>
      </div>
    );
  }

  function renderToastHarness() {
    return render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );
  }

  test('shows toast on demand and can dismiss manually', () => {
    renderToastHarness();

    fireEvent.click(screen.getByRole('button', { name: /show toast/i }));

    // Toast container is a region labeled "Notifications"
    expect(screen.getByRole('region', { name: /notifications/i })).toBeInTheDocument();

    // Toast content appears
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
    expect(screen.getByText(/user created/i)).toBeInTheDocument();

    // Click the dismiss button (ariaLabel "Dismiss notification")
    const dismissBtn = screen.getByRole('button', { name: /dismiss notification/i });
    fireEvent.click(dismissBtn);

    // Toast should be removed
    expect(screen.queryByText(/saved/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/user created/i)).not.toBeInTheDocument();
  });
});

describe('Navbar component isolated render', () => {
  test('Navbar alone renders correct structure', () => {
    render(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    // Primary navigation region exists
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });
});
