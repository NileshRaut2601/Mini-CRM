import React from 'react';

function StatCards({ totalCount, filteredCount, isSearching, isConnected }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{totalCount}</span>
        </div>
      </div>

      {isSearching && (
        <div className="stat-card filtered">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <span className="stat-label">Matching Search</span>
            <span className="stat-value">{filteredCount}</span>
          </div>
        </div>
      )}

      <div className="stat-card server-status">
        <div className="stat-icon">⚡</div>
        <div className="stat-info">
          <span className="stat-label">Database Status</span>
          <span className={`stat-value ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'PostgreSQL Live' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatCards;
