import React from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * User detail page placeholder.
 */
export default function UserDetail() {
  const { id } = useParams();
  return (
    <section aria-labelledby="user-detail-title">
      <div className="page-header">
        <h1 id="user-detail-title">User Detail</h1>
        <Link className="btn-primary" to={`/users/${id}/edit`} aria-label="Edit user">Edit</Link>
      </div>
      <p>Details for user with ID: {id}</p>
    </section>
  );
}
