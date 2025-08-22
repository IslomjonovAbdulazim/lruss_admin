import React from 'react';
import { formatDate, generateTelegramLink, getInitials } from '../../utils/helpers';
import { TEXTS } from '../../utils/constants';

const UserCard = ({ 
  user, 
  onSelect, 
  onTelegramClick, 
  onViewProgress,
  showActions = true,
  compact = false 
}) => {
  const handleTelegramClick = (e) => {
    e.stopPropagation();
    if (onTelegramClick) {
      onTelegramClick(user);
    } else {
      const telegramUrl = generateTelegramLink(user.telegram_id);
      window.open(telegramUrl, '_blank');
    }
  };

  const handleViewProgress = (e) => {
    e.stopPropagation();
    if (onViewProgress) {
      onViewProgress(user);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(user);
    }
  };

  const cardClasses = [
    'user-card',
    compact && 'user-card-compact',
    onSelect && 'user-card-clickable'
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <div className="user-avatar">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.first_name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="avatar-placeholder" 
          style={{ 
            display: user.avatar_url ? 'none' : 'flex' 
          }}
        >
          {getInitials(user.first_name, user.last_name)}
        </div>
      </div>
      
      <div className="user-info">
        <h3 className="user-name">
          {user.first_name} {user.last_name || ''}
        </h3>
        <p className="user-phone">{user.phone_number}</p>
        {!compact && (
          <>
            <p className="user-telegram">ID: {user.telegram_id}</p>
            <p className="user-date">
              Ro'yxatdan o'tgan: {formatDate(user.created_at)}
            </p>
          </>
        )}
      </div>
      
      {showActions && (
        <div className="user-actions">
          <button
            onClick={handleTelegramClick}
            className="btn btn-outline btn-sm"
            title={TEXTS.openTelegram}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Telegram
          </button>
          
          <button
            onClick={handleViewProgress}
            className="btn btn-primary btn-sm"
            title={TEXTS.viewProgress}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
            Progress
          </button>
        </div>
      )}

      {/* User Status Indicators */}
      <div className="user-indicators">
        {user.avatar_url && (
          <div className="indicator indicator-avatar" title="Avatar mavjud">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
        
        {user.last_name && (
          <div className="indicator indicator-complete" title="To'liq ism">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,11 12,14 22,4" />
              <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;