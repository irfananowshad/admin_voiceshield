'use client';

import React, { useState } from 'react';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import { AdminProfileMenu } from '../common/AdminProfileMenu';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="admin-header">
      {/* Left side: Mobile hamburger & Engine Active indicator */}
      <div className="header-left">
        {onOpenMobileMenu && (
          <button
            className="header-hamburger-btn"
            onClick={onOpenMobileMenu}
            aria-label="Open sidebar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <div className="engine-active-pill" title="Inference engine active on port 8000 / neural edge v4.18">
          <span className="engine-active-dot" />
          <span className="engine-active-text">Engine Active</span>
        </div>
      </div>

      {/* Right side: Global Search, Notification, Profile Avatar */}
      <div className="header-right">
        {/* Global Search Button / Trigger */}
        <div
          className="header-search-bar"
          onClick={onOpenSearch}
          role="button"
          tabIndex={0}
        >
          <svg className="header-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="header-search-placeholder">Search spectrograms, cases...</span>
          <span className="header-search-shortcut">⌘K</span>
        </div>

        {/* Notifications Icon Button */}
        <div className="header-action-wrapper">
          <button
            className={`header-icon-btn ${isNotificationsOpen ? 'header-icon-btn-active' : ''}`}
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileMenuOpen(false);
            }}
            aria-label="View notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="header-unread-dot" />
          </button>

          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* User Profile Avatar Button */}
        <div className="header-action-wrapper">
          <button
            className="header-avatar-btn"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsOpen(false);
            }}
            aria-label="Open admin profile"
          >
            <div className="header-avatar-circle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>

          <AdminProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

