import React from 'react';
import { formatCurrency, formatNumber, formatDate } from '../../utils/helpers';

const SubscriptionOverview = ({ 
  financialStats = null, 
  loading = false,
  onViewDetails,
  onCreateSubscription 
}) => {
  const getGrowthTrend = (monthlyRevenue, yearlyRevenue) => {
    if (!monthlyRevenue || !yearlyRevenue) return null;
    
    const averageMonthly = yearlyRevenue / 12;
    const growth = monthlyRevenue > averageMonthly ? 'up' : 'down';
    const percentage = averageMonthly > 0 
      ? Math.abs(((monthlyRevenue - averageMonthly) / averageMonthly) * 100).toFixed(1)
      : 0;
    
    return { growth, percentage };
  };

  const getRevenueHealthStatus = () => {
    if (!financialStats) return { status: 'unknown', color: 'var(--gray-400)' };
    
    const { total_revenue, active_subscriptions, monthly_revenue } = financialStats;
    
    if (total_revenue > 10000 && active_subscriptions > 50) {
      return { status: 'excellent', color: 'var(--success-color)', label: 'A\'lo' };
    } else if (total_revenue > 1000 && active_subscriptions > 10) {
      return { status: 'good', color: 'var(--primary-color)', label: 'Yaxshi' };
    } else if (total_revenue > 0 && active_subscriptions > 0) {
      return { status: 'developing', color: 'var(--warning-color)', label: 'Rivojlanmoqda' };
    } else {
      return { status: 'starting', color: 'var(--secondary-color)', label: 'Boshlang\'ich' };
    }
  };

  if (loading) {
    return (
      <div className="subscription-overview-loading">
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
          <p>Obuna ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!financialStats) {
    return (
      <div className="subscription-overview-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h3>Moliyaviy ma'lumot yo'q</h3>
        <p>Hozircha moliyaviy statistika mavjud emas</p>
        {onCreateSubscription && (
          <button onClick={onCreateSubscription} className="btn btn-primary">
            Birinchi obunani yaratish
          </button>
        )}
      </div>
    );
  }

  const healthStatus = getRevenueHealthStatus();
  const trend = getGrowthTrend(financialStats.monthly_revenue, financialStats.yearly_revenue);

  return (
    <div className="subscription-overview">
      {/* Header with Status */}
      <div className="overview-header">
        <div className="revenue-health">
          <div 
            className="health-status-dot" 
            style={{ backgroundColor: healthStatus.color }}
          />
          <h3>Moliyaviy holat: {healthStatus.label}</h3>
        </div>
        
        <div className="overview-actions">
          {onViewDetails && (
            <button onClick={onViewDetails} className="btn btn-outline">
              Batafsil ko'rish
            </button>
          )}
          {onCreateSubscription && (
            <button onClick={onCreateSubscription} className="btn btn-primary">
              Yangi obuna
            </button>
          )}
        </div>
      </div>

      {/* Main Financial Cards */}
      <div className="financial-overview-grid">
        <div className="financial-card primary">
          <div className="financial-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="financial-card-content">
            <div className="financial-card-value">
              {formatCurrency(financialStats.total_revenue)}
            </div>
            <div className="financial-card-label">Jami daromad</div>
            <div className="financial-card-meta">
              {formatNumber(financialStats.total_paid_subscriptions)} obunadan
            </div>
          </div>
        </div>

        <div className="financial-card secondary">
          <div className="financial-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          </div>
          <div className="financial-card-content">
            <div className="financial-card-value">
              {formatCurrency(financialStats.monthly_revenue)}
            </div>
            <div className="financial-card-label">Oylik daromad</div>
            <div className="financial-card-meta">
              Joriy oy
              {trend && (
                <span className={`trend trend-${trend.growth}`}>
                  {trend.growth === 'up' ? '↗' : '↘'} {trend.percentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="financial-card tertiary">
          <div className="financial-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="financial-card-content">
            <div className="financial-card-value">
              {formatNumber(financialStats.active_subscriptions)}
            </div>
            <div className="financial-card-label">Faol obunalar</div>
            <div className="financial-card-meta">Hozirda</div>
          </div>
        </div>

        <div className="financial-card quaternary">
          <div className="financial-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </div>
          <div className="financial-card-content">
            <div className="financial-card-value">
              {formatCurrency(financialStats.average_subscription_value)}
            </div>
            <div className="financial-card-label">O'rtacha qiymat</div>
            <div className="financial-card-meta">Har bir obuna</div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="revenue-breakdown">
        <h4>Daromad taqsimoti</h4>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <div className="breakdown-label">Yillik daromad</div>
            <div className="breakdown-value">
              {formatCurrency(financialStats.yearly_revenue)}
            </div>
            <div className="breakdown-percentage">
              {financialStats.total_revenue > 0 
                ? Math.round((financialStats.yearly_revenue / financialStats.total_revenue) * 100)
                : 0}% (joriy yil)
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">Oylik o'rtacha</div>
            <div className="breakdown-value">
              {formatCurrency(financialStats.yearly_revenue / 12)}
            </div>
            <div className="breakdown-percentage">
              Yillik daromaddan hisoblangan
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">Obuna bosqichlari</div>
            <div className="breakdown-value">
              {formatNumber(financialStats.total_paid_subscriptions)}
            </div>
            <div className="breakdown-percentage">
              Jami to'langan obunalar
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart Placeholder */}
      {financialStats.revenue_by_month && financialStats.revenue_by_month.length > 0 && (
        <div className="monthly-performance">
          <h4>Oylik ishlash ko'rsatkichlari</h4>
          <div className="chart-placeholder">
            <div className="chart-info">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              <div>
                <h5>So'nggi 12 oy ma'lumotlari</h5>
                <p>{financialStats.revenue_by_month.length} oylik statistika mavjud</p>
                <small>Chart.js yoki D3.js bilan ko'rsatish mumkin</small>
              </div>
            </div>
            
            {/* Simple Text-based Chart */}
            <div className="simple-chart">
              {financialStats.revenue_by_month.slice(-6).map((month, index) => (
                <div key={month.month} className="chart-bar">
                  <div className="bar-label">{month.month}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${Math.max(10, (month.revenue / Math.max(...financialStats.revenue_by_month.map(m => m.revenue))) * 100)}%`
                      }}
                    />
                  </div>
                  <div className="bar-value">{formatCurrency(month.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="financial-insights">
        <h4>Asosiy xulosalar</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <div className="insight-content">
              <h5>O'sish sur'ati</h5>
              <p>
                {trend && trend.growth === 'up' 
                  ? `${trend.percentage}% ijobiy o'sish` 
                  : 'Barqaror daromad'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="insight-content">
              <h5>Mijozlar saqlash</h5>
              <p>
                {financialStats.total_paid_subscriptions > 0 
                  ? `${Math.round((financialStats.active_subscriptions / financialStats.total_paid_subscriptions) * 100)}% faol obunalar`
                  : 'Ma\'lumot yo\'q'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="insight-content">
              <h5>Daromad samaradorligi</h5>
              <p>
                O'rtacha obuna qiymati {formatCurrency(financialStats.average_subscription_value)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOverview;