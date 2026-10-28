'use client';

import React, { useState } from 'react';
import { ScamCategoryData } from '@/lib/types/admin';
import { SampleDataPill } from '../common/SampleDataPill';

interface ScamCategoriesChartProps {
  data: ScamCategoryData[];
}

export const ScamCategoriesChart: React.FC<ScamCategoriesChartProps> = ({ data }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const maxY = 80;
  const yTicks = [80, 60, 40, 20, 0];

  return (
    <div className="analytics-card scam-categories-card">
      {/* Header */}
      <div className="card-header-row scam-header-row">
        <div className="card-title-group">
          <div className="card-title-pill-row">
            <h2 className="card-main-title">Scam Types & Categories</h2>
            <SampleDataPill />
          </div>
          <p className="card-subtitle">
            Categories of detected scams, including synthetic and cloned-voice speech samples
          </p>
        </div>

        {/* Legend on Right matching reference */}
        <div className="scam-chart-legend">
          <span className="scam-legend-swatch" />
          <span className="scam-legend-label">Confirmed deepfake/clone telemetry</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="scam-barchart-wrapper">
        {/* Y Axis Grid & Labels */}
        <div className="scam-yaxis-column">
          {yTicks.map((tick) => (
            <div key={tick} className="scam-ytick-row">
              <span className="scam-ytick-label">{tick}</span>
              <div className="scam-ygrid-line" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="scam-bars-container">
          {data.map((item) => {
            const heightPercent = (item.count / maxY) * 100;
            const isHovered = hoveredCategory === item.category;

            return (
              <div
                key={item.category}
                className="scam-bar-column"
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Count number above bar */}
                <span className={`scam-bar-number ${isHovered ? 'scam-bar-number-hover' : ''}`}>
                  {item.count}
                </span>

                {/* The vertical bar */}
                <div className="scam-bar-track">
                  <div
                    className="scam-bar-fill"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color,
                      opacity: isHovered ? 1 : 0.92
                    }}
                  />
                </div>

                {/* X axis category label */}
                <span className="scam-bar-label">{item.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Info matching admin_ui.jpeg */}
      <div className="scam-chart-footer">
        <div className="scam-footer-left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span className="scam-footer-text">Y-Axis: Number of recorded scam cases</span>
        </div>
        <div className="scam-footer-right">
          <span className="scam-footer-cohort">Cohort total: 220 validated calls</span>
        </div>
      </div>
    </div>
  );
};

