import {  useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type {ReactNode} from 'react';

import './Layout.css';

const NAV_ITEMS = [
  {
    to: '/home',
    label: 'Dashboard',
    emoji: '🏠',
  },
  {
    to: '/groups',
    label: 'Groups',
    emoji: '👥',
  },
  {
    to: '/notifications',
    label: 'Notifications',
    emoji: '🔔',
  },
];

type LayoutProps = {
  children: ReactNode;
};

function AvatarBubble({
  name,
  size = 42,
}: {
  name: string;
  size?: number;
}) {
  const colors = [
    '#8b5cf6',
    '#7c3aed',
    '#06b6d4',
    '#ec4899',
    '#3b82f6',
    '#f59e0b',
  ];

  const color =
    colors[
      (name?.charCodeAt(0) || 0) %
        colors.length
    ];

  return (
    <div
      className="avatar-bubble"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
      }}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Layout({
  children,
}: LayoutProps) {
  const navigate = useNavigate();

  const [mobileTab, setMobileTab] =
    useState('/');

  // TEMPORARY MOCK USER
  const user = {
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
  };

  // TEMPORARY MOCK SUBSCRIPTION
  const subscription = {
    plan_name: 'Premium',
    end_date: 'Dec 31, 2026',
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">

          <div className="logo-icon">
            ✦
          </div>

          <div>
            <h2>
              Work Troupe
            </h2>

            <p>
              Productivity Suite
            </p>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? 'active' : ''
                }`
              }
            >

              <span className="sidebar-link-icon">
                {item.emoji}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>
          ))}

        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">

          {/* SUBSCRIPTION */}
          <div className="subscription-card">

            <div className="subscription-top">

              <span>
                👑
              </span>

              <div>

                <h4>
                  {subscription.plan_name} Plan
                </h4>

                <p>
                  Active Subscription
                </p>

              </div>

            </div>

            <div className="subscription-expiry">
              Expires {subscription.end_date}
            </div>

          </div>

          {/* USER */}
          <div className="sidebar-user">

            <AvatarBubble
              name={user.name}
            />

            <div>

              <h4>
                {user.name}
              </h4>

              <p>
                {user.email}
              </p>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main-content">
        {children}
      </main>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">

        {NAV_ITEMS.map((item) => (

          <button
            key={item.to}
            className={`mobile-nav-btn ${
              mobileTab === item.to
                ? 'active'
                : ''
            }`}
            onClick={() => {
              setMobileTab(item.to);
              navigate(item.to);
            }}
          >

            <span>
              {item.emoji}
            </span>

            <small>
              {item.label}
            </small>

          </button>

        ))}

      </nav>

    </div>
  );
}

export { AvatarBubble };