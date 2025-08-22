import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { TEXTS } from '../utils/constants';
import { formatNumber, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const Content = () => {
  const [activeTab, setActiveTab] = useState('modules');
  const [contentData, setContentData] = useState({
    modules: [],
    words: [],
    grammar: [],
    topics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Load lessons data (modules/lessons/packs)
      const lessonsResult = await ApiService.getLessons(forceRefresh);
      if (lessonsResult.error) {
        setError(lessonsResult.error);
      } else {
        setContentData(prev => ({
          ...prev,
          modules: lessonsResult.data?.modules || []
        }));
      }

      // Load quiz data (words and grammar)
      const quizResult = await ApiService.getQuiz(forceRefresh);
      if (!quizResult.error && quizResult.data) {
        setContentData(prev => ({
          ...prev,
          words: quizResult.data.word_packs || [],
          grammar: quizResult.data.grammar_packs || []
        }));
      }

      // Load grammar topics
      const topicsResult = await ApiService.getGrammarTopics(forceRefresh);
      if (!topicsResult.error && topicsResult.data) {
        setContentData(prev => ({
          ...prev,
          topics: topicsResult.data.topics || []
        }));
      }

    } catch (err) {
      setError('Kontent ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadContentData(true);
  };

  const tabs = [
    { key: 'modules', label: TEXTS.modules, icon: '📚' },
    { key: 'words', label: TEXTS.words, icon: '📝' },
    { key: 'grammar', label: TEXTS.grammar, icon: '✏️' },
    { key: 'topics', label: TEXTS.topics, icon: '🎥' }
  ];

  const getTotalCounts = () => {
    const totalModules = contentData.modules.length;
    const totalLessons = contentData.modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
    const totalPacks = contentData.modules.reduce((sum, module) => 
      sum + module.lessons?.reduce((lessonSum, lesson) => lessonSum + (lesson.packs?.length || 0), 0) || 0, 0);
    const totalWords = contentData.words.reduce((sum, pack) => sum + (pack.words?.length || 0), 0);
    const totalGrammar = contentData.grammar.reduce((sum, pack) => sum + (pack.grammars?.length || 0), 0);
    const totalTopics = contentData.topics.length;

    return { totalModules, totalLessons, totalPacks, totalWords, totalGrammar, totalTopics };
  };

  const renderModules = () => (
    <div className="content-grid">
      {contentData.modules.map(module => (
        <div key={module.id} className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">{module.title}</h3>
            <span className="content-card-type">Modul</span>
          </div>
          
          <div className="content-card-stats">
            <div className="content-stat">
              <div className="content-stat-value">{module.lessons?.length || 0}</div>
              <div className="content-stat-label">Darslar</div>
            </div>
            <div className="content-stat">
              <div className="content-stat-value">
                {module.lessons?.reduce((sum, lesson) => sum + (lesson.packs?.length || 0), 0) || 0}
              </div>
              <div className="content-stat-label">Paketlar</div>
            </div>
          </div>
          
          <div className="content-card-meta">
            <span>Yaratilgan: {formatDate(module.created_at)}</span>
          </div>
          
          <div className="content-card-actions">
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
      ))}
    </div>
  );

  const renderWords = () => (
    <div className="content-grid">
      {contentData.words.map(pack => (
        <div key={pack.id} className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">{pack.title}</h3>
            <span className="content-card-type">So'zlar</span>
          </div>
          
          <div className="content-card-stats">
            <div className="content-stat">
              <div className="content-stat-value">{pack.words?.length || 0}</div>
              <div className="content-stat-label">So'zlar soni</div>
            </div>
            <div className="content-stat">
              <div className="content-stat-value">{pack.word_count || 0}</div>
              <div className="content-stat-label">Belgilangan</div>
            </div>
          </div>
          
          <div className="content-card-meta">
            <span>Dars ID: {pack.lesson_id}</span>
            <span>Yaratilgan: {formatDate(pack.created_at)}</span>
          </div>
          
          <div className="content-card-actions">
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
      ))}
    </div>
  );

  const renderGrammar = () => (
    <div className="content-grid">
      {contentData.grammar.map(pack => (
        <div key={pack.id} className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">{pack.title}</h3>
            <span className="content-card-type">Grammatika</span>
          </div>
          
          <div className="content-card-stats">
            <div className="content-stat">
              <div className="content-stat-value">{pack.grammars?.length || 0}</div>
              <div className="content-stat-label">Savollar</div>
            </div>
            <div className="content-stat">
              <div className="content-stat-value">
                {pack.grammars?.filter(g => g.type === 'fill').length || 0}
              </div>
              <div className="content-stat-label">To'ldirish</div>
            </div>
            <div className="content-stat">
              <div className="content-stat-value">
                {pack.grammars?.filter(g => g.type === 'build').length || 0}
              </div>
              <div className="content-stat-label">Qurish</div>
            </div>
          </div>
          
          <div className="content-card-meta">
            <span>Dars ID: {pack.lesson_id}</span>
            <span>Yaratilgan: {formatDate(pack.created_at)}</span>
          </div>
          
          <div className="content-card-actions">
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
      ))}
    </div>
  );

  const renderTopics = () => (
    <div className="content-grid">
      {contentData.topics.map(topic => (
        <div key={topic.id} className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">Grammatika mavzusi #{topic.id}</h3>
            <span className="content-card-type">Video</span>
          </div>
          
          <div className="content-card-meta">
            <span>Paket ID: {topic.pack_id}</span>
            <span>Yaratilgan: {formatDate(topic.created_at)}</span>
          </div>
          
          <div className="content-card-stats">
            <div className="content-stat">
              <div className="content-stat-value">{topic.video_url ? '✓' : '✗'}</div>
              <div className="content-stat-label">Video</div>
            </div>
            <div className="content-stat">
              <div className="content-stat-value">{topic.markdown_text ? '✓' : '✗'}</div>
              <div className="content-stat-label">Matn</div>
            </div>
          </div>
          
          <div className="content-card-actions">
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
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="Kontent yuklanmoqda..." />
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

  const counts = getTotalCounts();

  return (
    <div className="content-page">
      <div className="page-header">
        <div className="page-title">
          <h1>{TEXTS.content}</h1>
          <p>Ta'lim kontentini boshqarish va tahrirlash</p>
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

      {/* Content Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(counts.totalModules)}</h3>
            <p>Modullar</p>
            <small>{formatNumber(counts.totalLessons)} dars</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(counts.totalWords)}</h3>
            <p>So'zlar</p>
            <small>{formatNumber(contentData.words.length)} paket</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3l-2-3H8L6 7H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(counts.totalGrammar)}</h3>
            <p>Grammatika</p>
            <small>{formatNumber(contentData.grammar.length)} paket</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(counts.totalTopics)}</h3>
            <p>Video mavzular</p>
            <small>Grammatika uchun</small>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="content-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`content-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'modules' && (
        <div>
          {contentData.modules.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <h3>Modullar topilmadi</h3>
              <p>Hozircha hech qanday modul yaratilmagan</p>
            </div>
          ) : (
            renderModules()
          )}
        </div>
      )}

      {activeTab === 'words' && (
        <div>
          {contentData.words.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
              </svg>
              <h3>So'z paketlari topilmadi</h3>
              <p>Hozircha hech qanday so'z paketi yaratilmagan</p>
            </div>
          ) : (
            renderWords()
          )}
        </div>
      )}

      {activeTab === 'grammar' && (
        <div>
          {contentData.grammar.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3l-2-3H8L6 7H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1" />
              </svg>
              <h3>Grammatika paketlari topilmadi</h3>
              <p>Hozircha hech qanday grammatika paketi yaratilmagan</p>
            </div>
          ) : (
            renderGrammar()
          )}
        </div>
      )}

      {activeTab === 'topics' && (
        <div>
          {contentData.topics.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <h3>Video mavzular topilmadi</h3>
              <p>Hozircha hech qanday video mavzu yaratilmagan</p>
            </div>
          ) : (
            renderTopics()
          )}
        </div>
      )}
    </div>
  );
};

export default Content;