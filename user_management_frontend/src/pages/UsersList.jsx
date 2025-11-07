import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import '../components/ui/ui.css';

/**
 * PUBLIC_INTERFACE
 * Users list page showing a table of users with action buttons.
 * Note: Data fetching will be wired later; uses static sample data for now.
 */
export default function UsersList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = useMemo(
    () => [
      { id: 'u_1001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
      { id: 'u_1002', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
      { id: 'u_1003', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer' }
    ],
    []
  );

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

  const onConfirmDelete = () => {
    setConfirmOpen(false);
    toast.show({ title: 'Deleted', description: `User ${selectedUser?.name} deleted (demo)`, variant: 'success' });
    setSelectedUser(null);
  };

  return (
    <section aria-labelledby="users-title">
      <div className="page-header">
        <h1 id="users-title">Users</h1>
        <Link className="ui-btn ui-btn--primary ui-btn--md" to="/users/new" aria-label="Create a new user">+ New User</Link>
      </div>

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
            <Button variant="danger" onClick={onConfirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
      </Modal>
    </section>
  );
}
