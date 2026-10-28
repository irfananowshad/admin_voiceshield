'use client';

import React, { useState } from 'react';
import { DailyClonedIncidentData } from '@/lib/types/admin';
import { SampleDataPill } from '../common/SampleDataPill';

interface ClonedVoiceTimelineChartProps {
  data: DailyClonedIncidentData[];
}

export const ClonedVoiceTimelineChart: React.FC<ClonedVoiceTimelineChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart dimensions in SVG viewBox coordinate space
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxY = 30; // 0 to 30 as in admin_ui.jpeg

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (count: number) => {
    return paddingTop + chartHeight - (count / maxY) * chartHeight;
  };

  // Generate smooth cubic bezier SVG path
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.count), d }));

  let linePathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    linePathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const yTicks = [30, 20, 10, 0];

  return (
    <div className="analytics-card">
      {/* Header */}
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="card-title-pill-row">
            <h2 className="card-main-title">Cloned-Voice Scams Detected Per Day</h2>
            <SampleDataPill />
          </div>
          <p className="card-subtitle">Number of recordings where cloned voices were detected</p>
        </div>
      </div>

      {/* SVG Line / Area Chart */}
      <div className="timeline-chart-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="timeline-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6355F6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#6355F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {val}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#F2F4F7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaPathD} fill="url(#purpleAreaGrad)" />

          {/* The curved line */}
          <path
            d={linePathD}
            fill="none"
            stroke="#6355F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Points & X-Labels */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={pt.d.date}
                className="chart-data-point"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={paddingTop + chartHeight + 22}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {pt.d.displayDate}
                </text>

                {/* Point dot matching reference */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#6355F6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                />

                {/* Tooltip bubble on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={pt.x - 30}
                      y={pt.y - 32}
                      width="60"
                      height="24"
                      rx="4"
                      fill="#1E1B4B"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {pt.d.count} calls
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Summary Banner matching admin_ui.jpeg */}
      <div className="incident-summary-banner">
        <div className="incident-summary-left">
          <div className="incident-wave-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2.2" strokeLinecap="round">
              <path d="M2 10v4" />
              <path d="M6 6v12" />
              <path d="M10 3v18" />
              <path d="M14 7v10" />
              <path d="M18 5v14" />
              <path d="M22 10v4" />
            </svg>
          </div>
          <div className="incident-summary-text">
            <span className="incident-summary-label">DETECTED CASES THIS WEEK</span>
            <span className="incident-summary-val">100 total incidents</span>
          </div>
        </div>

        <div className="incident-growth-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span className="incident-growth-text">+25% vs prev week</span>
        </div>
      </div>
    </div>
  );
};

