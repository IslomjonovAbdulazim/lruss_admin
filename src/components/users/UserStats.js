import React from 'react';
import { formatNumber, formatDate } from '../../utils/helpers';

const UserStats = ({ 
  user, 
  progressData = [], 
  totalPoints = 0,
  className = '' 
}) => {
  const calculateStats = () => {
    if (!progressData.length) {
      return {
        totalPacks: 0,
        completedPacks: 0,
        averageScore: 0,
        bestScore: 0,
        totalPoints: 0
      };
    }

    const totalPacks = progressData.length;
    const completedPacks = progressData.filter(p => p.best_score >= 70).length;
    const averageScore = progressData.reduce((sum, p) => sum + p.best_score, 0) / totalPacks;
    const bestScore = Math.max(...progressData.map(p => p.best_score));

    return {
      totalPacks,
      completedPacks,
      averageScore: Math.round(averageScore),
      bestScore,
      totalPoints
    };
  };

  const stats = calculateStats();
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success-color)';
    if (score >= 70) return 'var(--primary-color)';
    if (score >= 50) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const getCompletionRate = () => {
    if (stats.totalPacks === 0) return 0;
    return Math.round((stats.completedPacks / stats.totalPacks) * 100);
  };

  return (
    <div className={`user-stats ${className}`}>
      {/* User Header */}
      <div className="user-stats-header">
        <div className="user-basic-info">
          <h3>{user.first_name} {user.last_name || ''}</h3>
          <p>{user.phone_number}</p>
          <small>Ro'yxatdan o'tgan: {formatDate(user.created_at)}</small>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>{formatNumber(stats.totalPoints)}</h4>
            <p>Jami ballar</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-color)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>{stats.completedPacks}/{stats.totalPacks}</h4>
            <p>Tugatilgan paketlar</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: getScoreColor(stats.averageScore) }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>{stats.averageScore}%</h4>
            <p>O'rtacha ball</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: getScoreColor(stats.bestScore) }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>{stats.bestScore}%</h4>
            <p>Eng yaxshi natija</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Umumiy o'zlashtirish</span>
          <span>{getCompletionRate()}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${getCompletionRate()}%`,
              backgroundColor: getScoreColor(getCompletionRate())
            }}
          />
        </div>
        <div className="progress-details">
          <small>
            {stats.completedPacks} paket tugatilgan / {stats.totalPacks} jami paket
          </small>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-metrics">
        <h4>Ko'rsatkichlar</h4>
        <div className="metrics-list">
          <div className="metric-item">
            <span className="metric-label">Faollik darajasi:</span>
            <span className="metric-value">
              {stats.totalPacks > 0 ? 'Faol' : 'Faol emas'}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">O'rtacha vaqt:</span>
            <span className="metric-value">Ma'lumot yo'q</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Eng kuchli yo'nalish:</span>
            <span className="metric-value">
              {stats.bestScore > 0 ? 'Umumiy' : 'Ma\'lumot yo\'q'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      {progressData.length > 0 && (
        <div className="recent-activity">
          <h4>So'nggi faollik</h4>
          <div className="activity-list">
            {progressData.slice(0, 3).map((progress, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,11 12,14 22,4" />
                    <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11" />
                  </svg>
                </div>
                <div className="activity-content">
                  <p>Paket #{progress.pack_id}</p>
                  <small>{progress.best_score}% - {progress.total_points} ball</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;