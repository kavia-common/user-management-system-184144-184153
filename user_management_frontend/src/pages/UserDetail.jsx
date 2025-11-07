import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

/**
 * PUBLIC_INTERFACE
 * User detail page with demo content and actions.
 */
export default function UserDetail() {
  const { id } = useParams();
  const toast = useToast();

  const demoUser = {
    id,
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'Editor',
    bio: 'This is a demo user record. Real data will be loaded from API later.'
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(demoUser.email);
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
      <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
        <p><strong>ID:</strong> {demoUser.id}</p>
        <p><strong>Name:</strong> {demoUser.name}</p>
        <p><strong>Email:</strong> {demoUser.email} <Button variant="ghost" size="sm" onClick={copyEmail} ariaLabel="Copy email">Copy</Button></p>
        <p><strong>Role:</strong> {demoUser.role}</p>
        <p><strong>Bio:</strong> {demoUser.bio}</p>
      </div>
    </section>
  );
}
