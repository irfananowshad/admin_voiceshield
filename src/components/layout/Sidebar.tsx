'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProfileMenu } from '../common/AdminProfileMenu';

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Exact 4 navigation items specified: Overview, Dashboard, History, Settings
  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      href: '/overview',
      matches: ['/', '/overview', '/research-analytics'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      matches: ['/dashboard'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      )
    },
    {
      id: 'history',
      name: 'History',
      href: '/history',
      matches: ['/history'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '/settings',
      matches: ['/settings'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  const isItemActive = (matches: string[]) => {
    return matches.includes(pathname);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`admin-sidebar ${isOpenOnMobile ? 'sidebar-open-mobile' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 6V11.5C3 17 6.8 21.8 12 23C17.2 21.8 21 17 21 11.5V6L12 2Z"
                  fill="#6355F6"
                />
                <path
                  d="M12 5L5.5 8V12C5.5 16 8.3 19.6 12 20.6C15.7 19.6 18.5 16 18.5 12V8L12 5Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M12 7.5L8 9.5V12C8 14.5 9.7 16.8 12 17.5C14.3 16.8 16 14.5 16 12V9.5L12 7.5Z"
                  fill="#6355F6"
                />
              </svg>
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">VoiceShield</span>
              <span className="sidebar-brand-subtitle">AI Voice Scam Protection</span>
            </div>
          </div>
          {onCloseMobile && (
            <button className="sidebar-close-btn" onClick={onCloseMobile} aria-label="Close sidebar">
              ✕
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="sidebar-nav-container">
          <div className="sidebar-section-label">WORKSPACE</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const active = isItemActive(item.matches);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}
                  onClick={onCloseMobile}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile Box at Bottom */}
        <div className="sidebar-profile-wrapper">
          <div
            className="sidebar-profile"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-profile-avatar">A</div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">Admin</span>
              <span className="sidebar-profile-role">Administrator</span>
            </div>
            <div className="sidebar-profile-chevron">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <AdminProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </aside>
    </>
  );
};
