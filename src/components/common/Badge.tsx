import React from 'react';
import { HealthStatus, ThreatLevel } from '@/lib/types/admin';

interface BadgeProps {
  status?: HealthStatus | ThreatLevel | 'Engine Active' | 'Active' | 'Suspended' | 'Pending' | string;
  variant?: 'healthy' | 'review' | 'danger' | 'purple' | 'neutral';
  children?: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  showDot = true,
  className = ''
}) => {
  // Determine variant automatically if not explicitly given
  let calculatedVariant: 'healthy' | 'review' | 'danger' | 'purple' | 'neutral' = variant || 'neutral';

  const s = (status || '').toString().toLowerCase();

  if (s === 'healthy' || s === 'looks safe' || s === 'low' || s === 'active' || s === 'online') {
    calculatedVariant = 'healthy';
  } else if (s === 'needs review' || s === 'be careful' || s === 'medium' || s === 'pending') {
    calculatedVariant = 'review';
  } else if (s === 'danger' || s === 'high' || s === 'critical' || s === 'high scam risk' || s === 'suspended' || s === 'offline') {
    calculatedVariant = 'danger';
  } else if (s === 'engine active' || s === 'sample data' || s === 'optimal') {
    calculatedVariant = 'purple';
  }

  const textToDisplay = children || status;

  return (
    <span className={`status-badge badge-${calculatedVariant} ${className}`}>
      {showDot && <span className="status-badge-dot" />}
      <span className="status-badge-text">{textToDisplay}</span>
    </span>
  );
};

