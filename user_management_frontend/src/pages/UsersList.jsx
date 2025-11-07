import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import AlertBanner from '../components/ui/AlertBanner';
import '../components/ui/ui.css';
import useUsers from '../hooks/useUsers';
import { getFeatureFlag } from '../utils/config';

/**
 * PUBLIC_INTERFACE
 * Users list page showing a table of users with action buttons.
 * Adds client-side search (name/email), sortable headers (name, createdAt), and pagination (10/page).
 * Uses global state via useUsers hook with loading and error feedback.
 */
export default function UsersList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Controls: search, sort, pagination
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'createdAt'
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { users, list, remove, loading, error } = useUsers();
  const titleRef = React.useRef(null);
  const newBtnRef = React.useRef(null);

  // Feature flag: enable bulk actions from REACT_APP_FEATURE_FLAGS (default false)
  const enableBulkActions = Boolean(getFeatureFlag('enableBulkActions', false));
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Load users on mount (will use backend if configured or fallback demo)
    list();
  }, [list]);

  // When search or sort changes, reset to first page for better UX.
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortDir]);

  // Derived data: apply search filtering, sorting, then pagination
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = String(u.name || '').toLowerCase();
      const email = String(u.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      if (sortBy === 'createdAt') {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (da - db) * dir;
      }
      // default name sort (case-insensitive)
      const na = String(a.name || '').toLowerCase();
      const nb = String(b.name || '').toLowerCase();
      if (na < nb) return -1 * dir;
      if (na > nb) return 1 * dir;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  // Table columns with accessible sortable headers for Name and Created
  const columns = [
    ...(enableBulkActions
      ? [{
          key: '__sel__',
          header: (
            <input
              type="checkbox"
              aria-label="Select all users on this page"
              checked={selectedIds.length > 0 && paged.every(u => selectedIds.includes(u.id))}
              onChange={(e) => {
                if (e.target.checked) {
                  const ids = Array.from(new Set([...selectedIds, ...paged.map(u => u.id)]));
                  setSelectedIds(ids);
                } else {
                  const ids = selectedIds.filter(id => !paged.some(u => u.id === id));
                  setSelectedIds(ids);
                }
              }}
            />
          ),
          render: (row) => (
            <input
              type="checkbox"
              aria-label={`Select ${row.name}`}
              checked={selectedIds.includes(row.id)}
              onChange={(e) => {
                setSelectedIds((prev) => {
                  if (e.target.checked) return Array.from(new Set([...prev, row.id]));
                  return prev.filter((id) => id !== row.id);
                });
              }}
            />
          )
        }]
      : []),
    {
      key: 'name',
      header: (
        <button
          type="button"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          onClick={() => {
            if (sortBy === 'name') setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            else {
              setSortBy('name');
              setSortDir('asc');
            }
          }}
          aria-label={`Sort by name, current ${sortBy === 'name' ? sortDir : 'none'}`}
          aria-sort={sortBy === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
          style={{ padding: 6 }}
        >
          Name {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
        </button>
      ),
      render: (row) => row.name
    },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'role', header: 'Role', render: (row) => row.role || '—' },
    {
      key: 'createdAt',
      header: (
        <button
          type="button"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          onClick={() => {
            if (sortBy === 'createdAt') setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            else {
              setSortBy('createdAt');
              setSortDir('desc');
            }
          }}
          aria-label={`Sort by created date, current ${sortBy === 'createdAt' ? sortDir : 'none'}`}
          aria-sort={sortBy === 'createdAt' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
          style={{ padding: 6 }}
        >
          Created {sortBy === 'createdAt' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
        </button>
      ),
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—')
    }
  ];

  const actions = (row) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="ghost" size="sm" ariaLabel={`View ${row.name}`} onClick={() => navigate(`/users/${row.id}`)}>
        View
      </Button>
      <Button variant="ghost" size="sm" ariaLabel={`Edit ${row.name}`} onClick={() => navigate(`/users/${row.id}/edit`)}>
        Edit
      </Button>
      <Button
        variant="danger"
        size="sm"
        ariaLabel={`Delete ${row.name}`}
        onClick={() => {
          setSelectedUser(row);
          setConfirmOpen(true);
        }}
      >
        Delete
      </Button>
    </div>
  );

  const onConfirmDelete = async () => {
    setConfirmOpen(false);
    if (selectedUser) {
      // Bulk delete if synthetic multiple selection was set
      if (enableBulkActions && selectedUser.id.includes(',')) {
        const ids = selectedIds.slice();
        for (const id of ids) {
          await remove(id);
        }
        setSelectedIds([]);
      } else {
        await remove(selectedUser.id);
      }
      setSelectedUser(null);
      // If delete empties the page, go to previous page if possible
      setPage((p) => Math.max(1, Math.min(p, Math.ceil((total - 1) / pageSize) || 1)));
      // Manage focus after mutation for better accessibility
      setTimeout(() => {
        if (newBtnRef.current) {
          newBtnRef.current.focus();
        } else if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 0);
    }
  };

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const onFirst = () => setPage(1);
  const onLast = () => setPage(totalPages);

  return (
    <section aria-labelledby="users-title">
      <div className="page-header">
        <h1 id="users-title" tabIndex={-1} ref={titleRef}>Users</h1>
        <Link
          ref={newBtnRef}
          className="ui-btn ui-btn--primary ui-btn--md"
          to="/users/new"
          aria-label="Create a new user"
        >
          + New User
        </Link>
      </div>

      {/* Controls row: search + results info */}
      <div
        className="controls"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 280px', minWidth: 240 }}>
          <label className="ui-label" htmlFor="user-search">Search</label>
          <input
            id="user-search"
            type="search"
            className="ui-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users by name or email"
          />
        </div>
        <div aria-live="polite" style={{ color: 'rgba(17,24,39,0.7)' }}>
          {total} result{total !== 1 ? 's' : ''}{search ? ' (filtered)' : ''}
        </div>
      </div>

      {loading.list && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12, color: 'rgba(17,24,39,0.7)' }}>
          Loading users…
        </div>
      )}
      {error.list && (
        <AlertBanner
          variant="error"
          title="Failed to load users"
          description={error.list}
        />
      )}

      {/* Bulk actions toolbar */}
      {enableBulkActions && selectedIds.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            background: 'var(--color-surface)',
            borderRadius: '10px',
            padding: '10px 12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ color: 'rgba(17,24,39,0.8)' }}>
            {selectedIds.length} selected
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setConfirmOpen(true);
              // For bulk delete we set a synthetic selectedUser to indicate multiple
              setSelectedUser({ id: selectedIds.join(','), name: `${selectedIds.length} users` });
            }}
            ariaLabel="Delete selected users"
          >
            Delete selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds([])}
            ariaLabel="Clear selection"
          >
            Clear
          </Button>
        </div>
      )}

      {sorted.length === 0 && !loading.list ? (
        <div className="ui-empty" role="region" aria-label="Empty users">
          <div className="ui-empty__icon" aria-hidden="true">👥</div>
          <h2 className="ui-empty__title">No users found</h2>
          <p className="ui-empty__desc">
            {search
              ? 'No users match your search. Try adjusting the filters.'
              : 'Get started by creating your first user.'}
          </p>
          <Link
            className="ui-btn ui-btn--primary ui-btn--md"
            to="/users/new"
            aria-label="Create your first user"
          >
            + Create user
          </Link>
        </div>
      ) : (
        <Table
          caption="Manage application users"
          columns={columns}
          data={paged}
          rowKey="id"
          actions={actions}
        />
      )}

      {/* Pagination controls */}
      <nav
        aria-label="Pagination"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ color: 'rgba(17,24,39,0.7)' }}>
          Page {currentPage} of {totalPages}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="ghost" size="sm" onClick={onFirst} disabled={currentPage <= 1} aria-label="First page">
            «
          </Button>
          <Button variant="ghost" size="sm" onClick={onPrev} disabled={currentPage <= 1} aria-label="Previous page">
            ‹
          </Button>
          <Button variant="ghost" size="sm" onClick={onNext} disabled={currentPage >= totalPages} aria-label="Next page">
            ›
          </Button>
          <Button variant="ghost" size="sm" onClick={onLast} disabled={currentPage >= totalPages} aria-label="Last page">
            »
          </Button>
        </div>
      </nav>

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
        <p>
          {enableBulkActions && selectedUser?.id?.includes(',')
            ? <>Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.</>
            : <>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</>}
        </p>
        {error.remove && (
          <AlertBanner
            variant="error"
            title="Delete failed"
            description={error.remove}
          />
        )}
      </Modal>
    </section>
  );
}
