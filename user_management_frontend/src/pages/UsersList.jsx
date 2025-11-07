import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Users list page placeholder.
 */
export default function UsersList() {
  return (
    <section aria-labelledby="users-title">
      <div className="page-header">
        <h1 id="users-title">Users</h1>
        <Link className="btn-primary" to="/users/new" aria-label="Create a new user">+ New User</Link>
      </div>
      <p>This is where a list of users will appear.</p>
    </section>
  );
}
