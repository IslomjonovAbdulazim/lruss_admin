import React from 'react';
import { TEXTS } from '../../utils/constants';

const LoadingSpinner = ({ size = 'medium', text = TEXTS.loading, overlay = false }) => {
  const sizeClass = size === 'small' ? 'spinner-small' : 
                   size === 'large' ? 'spinner-large' : 'spinner-medium';

  const SpinnerComponent = (
    <div className={`loading-spinner ${sizeClass}`}>
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
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {SpinnerComponent}
      </div>
    );
  }

  return SpinnerComponent;
};

export default LoadingSpinner;