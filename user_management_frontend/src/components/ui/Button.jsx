import React from 'react';
import '../../theme.css';

/**
 * PUBLIC_INTERFACE
 * Button component with Ocean Professional styling and accessible states.
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * - size: 'sm' | 'md' | 'lg'
 * - onClick: function
 * - type: 'button' | 'submit' | 'reset'
 * - disabled: boolean
 * - children: node
 * - ariaLabel: string (optional accessible label)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  children,
  ariaLabel,
  className = '',
  ...rest
}) {
  const base = 'ui-btn';
  const v = `ui-btn--${variant}`;
  const s = `ui-btn--${size}`;
  const disabledClass = disabled ? 'is-disabled' : '';
  return (
    <button
      type={type}
      className={[base, v, s, disabledClass, className].join(' ').trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
}
