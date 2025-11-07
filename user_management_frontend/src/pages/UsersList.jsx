import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import '../components/ui/ui.css';
import useUsers from '../hooks/useUsers';

/**
 * PUBLIC_INTERFACE
 * Users list page showing a table of users with action buttons.
 * Uses global state via useUsers hook with loading and error feedback.
 */
export default function UsersList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, list, remove, loading, error } = useUsers();

  useEffect(() => {
    // Load users on mount
    list();
  }, [list]);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ];

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="ghost" size="sm" ariaLabel={`View ${row.name}`} onClick={() => navigate(`/users/${row.id}`)}>
        View
      </Button>
      <Button variant="ghost" size="sm" ariaLabel={`Edit ${row.name}`} onClick={() => navigate(`/users/${row.id}/edit`)}>
        Edit
      </Button>
      <Button variant="danger" size="sm" ariaLabel={`Delete ${row.name}`} onClick={() => { setSelectedUser(row); setConfirmOpen(true); }}>
        Delete
      </Button>
    </div>
  );

  const onConfirmDelete = async () => {
    setConfirmOpen(false);
    if (selectedUser) {
      await remove(selectedUser.id);
      setSelectedUser(null);
    }
  };

  return (
    <section aria-labelledby="users-title">
      <div className="page-header">
        <h1 id="users-title">Users</h1>
        <Link className="ui-btn ui-btn--primary ui-btn--md" to="/users/new" aria-label="Create a new user">+ New User</Link>
      </div>

      {loading.list && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12, color: 'rgba(17,24,39,0.7)' }}>
          Loading users…
        </div>
      )}
      {error.list && (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--color-error)' }}>
          {error.list}
        </div>
      )}

      <Table
        caption="Manage application users"
        columns={columns}
        data={users}
        rowKey="id"
        actions={actions}
      />

      <Modal
        open={confirmOpen}
        title="Confirm deletion"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={onConfirmDelete} disabled={loading.remove}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
        {error.remove && <div role="alert" style={{ color: 'var(--color-error)', marginTop: 8 }}>{error.remove}</div>}
      </Modal>
    </section>
  );
}
