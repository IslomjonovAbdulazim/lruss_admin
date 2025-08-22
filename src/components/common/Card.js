import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  actions,
  padding = true,
  shadow = true,
  hoverable = false 
}) => {
  const cardClasses = [
    'card',
    shadow && 'card-shadow',
    hoverable && 'card-hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && (
            <div className="card-actions">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className={`card-body ${!padding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;