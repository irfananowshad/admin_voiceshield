import React from 'react';
import { RecordingTypeData } from '@/lib/types/admin';
import { SampleDataPill } from '../common/SampleDataPill';

interface RecordingTypesChartProps {
  data: RecordingTypeData[];
}

export const RecordingTypesChart: React.FC<RecordingTypesChartProps> = ({ data }) => {
  const maxScale = 1400;

  return (
    <div className="analytics-card">
      {/* Header */}
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-title-pill-row">
            <h2 className="card-main-title">Recording Types in Research</h2>
            <SampleDataPill />
          </div>
          <p className="card-subtitle">Number of recordings available by type for research study</p>
        </div>
      </div>

      {/* Horizontal Bars Container */}
      <div className="recording-bars-list">
        {data.map((item) => {
          const widthPercent = (item.count / maxScale) * 100;
          return (
            <div key={item.category} className="recording-bar-item">
              <div className="recording-bar-header">
                <span className="recording-bar-label">{item.category}</span>
                <span className="recording-bar-value">{item.count.toLocaleString()}</span>
              </div>
              <div className="recording-bar-track">
                <div
                  className="recording-bar-fill"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Scale */}
      <div className="recording-axis-wrapper">
        <div className="recording-axis-ticks">
          <span className="axis-tick-label">0</span>
          <span className="axis-tick-label">350</span>
          <span className="axis-tick-label">700</span>
          <span className="axis-tick-label">1,050</span>
          <span className="axis-tick-label">1,400</span>
        </div>
        <div className="recording-axis-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span className="recording-legend-text">Number of recordings (indexed sample count)</span>
        </div>
      </div>
    </div>
  );
};

