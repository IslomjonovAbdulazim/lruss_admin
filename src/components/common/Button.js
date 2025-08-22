import React from 'react';
import LoadingSpinner from '../layout/LoadingSpinner';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = ['btn'];
  
  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning'
  };
  
  // Size classes
  const sizeClasses = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg'
  };
  
  const classes = [
    ...baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || '',
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner size="small" text="" />;
    }
    return icon;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner size="small" text="" />
          <span>Yuklanmoqda...</span>
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          <span>{children}</span>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <span>{children}</span>
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;