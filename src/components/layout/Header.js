import React from 'react';
import { useAuth } from '../../store/authStore';
import { TEXTS } from '../../utils/constants';

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            {process.env.REACT_APP_NAME} Admin
          </h1>
        </div>
        
        <div className="header-right">
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">
                {user?.phone || 'Admin'}
              </span>
              <span className="user-role">Administrator</span>
            </div>
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title={TEXTS.logout}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {TEXTS.logout}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;