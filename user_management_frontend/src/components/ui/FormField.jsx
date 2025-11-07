import React from 'react';
import './ui.css';

/**
 * PUBLIC_INTERFACE
 * FormField renders a labeled input/select/textarea with hint and error text.
 * Props:
 * - id: string (required)
 * - label: string | node
 * - type: 'text' | 'email' | 'password' | 'textarea' | 'select'
 * - options: array<{value, label}> for select
 * - required: boolean
 * - value: string
 * - onChange: function
 * - placeholder: string
 * - hint: string
 * - error: string
 * - inputProps: object (spread to input)
 */
export default function FormField({
  id,
  label,
  type = 'text',
  options = [],
  required = false,
  value,
  onChange,
  placeholder,
  hint,
  error,
  inputProps = {}
}) {
  const describedByIds = [];
  if (hint) describedByIds.push(`${id}-hint`);
  if (error) describedByIds.push(`${id}-error`);

  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    'aria-describedby': describedByIds.join(' ') || undefined,
    'aria-invalid': !!error || undefined,
    className: type === 'textarea' ? 'ui-textarea' : type === 'select' ? 'ui-select' : 'ui-input',
    ...inputProps
  };

  return (
    <div className="ui-field">
      {label && (
        <label className="ui-label" htmlFor={id}>
          {label} {required && <span aria-hidden="true" style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea {...commonProps} rows={inputProps.rows || 4} />
      ) : type === 'select' ? (
        <select {...commonProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input type={type} {...commonProps} />
      )}
      {hint && <div id={`${id}-hint`} className="ui-hint">{hint}</div>}
      {error && <div id={`${id}-error`} className="ui-error" role="alert">{error}</div>}
    </div>
  );
}
