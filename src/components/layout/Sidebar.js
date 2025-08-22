import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TEXTS, ROUTES } from '../../utils/constants';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: ROUTES.dashboard,
      label: TEXTS.dashboard,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      path: ROUTES.students,
      label: TEXTS.students,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      path: ROUTES.content,
      label: TEXTS.content,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      )
    },
    {
      path: ROUTES.subscriptions,
      label: TEXTS.subscriptions,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      path: ROUTES.analytics,
      label: TEXTS.analytics,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
        </svg>
      )
    }
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 20h20" />
              <path d="M5 20V4" />
              <path d="M12 20V10" />
              <path d="M19 20V14" />
            </svg>
          </div>
          <span className="logo-text">LRUSS</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `menu-link ${isActive ? 'active' : ''}`
                }
                end={item.path === ROUTES.dashboard}
              >
                <span className="menu-icon">
                  {item.icon}
                </span>
                <span className="menu-label">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;