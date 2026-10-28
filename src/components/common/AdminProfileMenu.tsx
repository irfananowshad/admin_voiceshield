import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface AdminProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileMenu: React.FC<AdminProfileMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="profile-menu-dropdown" ref={menuRef}>
      <div className="profile-menu-header">
        <div className="profile-menu-avatar">A</div>
        <div className="profile-menu-info">
          <p className="profile-menu-name">Admin</p>
          <p className="profile-menu-role">System Administrator</p>
          <span className="profile-menu-email">admin@voiceshield.ai</span>
        </div>
      </div>

      <div className="profile-menu-divider" />

      <div className="profile-menu-meta">
        <div className="profile-meta-row">
          <span className="profile-meta-label">Access Level:</span>
          <span className="profile-meta-value">Super Admin (All Nodes)</span>
        </div>
        <div className="profile-meta-row">
          <span className="profile-meta-label">Session ID:</span>
          <span className="profile-meta-value">vs-sec-80de85</span>
        </div>
        <div className="profile-meta-row">
          <span className="profile-meta-label">Environment:</span>
          <span className="profile-meta-value">Inference Edge v4.18</span>
        </div>
      </div>

      <div className="profile-menu-divider" />

      <div className="profile-menu-actions">
        <Link href="/settings" className="profile-action-item" onClick={onClose}>
          <span className="profile-action-icon">⚙️</span>
          <span>Security & API Settings</span>
        </Link>
        <Link href="/users" className="profile-action-item" onClick={onClose}>
          <span className="profile-action-icon">👥</span>
          <span>Manage Team & Roles</span>
        </Link>
        <Link href="/model-health" className="profile-action-item" onClick={onClose}>
          <span className="profile-action-icon">📊</span>
          <span>Telemetry & Model Probes</span>
        </Link>
      </div>

      <div className="profile-menu-divider" />

      <button
        className="profile-menu-signout"
        onClick={() => {
          alert('Admin session maintained in demonstration mode.');
          onClose();
        }}
      >
        Sign Out (Demo Session)
      </button>
    </div>
  );
};

