import React, { useState } from 'react';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import '../components/ui/ui.css';
import useUsers from '../hooks/useUsers';

/**
 * PUBLIC_INTERFACE
 * Create user page with accessible form fields using global users state via useUsers.
 * Shows loading and error messages with proper ARIA roles.
 */
export default function UserNew() {
  const toast = useToast();
  const { create, loading, error } = useUsers();
  const [values, setValues] = useState({ name: '', email: '', role: 'viewer', bio: '' });
  const [errors, setErrors] = useState({});

  const setValue = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Name is required.';
    if (!values.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Email is not valid.';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    const result = await create(values);
    if (result) {
      setValues({ name: '', email: '', role: 'viewer', bio: '' });
    } else if (error.create) {
      toast.show({ title: 'Create failed', description: error.create, variant: 'error' });
    }
  };

  return (
    <section aria-labelledby="new-user-title">
      <h1 id="new-user-title">Create User</h1>
      {loading.create && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12, color: 'rgba(17,24,39,0.7)' }}>
          Creating user…
        </div>
      )}
      {error.create && (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--color-error)' }}>
          {error.create}
        </div>
      )}
      <form className="ui-form" onSubmit={onSubmit} noValidate>
        <FormField
          id="name"
          label="Full name"
          required
          value={values.name}
          onChange={setValue('name')}
          hint="Enter the user's full name."
          error={errors.name}
        />
        <FormField
          id="email"
          label="Email address"
          type="email"
          required
          value={values.email}
          onChange={setValue('email')}
          hint="We will use this for login."
          error={errors.email}
        />
        <FormField
          id="role"
          label="Role"
          type="select"
          value={values.role}
          onChange={setValue('role')}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' }
          ]}
          hint="Assign the appropriate access level."
        />
        <FormField
          id="bio"
          label="Bio"
          type="textarea"
          value={values.bio}
          onChange={setValue('bio')}
          hint="Optional short description."
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" variant="primary" disabled={loading.create}>Create</Button>
          <Button type="reset" variant="ghost" onClick={() => setValues({ name: '', email: '', role: 'viewer', bio: '' })}>Reset</Button>
        </div>
      </form>
    </section>
  );
}
