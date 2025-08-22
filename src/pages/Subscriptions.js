import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { TEXTS } from '../utils/constants';
import { formatCurrency, formatDate, formatNumber, getInitials } from '../utils/helpers';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const Subscriptions = () => {
  const [financialStats, setFinancialStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    active_only: false,
    skip: 0,
    limit: 20
  });

  useEffect(() => {
    loadFinancialData();
    loadSubscriptions();
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [filters]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ApiService.getFinancialStats();
      if (result.error) {
        setError(result.error);
      } else {
        setFinancialStats(result.data);
      }
    } catch (err) {
      setError('Moliyaviy ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    setSubscriptionsLoading(true);

    try {
      const result = await ApiService.getSubscriptions(filters);
      if (result.error) {
        console.error('Subscriptions loading error:', result.error);
      } else {
        setSubscriptions(result.data || []);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      skip: 0 // Reset pagination when filter changes
    }));
  };

  const handleRefresh = () => {
    loadFinancialData();
    loadSubscriptions();
  };

  const getSubscriptionStatus = (subscription) => {
    const now = new Date();
    const endDate = new Date(subscription.end_date);
    
    if (!subscription.is_active) {
      return { status: 'cancelled', label: 'Bekor qilingan', class: 'expired' };
    }
    
    if (endDate < now) {
      return { status: 'expired', label: 'Muddati tugagan', class: 'expired' };
    }
    
    return { status: 'active', label: 'Faol', class: 'active' };
  };

  const calculateDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="Obuna ma'lumotlari yuklanmoqda..." />
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
    <div className="subscriptions-page">
      <div className="page-header">
        <div className="page-title">
          <h1>{TEXTS.subscriptions}</h1>
          <p>Obunalar va moliyaviy hisobotlar boshqaruvi</p>
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
          <button className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Yangi obuna
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      {financialStats && (
        <div className="subscription-overview">
          <div className="financial-card">
            <div className="financial-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="financial-card-value">
              {formatCurrency(financialStats.total_revenue)}
            </div>
            <div className="financial-card-label">{TEXTS.totalRevenue}</div>
            <div className="financial-card-change">
              +{formatNumber(financialStats.total_paid_subscriptions)} obuna
            </div>
          </div>

          <div className="financial-card">
            <div className="financial-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </div>
            <div className="financial-card-value">
              {formatCurrency(financialStats.monthly_revenue)}
            </div>
            <div className="financial-card-label">{TEXTS.monthlyRevenue}</div>
            <div className="financial-card-change">Joriy oy</div>
          </div>

          <div className="financial-card">
            <div className="financial-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="financial-card-value">
              {formatNumber(financialStats.active_subscriptions)}
            </div>
            <div className="financial-card-label">{TEXTS.activeSubscriptions}</div>
            <div className="financial-card-change">Hozirda faol</div>
          </div>

          <div className="financial-card">
            <div className="financial-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <div className="financial-card-value">
              {formatCurrency(financialStats.average_subscription_value)}
            </div>
            <div className="financial-card-label">O'rtacha qiymat</div>
            <div className="financial-card-change">Har bir obuna</div>
          </div>
        </div>
      )}

      {/* Subscription Filters */}
      <div className="subscription-filters">
        <div className="filter-group">
          <label htmlFor="active_filter">Status:</label>
          <select 
            id="active_filter"
            className="filter-select"
            value={filters.active_only ? 'active' : 'all'}
            onChange={(e) => handleFilterChange('active_only', e.target.value === 'active')}
          >
            <option value="all">Barcha obunalar</option>
            <option value="active">Faqat faol obunalar</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="limit_filter">Sahifada:</label>
          <select 
            id="limit_filter"
            className="filter-select"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value="10">10 ta</option>
            <option value="20">20 ta</option>
            <option value="50">50 ta</option>
          </select>
        </div>

        <div className="filter-stats">
          <span>Ko'rsatilgan: {subscriptions.length}</span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="subscription-list">
        {subscriptionsLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <LoadingSpinner text="Obunalar yuklanmoqda..." />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3>Obunalar topilmadi</h3>
            <p>
              {filters.active_only 
                ? "Hozirda faol obunalar mavjud emas" 
                : "Hozircha hech qanday obuna yaratilmagan"
              }
            </p>
          </div>
        ) : (
          subscriptions.map((subscription) => {
            const status = getSubscriptionStatus(subscription);
            const daysRemaining = calculateDaysRemaining(subscription.end_date);
            
            return (
              <div key={subscription.id} className="subscription-item">
                <div className="subscription-user">
                  <div className="subscription-user-avatar">
                    {getInitials(`User ${subscription.user_id}`, '')}
                  </div>
                  <div className="subscription-user-info">
                    <h4>Foydalanuvchi #{subscription.user_id}</h4>
                    <p>Yaratilgan: {formatDate(subscription.created_at)}</p>
                  </div>
                </div>

                <div className="subscription-details">
                  <div className="subscription-amount">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </div>
                  <div className="subscription-dates">
                    {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                  </div>
                  {status.status === 'active' && (
                    <div className="subscription-dates">
                      {daysRemaining} kun qoldi
                    </div>
                  )}
                </div>

                <div className="subscription-actions">
                  <span className={`subscription-status ${status.class}`}>
                    {status.label}
                  </span>
                  <button className="btn btn-outline btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ko'rish
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Tahrirlash
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Placeholder */}
      {subscriptions.length > 0 && (
        <div className="pagination-placeholder" style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: 'var(--gray-500)',
          fontStyle: 'italic'
        }}>
          Sahifalash tez orada qo'shiladi
        </div>
      )}

      {/* Revenue Chart Placeholder */}
      {financialStats && financialStats.revenue_by_month && (
        <div className="dashboard-section">
          <h2>Oylik daromad tahlili</h2>
          <div className="analytics-card">
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center', 
              color: 'var(--gray-500)',
              border: '2px dashed var(--gray-300)',
              borderRadius: 'var(--border-radius-lg)'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              <h3>Daromad grafigi</h3>
              <p>Chart.js yoki boshqa kutubxona bilan ko'rsatiladi</p>
              <div style={{ marginTop: '1rem', fontSize: 'var(--font-size-sm)' }}>
                So'nggi 12 oy: {financialStats.revenue_by_month.length} ta ma'lumot
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;