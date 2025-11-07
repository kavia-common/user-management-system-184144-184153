import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import AlertBanner from '../components/ui/AlertBanner';
import useUsers from '../hooks/useUsers';

/**
 * PUBLIC_INTERFACE
 * Edit user page with accessible form fields, wired to global users state.
 */
export default function UserEdit() {
  const { id } = useParams();
  const toast = useToast();
  const { getById, update, byId, loading, error } = useUsers();

  const existing = byId[id];
  const titleRef = React.useRef(null);
  const initial = useMemo(() => existing || { id, name: '', email: '', role: 'viewer', bio: '' }, [existing, id]);

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!existing) {
      getById(id);
    } else {
      setValues(existing);
    }
  }, [existing, id, getById]);

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
    const result = await update(id, values);
    if (!result && error.update) {
      toast.show({ title: 'Update failed', description: error.update, variant: 'error' });
    } else if (result) {
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  };

  return (
    <section aria-labelledby="user-edit-title">
      <h1 id="user-edit-title" tabIndex={-1} ref={titleRef}>Edit User</h1>
      {loading.detail && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12, color: 'rgba(17,24,39,0.7)' }}>
          Loading user…
        </div>
      )}
      {error.detail && (
        <AlertBanner
          variant="error"
          title="Failed to load user"
          description={error.detail}
        />
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
          hint="Used for login."
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
        />
        <FormField
          id="bio"
          label="Bio"
          type="textarea"
          value={values.bio}
          onChange={setValue('bio')}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" variant="primary" disabled={loading.update}>Save changes</Button>
          <Button type="button" variant="ghost" onClick={() => setValues(initial)}>Revert</Button>
        </div>
        {error.update && (
          <AlertBanner
            variant="error"
            title="Failed to update user"
            description={error.update}
          />
        )}
      </form>
    </section>
  );
}
