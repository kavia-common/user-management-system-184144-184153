import React from 'react';
import './ui.css';

/**
 * PUBLIC_INTERFACE
 * AlertBanner shows consistent dismissible banners for errors/info/success.
 * Props:
 * - variant: 'error' | 'info' | 'success' | 'warning'
 * - title: string
 * - description: string | node
 * - onClose: function (optional, renders a close button if provided)
 * - role: string (optional override, defaults to 'alert' for error, 'status' otherwise)
 * - ariaLabel: string (optional aria-label for the banner region)
 */
export default function AlertBanner({
  variant = 'info',
  title,
  description,
  onClose,
  role,
  ariaLabel
}) {
  const computedRole = role || (variant === 'error' ? 'alert' : 'status');
  const label = ariaLabel || (variant === 'error' ? 'Error' : 'Notice');

  return (
    <div
      className={`ui-alert ui-alert--${variant}`}
      role={computedRole}
      aria-label={label}
    >
      <div className="ui-alert__content">
        {title && <p className="ui-alert__title">{title}</p>}
        {description && <div className="ui-alert__desc">{description}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="ui-alert__close"
          aria-label="Dismiss"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
}
