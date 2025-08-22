import React from 'react';
import { formatNumber, calculateTimeAgo } from '../../utils/helpers';

const SystemStats = ({ 
  stats = null, 
  loading = false, 
  lastUpdated = new Date(),
  onRefresh 
}) => {
  const calculateEngagementMetrics = () => {
    if (!stats) return null;

    const totalContent = (stats.total_words || 0) + (stats.total_grammar_questions || 0);
    const engagementRate = stats.total_users > 0 
      ? ((stats.active_users_last_7_days || 0) / stats.total_users * 100).toFixed(1)
      : 0;

    return {
      totalContent,
      engagementRate,
      contentPerUser: stats.total_users > 0 
        ? (totalContent / stats.total_users).toFixed(1) 
        : 0,
      activePercentage: stats.total_users > 0 
        ? ((stats.active_users_last_7_days || 0) / stats.total_users * 100).toFixed(1)
        : 0,
      contentGrowthRate: totalContent > 0 ? 'Barqaror' : 'Boshlang\'ich bosqich'
    };
  };

  const getSystemHealth = () => {
    if (!stats) return { status: 'unknown', color: 'var(--gray-400)' };

    const issues = [];
    if (stats.total_users === 0) issues.push('Foydalanuvchi yo\'q');
    if (stats.total_modules === 0) issues.push('Modul yo\'q');
    if (stats.total_words === 0 && stats.total_grammar_questions === 0) issues.push('Kontent yo\'q');
    if (stats.active_users_last_7_days === 0) issues.push('Faol foydalanuvchi yo\'q');

    if (issues.length === 0) {
      return { status: 'excellent', color: 'var(--success-color)', label: 'A\'lo' };
    } else if (issues.length <= 2) {
      return { status: 'good', color: 'var(--primary-color)', label: 'Yaxshi' };
    } else {
      return { status: 'needs-attention', color: 'var(--warning-color)', label: 'E\'tibor talab' };
    }
  };

  if (loading) {
    return (
      <div className="system-stats-loading">
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
          <p>Tizim statistikasi yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="system-stats-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <h3>Ma'lumot yuklanmadi</h3>
        <p>Tizim statistikasi olishda xatolik yuz berdi</p>
        {onRefresh && (
          <button onClick={onRefresh} className="btn btn-primary">
            Qayta urinish
          </button>
        )}
      </div>
    );
  }

  const metrics = calculateEngagementMetrics();
  const health = getSystemHealth();

  return (
    <div className="system-stats">
      {/* System Health Header */}
      <div className="system-health-header">
        <div className="health-indicator">
          <div 
            className="health-status-dot" 
            style={{ backgroundColor: health.color }}
          />
          <h3>Tizim holati: {health.label}</h3>
        </div>
        
        <div className="last-updated">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          <span>Oxirgi yangilanish: {calculateTimeAgo(lastUpdated)}</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="stats-metrics-grid">
        {/* User Metrics */}
        <div className="metric-section">
          <h4>Foydalanuvchilar</h4>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-value">{formatNumber(stats.total_users)}</div>
              <div className="metric-label">Jami foydalanuvchilar</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatNumber(stats.active_users_last_7_days)}</div>
              <div className="metric-label">Faol (7 kun)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{metrics.engagementRate}%</div>
              <div className="metric-label">Faollik darajasi</div>
            </div>
          </div>
        </div>

        {/* Content Metrics */}
        <div className="metric-section">
          <h4>Kontent</h4>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-value">{formatNumber(stats.total_modules)}</div>
              <div className="metric-label">Modullar</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatNumber(stats.total_lessons)}</div>
              <div className="metric-label">Darslar</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatNumber(metrics.totalContent)}</div>
              <div className="metric-label">Jami savollar</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metric-section">
          <h4>Samaradorlik</h4>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-value">{metrics.contentPerUser}</div>
              <div className="metric-label">Kontent/Foydalanuvchi</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatNumber(stats.total_translations)}</div>
              <div className="metric-label">Tarjimalar</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{metrics.activePercentage}%</div>
              <div className="metric-label">Faol foydalanuvchilar</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Components Status */}
      <div className="system-components">
        <h4>Tizim komponentlari</h4>
        <div className="components-grid">
          <div className="component-status">
            <div className="component-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <div className="component-info">
              <span className="component-name">API Server</span>
              <span className="component-health healthy">Ishlayapti</span>
            </div>
          </div>

          <div className="component-status">
            <div className="component-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <div className="component-info">
              <span className="component-name">Ma'lumotlar bazasi</span>
              <span className="component-health healthy">Yaxshi</span>
            </div>
          </div>

          <div className="component-status">
            <div className="component-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div className="component-info">
              <span className="component-name">Kesh tizimi</span>
              <span className="component-health healthy">Faol</span>
            </div>
          </div>

          <div className="component-status">
            <div className="component-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <div className="component-info">
              <span className="component-name">Telegram Bot</span>
              <span className="component-health healthy">Ulangan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="system-insights">
        <h4>Tezkor tahlil</h4>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-title">Faollik darajasi</span>
              <span className="insight-desc">
                {metrics.engagementRate}% foydalanuvchilar faol - bu yaxshi ko'rsatkichdir
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20m8-10H4" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-title">Kontent to'yinganligi</span>
              <span className="insight-desc">
                Har bir foydalanuvchiga {metrics.contentPerUser} ta savol to'g'ri keladi
              </span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-title">O'sish sur'ati</span>
              <span className="insight-desc">
                Platform {metrics.contentGrowthRate} rivojlanish sur'atida
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;