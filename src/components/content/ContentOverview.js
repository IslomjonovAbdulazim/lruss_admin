import React from 'react';
import { formatNumber, formatDate } from '../../utils/helpers';

const ContentOverview = ({ 
  modules = [], 
  wordPacks = [], 
  grammarPacks = [], 
  topics = [],
  loading = false 
}) => {
  const calculateStats = () => {
    const totalModules = modules.length;
    const totalLessons = modules.reduce((sum, module) => 
      sum + (module.lessons?.length || 0), 0);
    const totalPacks = modules.reduce((sum, module) => 
      sum + module.lessons?.reduce((lessonSum, lesson) => 
        lessonSum + (lesson.packs?.length || 0), 0) || 0, 0);
    const totalWords = wordPacks.reduce((sum, pack) => 
      sum + (pack.words?.length || 0), 0);
    const totalGrammar = grammarPacks.reduce((sum, pack) => 
      sum + (pack.grammars?.length || 0), 0);
    const totalTopics = topics.length;

    return {
      totalModules,
      totalLessons,
      totalPacks,
      totalWords,
      totalGrammar,
      totalTopics,
      totalContent: totalWords + totalGrammar
    };
  };

  const getRecentContent = () => {
    const allContent = [
      ...modules.map(m => ({ ...m, type: 'module', contentType: 'Modul' })),
      ...wordPacks.map(p => ({ ...p, type: 'word_pack', contentType: 'So\'z paketi' })),
      ...grammarPacks.map(p => ({ ...p, type: 'grammar_pack', contentType: 'Grammatika paketi' })),
      ...topics.map(t => ({ ...t, type: 'topic', contentType: 'Video mavzu' }))
    ];

    return allContent
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  };

  const getContentHealth = () => {
    const stats = calculateStats();
    
    const issues = [];
    if (stats.totalWords === 0) issues.push('So\'z paketi yo\'q');
    if (stats.totalGrammar === 0) issues.push('Grammatika paketi yo\'q');
    if (stats.totalTopics === 0) issues.push('Video mavzu yo\'q');
    if (stats.totalLessons === 0) issues.push('Dars yo\'q');

    return {
      isHealthy: issues.length === 0,
      issues,
      completeness: Math.round(((4 - issues.length) / 4) * 100)
    };
  };

  if (loading) {
    return (
      <div className="content-overview-loading">
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
          <p>Kontent ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const recentContent = getRecentContent();
  const health = getContentHealth();

  return (
    <div className="content-overview">
      {/* Statistics Cards */}
      <div className="content-stats-grid">
        <div className="content-stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalModules)}</h3>
            <p>Modullar</p>
            <small>{formatNumber(stats.totalLessons)} dars</small>
          </div>
        </div>

        <div className="content-stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-color)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalWords)}</h3>
            <p>So'zlar</p>
            <small>{formatNumber(wordPacks.length)} paket</small>
          </div>
        </div>

        <div className="content-stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-color)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalGrammar)}</h3>
            <p>Grammatika</p>
            <small>{formatNumber(grammarPacks.length)} paket</small>
          </div>
        </div>

        <div className="content-stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--error-color)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalTopics)}</h3>
            <p>Video mavzular</p>
            <small>Grammatika uchun</small>
          </div>
        </div>
      </div>

      {/* Content Health */}
      <div className="content-health">
        <div className="health-header">
          <h3>Kontent holati</h3>
          <div className={`health-status ${health.isHealthy ? 'healthy' : 'needs-attention'}`}>
            {health.isHealthy ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,11 12,14 22,4" />
                <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{health.isHealthy ? 'Yaxshi' : 'E\'tibor talab qiladi'}</span>
          </div>
        </div>

        <div className="health-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${health.completeness}%`,
                backgroundColor: health.isHealthy ? 'var(--success-color)' : 'var(--warning-color)'
              }}
            />
          </div>
          <span>{health.completeness}% to'liq</span>
        </div>

        {!health.isHealthy && (
          <div className="health-issues">
            <h4>Muammolar:</h4>
            <ul>
              {health.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recent Content */}
      <div className="recent-content">
        <div className="section-header">
          <h3>So'nggi qo'shilgan kontent</h3>
          <span className="content-count">{recentContent.length} ta element</span>
        </div>

        {recentContent.length > 0 ? (
          <div className="recent-content-list">
            {recentContent.map((item, index) => (
              <div key={`${item.type}-${item.id}-${index}`} className="recent-content-item">
                <div className="content-icon">
                  {item.type === 'module' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  )}
                  {item.type === 'word_pack' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  )}
                  {item.type === 'grammar_pack' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                  {item.type === 'topic' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  )}
                </div>

                <div className="content-info">
                  <h4>{item.title || `${item.contentType} #${item.id}`}</h4>
                  <p className="content-type">{item.contentType}</p>
                  <p className="content-date">{formatDate(item.created_at)}</p>
                </div>

                <button className="content-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-recent">
            <p>Hozircha hech qanday kontent qo'shilmagan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentOverview;