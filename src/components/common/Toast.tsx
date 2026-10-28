import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  return (
    <div className={`toast-container toast-${toast.type || 'success'}`}>
      <div className="toast-icon">
        {toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : '✓'}
      </div>
      <div className="toast-content">
        <p className="toast-title">{toast.title}</p>
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        ✕
      </button>
    </div>
  );
};

