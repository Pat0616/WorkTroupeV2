import { useState } from 'react';
import Layout from '../components/Layout';

import './notifications.css';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'task_assigned',
    message: 'You were assigned to "Landing Page Redesign".',
    created_at: '2 minutes ago',
    is_read: false,
  },
  {
    id: 2,
    type: 'task_due_soon',
    message: 'Project proposal deadline is approaching.',
    created_at: '1 hour ago',
    is_read: false,
  },
  {
    id: 3,
    type: 'task_overdue',
    message: 'Mobile UI Review task is overdue.',
    created_at: 'Yesterday',
    is_read: true,
  },
  {
    id: 4,
    type: 'general',
    message: 'Welcome to the new Work Troupe experience.',
    created_at: '2 days ago',
    is_read: true,
  },
];

const TYPE_CONFIG: Record<
  string,
  {
    emoji: string;
    color: string;
    glow: string;
  }
> = {
  task_assigned: {
    emoji: '📌',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.25)',
  },

  task_due_soon: {
    emoji: '⏰',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
  },

  task_overdue: {
    emoji: '🚨',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.25)',
  },

  general: {
    emoji: '✨',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({
        ...notif,
        is_read: true,
      }))
    );
  };

  return (
    <Layout>

      <div className="notifications-page">

        {/* HEADER */}
        <div className="notifications-header">

          <div>

            <div className="notifications-badge">
              ✦ Notification Center
            </div>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with your latest
              tasks, reminders, and activities.
            </p>

          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllRead}
            >
              Mark all as read
            </button>
          )}

        </div>

        {/* STATS */}
        <div className="notifications-stats">

          <div className="stat-card">

            <span>
              🔔
            </span>

            <div>

              <h3>
                {notifications.length}
              </h3>

              <p>Total Notifications</p>

            </div>

          </div>

          <div className="stat-card unread">

            <span>
              ✨
            </span>

            <div>

              <h3>
                {unreadCount}
              </h3>

              <p>Unread Messages</p>

            </div>

          </div>

        </div>

        {/* EMPTY */}
        {notifications.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              🔕
            </div>

            <h2>
              You're all caught up
            </h2>

            <p>
              No new notifications right now.
            </p>

          </div>
        ) : (

          <div className="notifications-list">

            {notifications.map((notif) => {
              const cfg =
                TYPE_CONFIG[notif.type];

              return (
                <div
                  key={notif.id}
                  className={`notification-card ${
                    !notif.is_read
                      ? 'unread'
                      : ''
                  }`}
                  onClick={() =>
                    !notif.is_read &&
                    markRead(notif.id)
                  }
                >

                  {/* ICON */}
                  <div
                    className="notification-icon"
                    style={{
                      background: cfg.glow,
                      borderColor: cfg.color,
                    }}
                  >
                    {cfg.emoji}
                  </div>

                  {/* CONTENT */}
                  <div className="notification-content">

                    <div className="notification-top">

                      <h3>
                        {notif.message}
                      </h3>

                      {!notif.is_read && (
                        <div className="unread-dot"></div>
                      )}

                    </div>

                    <p>
                      {notif.created_at}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </Layout>
  );
}