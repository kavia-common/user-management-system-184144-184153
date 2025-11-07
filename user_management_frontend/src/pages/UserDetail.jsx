import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import useUsers from '../hooks/useUsers';

/**
 * PUBLIC_INTERFACE
 * User detail page, data from global users state.
 */
export default function UserDetail() {
  const { id } = useParams();
  const toast = useToast();
  const { byId, getById, loading, error } = useUsers();

  const user = byId[id];
  const safeUser = useMemo(() => user || { id, name: '', email: '', role: '', bio: '' }, [user, id]);

  useEffect(() => {
    if (!user) getById(id);
  }, [user, id, getById]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(safeUser.email || '');
      toast.show({ title: 'Copied', description: 'Email address copied to clipboard', variant: 'success' });
    } catch {
      toast.show({ title: 'Copy failed', description: 'Unable to copy email', variant: 'error' });
    }
  };

  return (
    <section aria-labelledby="user-detail-title">
      <div className="page-header">
        <h1 id="user-detail-title">User Detail</h1>
        <Link className="ui-btn ui-btn--primary ui-btn--md" to={`/users/${id}/edit`} aria-label="Edit user">Edit</Link>
      </div>
      {loading.detail && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12, color: 'rgba(17,24,39,0.7)' }}>
          Loading user…
        </div>
      )}
      {error.detail && (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--color-error)' }}>
          {error.detail}
        </div>
      )}
      <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
        <p><strong>ID:</strong> {safeUser.id}</p>
        <p><strong>Name:</strong> {safeUser.name || '—'}</p>
        <p><strong>Email:</strong> {safeUser.email || '—'} <Button variant="ghost" size="sm" onClick={copyEmail} ariaLabel="Copy email">Copy</Button></p>
        <p><strong>Role:</strong> {safeUser.role || '—'}</p>
        <p><strong>Bio:</strong> {safeUser.bio || '—'}</p>
      </div>
    </section>
  );
}
