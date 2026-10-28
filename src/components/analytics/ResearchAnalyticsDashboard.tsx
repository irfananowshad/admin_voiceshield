'use client';

import React, { useState } from 'react';
import { ModelHealthCards } from './ModelHealthCards';
import { RecordingTypesChart } from './RecordingTypesChart';
import { ClonedVoiceTimelineChart } from './ClonedVoiceTimelineChart';
import { ScamCategoriesChart } from './ScamCategoriesChart';
import { SampleDataPill } from '../common/SampleDataPill';
import { exportResearchReport } from '@/lib/utils/exportReport';
import {
  SAMPLE_MODEL_HEALTH_METRICS,
  SAMPLE_RECORDING_TYPES,
  SAMPLE_DAILY_CLONED_INCIDENTS,
  SAMPLE_SCAM_CATEGORIES
} from '@/lib/data/sampleData';

interface ResearchAnalyticsDashboardProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const ResearchAnalyticsDashboard: React.FC<ResearchAnalyticsDashboardProps> = ({ onShowToast }) => {
  const [dateRange, setDateRange] = useState<string>('Last 30 days');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const dateOptions = [
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'Year to date'
  ];

  const handleExport = (format: 'csv' | 'json' = 'csv') => {
    setIsExporting(true);
    try {
      const filename = exportResearchReport({ format, dateRangeLabel: dateRange });
      if (onShowToast) {
        onShowToast('Report Exported Successfully', `Downloaded ${filename} based on ${dateRange} sample cohort.`, 'success');
      } else {
        alert(`Downloaded ${filename}`);
      }
    } catch {
      if (onShowToast) {
        onShowToast('Export Failed', 'An error occurred while generating the report.', 'info');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectDate = (option: string) => {
    setDateRange(option);
    setIsDatePickerOpen(false);
    if (onShowToast) {
      onShowToast('Date Filter Updated', `Research metrics filtered for ${option} (sample cohort).`, 'info');
    }
  };

  return (
    <div className="research-analytics-page">
      {/* ====================================================================
          A. Header and Page Introduction (Hero Card matching admin_ui.jpeg)
          ==================================================================== */}
      <div className="page-hero-card">
        <div className="page-hero-left">
          <h1 className="page-hero-title">Research Analytics</h1>
          <p className="page-hero-subtitle">
            Understand model performance and voice scam trends across active telephony clusters.
          </p>
        </div>

        <div className="page-hero-actions">
          {/* Interactive Date-range selector */}
          <div className="date-selector-wrapper">
            <button
              className="btn-date-picker"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              aria-label="Select date range"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{dateRange}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isDatePickerOpen && (
              <div className="date-picker-dropdown">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`date-dropdown-item ${opt === dateRange ? 'date-dropdown-item-active' : ''}`}
                    onClick={() => handleSelectDate(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Action */}
          <button
            className="btn-export-report"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            title="Download CSV report from research cohort"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExporting ? 'Exporting...' : 'Export report'}</span>
          </button>

          {/* Admin Avatar Circle Pill */}
          <div className="page-hero-avatar-pill" title="Active Admin Researcher">
            A
          </div>
        </div>
      </div>

      {/* ====================================================================
          B. Model Health Section (4 Metric Cards matching admin_ui.jpeg)
          ==================================================================== */}
      <section className="model-health-section">
        <div className="section-header-row">
          <div className="section-header-title-group">
            <h2 className="section-title">Model Health</h2>
            <SampleDataPill />
          </div>
          <span className="section-subtitle-telemetry">
            Telemetry synced with production v4.18 neural inference edge
          </span>
        </div>

        <ModelHealthCards metrics={SAMPLE_MODEL_HEALTH_METRICS} />
      </section>

      {/* ====================================================================
          C & D. Middle Row (Recording Types + Cloned-Voice Scams per Day)
          ==================================================================== */}
      <section className="analytics-grid-two-col">
        {/* C. Recording Types in Research (Horizontal Bars) */}
        <RecordingTypesChart data={SAMPLE_RECORDING_TYPES} />

        {/* D. Cloned-Voice Scams Detected Per Day (Line Area Chart + Banner) */}
        <ClonedVoiceTimelineChart data={SAMPLE_DAILY_CLONED_INCIDENTS} />
      </section>

      {/* ====================================================================
          E. Scam Types & Categories (Bottom Chart matching admin_ui.jpeg)
          ==================================================================== */}
      <section className="scam-types-section">
        <ScamCategoriesChart data={SAMPLE_SCAM_CATEGORIES} />
      </section>
    </div>
  );
};

