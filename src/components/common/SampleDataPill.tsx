import React from 'react';

interface SampleDataPillProps {
  className?: string;
}

export const SampleDataPill: React.FC<SampleDataPillProps> = ({ className = '' }) => {
  return (
    <span
      className={`sample-data-pill ${className}`}
      title="Sample / synthetic dataset for research and demonstration"
    >
      Sample data
    </span>
  );
};

