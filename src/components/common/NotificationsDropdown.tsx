import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_NOTIFICATIONS } from '@/lib/data/sampleData';
import { NotificationItem } from '@/lib/types/admin';
import Link from 'next/link';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <div className="notifications-header">
        <div className="notifications-title-row">
          <span className="notifications-title">Notifications</span>
          {unreadCount > 0 && <span className="notifications-count-badge">{unreadCount} new</span>}
        </div>
        {unreadCount > 0 && (
          <button className="notifications-mark-all" onClick={markAllAsRead}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="notifications-empty">No notifications right now</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${!n.read ? 'notification-unread' : ''}`}
            >
              <div className={`notification-icon-pill notif-type-${n.type}`}>
                {n.type === 'alert' && '⚠️'}
                {n.type === 'warning' && '⚡'}
                {n.type === 'info' && 'ℹ️'}
                {n.type === 'success' && '✓'}
              </div>
              <div className="notification-body">
                <div className="notification-title-line">
                  <span className="notification-item-title">{n.title}</span>
                  <span className="notification-time">{n.timestamp}</span>
                </div>
                <p className="notification-item-text">{n.message}</p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="notification-link"
                    onClick={onClose}
                  >
                    View incident details →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notifications-footer">
        <span className="notifications-footer-note">Telemetry synced with production v4.18 edge</span>
      </div>
    </div>
  );
};

