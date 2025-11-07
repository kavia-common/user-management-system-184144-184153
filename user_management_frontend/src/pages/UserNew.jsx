import React, { useState } from 'react';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import '../components/ui/ui.css';

/**
 * PUBLIC_INTERFACE
 * Create user page with accessible form fields.
 * Note: Submission is local-only; API wiring will be added later.
 */
export default function UserNew() {
  const toast = useToast();
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

  const onSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    toast.show({ title: 'User created', description: `${values.name} has been created (demo)`, variant: 'success' });
    // Reset demo
    setValues({ name: '', email: '', role: 'viewer', bio: '' });
  };

  return (
    <section aria-labelledby="new-user-title">
      <h1 id="new-user-title">Create User</h1>
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
          <Button type="submit" variant="primary">Create</Button>
          <Button type="reset" variant="ghost" onClick={() => setValues({ name: '', email: '', role: 'viewer', bio: '' })}>Reset</Button>
        </div>
      </form>
    </section>
  );
}
