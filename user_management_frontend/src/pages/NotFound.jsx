import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * 404 Not Found page.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="btn-primary" to="/" aria-label="Go to Dashboard">Go to Dashboard</Link>
    </section>
  );
}
