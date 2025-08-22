import React, { useState } from 'react';
import { formatDate, formatNumber } from '../../utils/helpers';

const ModuleList = ({ 
  modules = [], 
  loading = false, 
  onModuleSelect,
  onModuleEdit,
  onModuleDelete,
  showActions = true 
}) => {
  const [expandedModules, setExpandedModules] = useState(new Set());

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleModuleClick = (module, event) => {
    event.stopPropagation();
    if (onModuleSelect) {
      onModuleSelect(module);
    }
  };

  const handleEdit = (module, event) => {
    event.stopPropagation();
    if (onModuleEdit) {
      onModuleEdit(module);
    }
  };

  const handleDelete = (module, event) => {
    event.stopPropagation();
    if (onModuleDelete) {
      onModuleDelete(module);
    }
  };

  if (loading) {
    return (
      <div className="module-list-loading">
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
          <p>Modullar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <h3>Modullar topilmadi</h3>
        <p>Hozircha hech qanday modul yaratilmagan</p>
      </div>
    );
  }

  return (
    <div className="module-list">
      {modules.map((module) => {
        const isExpanded = expandedModules.has(module.id);
        const lessonsCount = module.lessons?.length || 0;
        const packsCount = module.lessons?.reduce((sum, lesson) => 
          sum + (lesson.packs?.length || 0), 0) || 0;

        return (
          <div key={module.id} className="module-item">
            <div 
              className="module-header"
              onClick={() => toggleModule(module.id)}
            >
              <div className="module-info">
                <div className="module-title-section">
                  <h3 className="module-title">{module.title}</h3>
                  <div className="module-stats">
                    <span className="stat-badge">
                      {formatNumber(lessonsCount)} dars
                    </span>
                    <span className="stat-badge">
                      {formatNumber(packsCount)} paket
                    </span>
                  </div>
                </div>
                <div className="module-meta">
                  <span className="module-date">
                    Yaratilgan: {formatDate(module.created_at)}
                  </span>
                  {module.updated_at && (
                    <span className="module-date">
                      Yangilangan: {formatDate(module.updated_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="module-controls">
                {showActions && (
                  <div className="module-actions">
                    <button
                      onClick={(e) => handleModuleClick(module, e)}
                      className="btn btn-outline btn-sm"
                      title="Ko'rish"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleEdit(module, e)}
                      className="btn btn-primary btn-sm"
                      title="Tahrirlash"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(module, e)}
                      className="btn btn-outline btn-sm btn-danger"
                      title="O'chirish"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(module.id);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </button>
              </div>
            </div>

            {isExpanded && module.lessons && module.lessons.length > 0 && (
              <div className="module-content">
                <div className="lessons-list">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-item">
                      <div className="lesson-header">
                        <div className="lesson-info">
                          <h4 className="lesson-title">{lesson.title}</h4>
                          {lesson.description && (
                            <p className="lesson-description">{lesson.description}</p>
                          )}
                          <div className="lesson-meta">
                            <span className="lesson-stat">
                              {lesson.packs?.length || 0} paket
                            </span>
                            <span className="lesson-date">
                              {formatDate(lesson.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {lesson.packs && lesson.packs.length > 0 && (
                        <div className="packs-list">
                          {lesson.packs.map((pack) => (
                            <div key={pack.id} className="pack-item">
                              <div className="pack-info">
                                <span className="pack-title">{pack.title}</span>
                                <span className={`pack-type pack-type-${pack.type}`}>
                                  {pack.type === 'word' ? 'So\'zlar' : 'Grammatika'}
                                </span>
                                {pack.word_count && (
                                  <span className="pack-count">
                                    {pack.word_count} ta
                                  </span>
                                )}
                              </div>
                              <span className="pack-date">
                                {formatDate(pack.created_at)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && (!module.lessons || module.lessons.length === 0) && (
              <div className="module-content">
                <div className="empty-lessons">
                  <p>Bu modulda hali darslar mavjud emas</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleList;