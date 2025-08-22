import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import { TEXTS } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';
import LoadingSpinner from '../layout/LoadingSpinner';

const UserProgress = ({ user, onClose }) => {
  const [progressData, setProgressData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadProgressData();
  }, [user.id]);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);

    try {
      // We need to make a custom API call to get user progress
      // Since the current API only has /api/progress/my-progress for current user
      // We'll simulate this by getting lessons data and showing placeholder
      
      const lessonsResult = await ApiService.getLessons();
      if (lessonsResult.error) {
        setError(lessonsResult.error);
      } else {
        setLessonsData(lessonsResult.data?.modules || []);
        
        // Calculate mock progress data for demo
        generateMockProgress(lessonsResult.data?.modules || []);
      }
    } catch (err) {
      setError('Foydalanuvchi progressini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const generateMockProgress = (modules) => {
    // Generate mock progress data based on modules/lessons/packs
    const mockProgress = [];
    let total = 0;

    modules.forEach(module => {
      module.lessons?.forEach(lesson => {
        lesson.packs?.forEach(pack => {
          const score = Math.floor(Math.random() * 101); // 0-100
          const points = score >= 90 ? 100 : score;
          
          mockProgress.push({
            pack_id: pack.id,
            lesson_id: lesson.id,
            module_id: module.id,
            module_title: module.title,
            lesson_title: lesson.title,
            pack_title: pack.title,
            pack_type: pack.type,
            best_score: score,
            total_points: points
          });
          
          total += points;
        });
      });
    });

    setProgressData(mockProgress);
    setTotalPoints(total);
  };

  const getProgressByModule = () => {
    const moduleProgress = {};
    
    progressData.forEach(progress => {
      if (!moduleProgress[progress.module_id]) {
        moduleProgress[progress.module_id] = {
          id: progress.module_id,
          title: progress.module_title,
          lessons: {}
        };
      }
      
      if (!moduleProgress[progress.module_id].lessons[progress.lesson_id]) {
        moduleProgress[progress.module_id].lessons[progress.lesson_id] = {
          id: progress.lesson_id,
          title: progress.lesson_title,
          packs: []
        };
      }
      
      moduleProgress[progress.module_id].lessons[progress.lesson_id].packs.push(progress);
    });
    
    return moduleProgress;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-average';
    return 'score-poor';
  };

  const getPackTypeIcon = (type) => {
    if (type === 'word') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
        </svg>
      );
    }
    
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3l-2-3H8L6 7H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal progress-modal">
          <LoadingSpinner size="large" text="Progress yuklanmoqda..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal progress-modal">
          <div className="modal-header">
            <h2>Xatolik</h2>
            <button onClick={onClose} className="modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <div className="error-message">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moduleProgress = getProgressByModule();

  return (
    <div className="modal-overlay">
      <div className="modal progress-modal">
        <div className="modal-header">
          <div className="progress-header">
            <h2>{TEXTS.studentProgress}</h2>
            <div className="user-info">
              <span className="user-name">
                {user.first_name} {user.last_name || ''}
              </span>
              <span className="total-points">
                Jami ballar: {formatNumber(totalPoints)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {progressData.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              <h3>Progress ma'lumoti yo'q</h3>
              <p>Bu foydalanuvchi hali hech qanday test topshirmagan</p>
            </div>
          ) : (
            <div className="progress-content">
              {Object.values(moduleProgress).map(module => (
                <div key={module.id} className="module-progress">
                  <h3 className="module-title">{module.title}</h3>
                  
                  {Object.values(module.lessons).map(lesson => (
                    <div key={lesson.id} className="lesson-progress">
                      <h4 className="lesson-title">{lesson.title}</h4>
                      
                      <div className="packs-progress">
                        {lesson.packs.map(pack => (
                          <div key={pack.pack_id} className="pack-progress-item">
                            <div className="pack-info">
                              <div className="pack-header">
                                <span className="pack-icon">
                                  {getPackTypeIcon(pack.pack_type)}
                                </span>
                                <span className="pack-title">{pack.pack_title}</span>
                                <span className="pack-type">
                                  {pack.pack_type === 'word' ? 'So\'zlar' : 'Grammatika'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="pack-stats">
                              <div className={`score ${getScoreColor(pack.best_score)}`}>
                                {pack.best_score}%
                              </div>
                              <div className="points">
                                {formatNumber(pack.total_points)} ball
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;