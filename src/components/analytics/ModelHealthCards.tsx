import React from 'react';
import { ModelMetricCardData } from '@/lib/types/admin';

interface ModelHealthCardsProps {
  metrics: ModelMetricCardData[];
}

export const ModelHealthCards: React.FC<ModelHealthCardsProps> = ({ metrics }) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'waveform':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10v4" />
            <path d="M6 7v10" />
            <path d="M10 4v16" />
            <path d="M14 8v8" />
            <path d="M18 5v14" />
            <path d="M22 10v4" />
          </svg>
        );
      case 'shield':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'gauge':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            <path d="M12 12L4.93 4.93" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="model-health-grid">
      {metrics.map((metric) => {
        const isReview = metric.status === 'Needs Review';
        return (
          <div key={metric.id} className="metric-card">
            {/* Card Header: Icon + Health Pill */}
            <div className="metric-card-top">
              <div className="metric-icon-box">
                {renderIcon(metric.icon)}
              </div>
              <div className={`metric-health-pill ${isReview ? 'health-pill-review' : 'health-pill-healthy'}`}>
                <span className="health-pill-dot" />
                <span className="health-pill-text">{metric.statusLabel}</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="metric-card-info">
              <h3 className="metric-card-title">{metric.title}</h3>
              <p className="metric-card-subtitle">{metric.subtitle}</p>
            </div>

            {/* Large Value & Variance/Tier Label */}
            <div className="metric-value-row">
              <span className="metric-number">{metric.accuracyFormatted}</span>
              <span className={`metric-variance-label variance-${metric.varianceType}`}>
                {metric.varianceLabel}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{ width: `${metric.progressPercent}%` }}
              />
            </div>

            {/* Footer: Update time & status icon */}
            <div className="metric-card-footer">
              <span className="metric-updated-time">{metric.updatedTime}</span>
              <div className="metric-footer-icon">
                {isReview ? (
                  /* Amber exclamation/info in circle */
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  /* Checkmark in circle matching reference */
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

