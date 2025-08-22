import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import { TEXTS, ROUTES } from '../utils/constants';
import { formatNumber, formatCurrency, calculateTimeAgo } from '../utils/helpers';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [financialStats, setFinancialStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load basic stats
      const statsResult = await ApiService.getStats();
      if (statsResult.error) {
        setError(statsResult.error);
      } else {
        setStats(statsResult.data);
      }

      // Load financial stats
      const financialResult = await ApiService.getFinancialStats();
      if (!financialResult.error) {
        setFinancialStats(financialResult.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="Dashboard yuklanmoqda..." />
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
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>{TEXTS.dashboard}</h1>
          <p>Platforma statistikasi va umumiy ko'rsatkichlar</p>
        </div>
        
        <div className="dashboard-actions">
          <span className="last-updated">
            Oxirgi yangilanish: {calculateTimeAgo(lastUpdated)}
          </span>
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

      {/* Main Stats Grid */}
      <div className="stats-grid">
        {/* User Stats */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats?.total_users || 0)}</h3>
            <p>Jami foydalanuvchilar</p>
            <small>{formatNumber(stats?.active_users_last_7_days || 0)} faol (7 kun)</small>
          </div>
          <Link to={ROUTES.students} className="stat-link">
            Ko'rish
          </Link>
        </div>

        {/* Content Stats */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats?.total_modules || 0)}</h3>
            <p>Modullar</p>
            <small>
              {formatNumber(stats?.total_lessons || 0)} dars, {formatNumber(stats?.total_packs || 0)} paket
            </small>
          </div>
          <Link to={ROUTES.content} className="stat-link">
            Boshqarish
          </Link>
        </div>

        {/* Revenue Stats */}
        {financialStats && (
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stat-content">
              <h3>{formatCurrency(financialStats.total_revenue)}</h3>
              <p>Jami daromad</p>
              <small>
                {formatNumber(financialStats.active_subscriptions)} faol obuna
              </small>
            </div>
            <Link to={ROUTES.subscriptions} className="stat-link">
              Batafsil
            </Link>
          </div>
        )}

        {/* Quiz Stats */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3l-2-3H8L6 7H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber((stats?.total_words || 0) + (stats?.total_grammar_questions || 0))}</h3>
            <p>Jami savollar</p>
            <small>
              {formatNumber(stats?.total_words || 0)} so'z, {formatNumber(stats?.total_grammar_questions || 0)} grammatika
            </small>
          </div>
          <Link to={ROUTES.analytics} className="stat-link">
            Tahlil
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Tez amallar</h2>
        <div className="quick-actions">
          <Link to={ROUTES.students} className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="action-content">
              <h3>O'quvchilarni boshqarish</h3>
              <p>Ro'yxat ko'rish va progress kuzatish</p>
            </div>
          </Link>

          <Link to={ROUTES.content} className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <div className="action-content">
              <h3>Kontent boshqaruvi</h3>
              <p>Darslar va test savollarini tahrirlash</p>
            </div>
          </Link>

          <Link to={ROUTES.subscriptions} className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="action-content">
              <h3>Obunalar</h3>
              <p>Moliyaviy hisobotlar va obuna boshqaruvi</p>
            </div>
          </Link>

          <Link to={ROUTES.analytics} className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <div className="action-content">
              <h3>Tahlil va hisobotlar</h3>
              <p>Platforma statistikasi va ko'rsatkichlar</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="dashboard-section">
        <h2>So'nggi faollik</h2>
        <div className="activity-placeholder">
          <p>Tez orada so'nggi faollik ma'lumotlari bu yerda ko'rsatiladi</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;