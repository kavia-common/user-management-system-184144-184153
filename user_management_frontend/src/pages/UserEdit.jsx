import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Edit user page placeholder.
 */
export default function UserEdit() {
  const { id } = useParams();
  return (
    <section aria-labelledby="user-edit-title">
      <h1 id="user-edit-title">Edit User</h1>
      <p>Editing user with ID: {id}</p>
    </section>
  );
}
