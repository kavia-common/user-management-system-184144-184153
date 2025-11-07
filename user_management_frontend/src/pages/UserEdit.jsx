import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

/**
 * PUBLIC_INTERFACE
 * Edit user page with accessible form fields.
 * Note: Data loading and persistence will be integrated later; pre-fills with demo data.
 */
export default function UserEdit() {
  const { id } = useParams();
  const toast = useToast();

  // Demo prefill data
  const initial = useMemo(() => ({
    id,
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'editor',
    bio: 'This is a demo user used for editing preview.'
  }), [id]);

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const setValue = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Name is required.';
    if (!values.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Email is not valid.';
    return e;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    toast.show({ title: 'User updated', description: `${values.name} has been saved (demo)`, variant: 'success' });
  };

  return (
    <section aria-labelledby="user-edit-title">
      <h1 id="user-edit-title">Edit User</h1>
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
          <Button type="submit" variant="primary">Save changes</Button>
          <Button type="button" variant="ghost" onClick={() => setValues(initial)}>Revert</Button>
        </div>
      </form>
    </section>
  );
}
