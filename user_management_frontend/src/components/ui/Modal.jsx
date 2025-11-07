import React, { useEffect, useRef } from 'react';
import './ui.css';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Modal dialog with accessibility:
 * - role="dialog" and aria-modal
 * - focus trap within modal
 * - Esc key closes
 * - overlay click closes
 * Props:
 * - open: boolean
 * - title: string | node
 * - onClose: function
 * - children: node
 * - footer: node (optional)
 */
export default function Modal({ open, title, onClose, children, footer }) {
  const firstFocusableRef = useRef(null);
  const modalRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length) {
      firstFocusableRef.current = focusable[0];
      lastFocusableRef.current = focusable[focusable.length - 1];
      firstFocusableRef.current.focus();
    } else {
      modalRef.current?.focus();
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      } else if (e.key === 'Tab') {
        // Focus trap
        const focusables = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const onBackdropClick = (e) => {
    if (e.target.getAttribute('data-backdrop') === 'true') {
      onClose?.();
    }
  };

  return (
    <div className="ui-modal-backdrop" data-backdrop="true" onMouseDown={onBackdropClick}>
      <div
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="ui-modal__header">
          <h2 id="modal-title" className="ui-modal__title">{title}</h2>
          <Button variant="ghost" ariaLabel="Close dialog" onClick={onClose}>✕</Button>
        </div>
        <div className="ui-modal__body">{children}</div>
        {footer ? <div className="ui-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
