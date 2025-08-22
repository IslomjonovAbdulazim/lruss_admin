import React, { useState } from 'react';
import { formatDate, formatNumber } from '../../utils/helpers';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "Ma'lumot topilmadi",
  sortable = true,
  hoverable = true,
  striped = false,
  compact = false,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (columnKey) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderCellContent = (item, column) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === 'date') {
      return formatDate(value);
    }

    if (column.type === 'number') {
      return formatNumber(value);
    }

    if (column.type === 'boolean') {
      return value ? 'Ha' : "Yo'q";
    }

    if (column.type === 'status') {
      return (
        <span className={`status status-${value?.toLowerCase()}`}>
          {value}
        </span>
      );
    }

    return value || '-';
  };

  const tableClasses = [
    'table-container',
    className
  ].filter(Boolean).join(' ');

  const tableBodyClasses = [
    'table',
    hoverable && 'table-hoverable',
    striped && 'table-striped',
    compact && 'table-compact'
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={tableClasses}>
        <div className="table-loading">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
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
              <p className="spinner-text">Jadval yuklanmoqda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={tableClasses}>
        <div className="table-empty">
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3>Ma'lumot yo'q</h3>
            <p>{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={tableClasses}>
      <table className={tableBodyClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${sortable && column.sortable !== false ? 'sortable' : ''} ${
                  column.align ? `text-${column.align}` : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="th-content">
                  <span>{column.title}</span>
                  {sortable && column.sortable !== false && (
                    <div className="sort-icons">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`sort-icon ${
                          sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'active' : ''
                        }`}
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`sort-icon ${
                          sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'active' : ''
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td
                  key={`${item.id || index}-${column.key}`}
                  className={column.align ? `text-${column.align}` : ''}
                >
                  {renderCellContent(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;