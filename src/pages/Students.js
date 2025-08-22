import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { TEXTS } from '../utils/constants';
import { formatDate, generateTelegramLink, getInitials, debounce } from '../utils/helpers';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import UserProgress from '../components/users/UserProgress';

const Students = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ApiService.getUsers(forceRefresh);
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.data?.users || []);
      }
    } catch (err) {
      setError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = debounce(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
  }, 300);

  const handleRefresh = () => {
    loadUsers(true);
  };

  const handleViewProgress = (user) => {
    setSelectedUser(user);
    setShowProgressModal(true);
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setSelectedUser(null);
  };

  const handleTelegramClick = (user) => {
    const telegramUrl = generateTelegramLink(user.telegram_id);
    window.open(telegramUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="O'quvchilar yuklanmoqda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <div className="error-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h3>Xatolik yuz berdi</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="students-page">
      <div className="page-header">
        <div className="page-title">
          <h1>{TEXTS.students}</h1>
          <p>Platformada ro'yxatdan o'tgan barcha o'quvchilar</p>
        </div>
        
        <div className="page-actions">
          <button onClick={handleRefresh} className="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            {TEXTS.refresh}
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="students-controls">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-field"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
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

        <div className="students-stats">
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

      {/* Students List */}
      <div className="students-list">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>O'quvchilar topilmadi</h3>
            <p>
              {searchTerm 
                ? "Qidiruv bo'yicha natija topilmadi" 
                : "Hozircha hech qanday o'quvchi ro'yxatdan o'tmagan"
              }
            </p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.first_name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                  )}
                </div>
                
                <div className="user-info">
                  <h3 className="user-name">
                    {user.first_name} {user.last_name || ''}
                  </h3>
                  <p className="user-phone">{user.phone_number}</p>
                  <p className="user-date">
                    Ro'yxatdan o'tgan: {formatDate(user.created_at)}
                  </p>
                </div>
                
                <div className="user-actions">
                  <button
                    onClick={() => handleTelegramClick(user)}
                    className="btn btn-outline btn-sm"
                    title={TEXTS.openTelegram}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    Telegram
                  </button>
                  
                  <button
                    onClick={() => handleViewProgress(user)}
                    className="btn btn-primary btn-sm"
                    title={TEXTS.viewProgress}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                    Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Modal */}
      {showProgressModal && selectedUser && (
        <UserProgress 
          user={selectedUser}
          onClose={handleCloseProgressModal}
        />
      )}
    </div>
  );
};

export default Students;