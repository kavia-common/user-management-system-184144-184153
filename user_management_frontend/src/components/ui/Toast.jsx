import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import './ui.css';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * ToastProvider provides a lightweight toast notification system.
 * Usage:
 *  <ToastProvider><App/></ToastProvider>
 *  const toast = useToast();
 *  toast.show({ title: 'Saved', description: 'User created', variant: 'success' });
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const hide = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(({ title, description, variant = 'success', duration = 3000 }) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, title, description, variant };
    setToasts((t) => [toast, ...t]);
    if (duration > 0) {
      setTimeout(() => hide(id), duration);
    }
    return id;
  }, [hide]);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ui-toast-container" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`ui-toast ui-toast--${t.variant}`} role="status" aria-live="polite">
            <div>
              {t.title && <p className="ui-toast__title">{t.title}</p>}
              {t.description && <p className="ui-toast__desc">{t.description}</p>}
            </div>
            <Button variant="ghost" size="sm" className="ui-toast__close" ariaLabel="Dismiss notification" onClick={() => hide(t.id)}>✕</Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Returns { show({title, description, variant, duration}), hide(id) } */
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
