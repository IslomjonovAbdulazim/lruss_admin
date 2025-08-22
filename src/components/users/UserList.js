import React from 'react';
import UserCard from './UserCard';
import { debounce } from '../../utils/helpers';

const UserList = ({ 
  users = [], 
  searchTerm = '', 
  onSearchChange, 
  loading = false,
  onUserSelect,
  onTelegramClick,
  onViewProgress 
}) => {
  const handleSearchChange = debounce((term) => {
    if (onSearchChange) {
      onSearchChange(term);
    }
  }, 300);

  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="user-list-loading">
        <div className="loading-spinner">
          <div className="spinner">
            <svg className="spinner-svg" viewBox="0 0 50 50">
              <circle
                className="spinner-circle"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="spinner-text">Foydalanuvchilar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      {/* Search Header */}
      <div className="user-list-header">
        <div className="search-box">
          <div className="search-input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Ism, familiya yoki telefon raqam bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                handleSearchChange(e.target.value);
              }}
              className="search-field"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange && onSearchChange('')}
                className="search-clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="user-list-stats">
          <div className="stat-item">
            <span className="stat-label">Jami:</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ko'rsatilgan:</span>
            <span className="stat-value">{filteredUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>Foydalanuvchilar topilmadi</h3>
          <p>
            {searchTerm 
              ? "Qidiruv bo'yicha natija topilmadi" 
              : "Hozircha hech qanday foydalanuvchi ro'yxatdan o'tmagan"
            }
          </p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onSelect={onUserSelect}
              onTelegramClick={onTelegramClick}
              onViewProgress={onViewProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;