'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getHistoryItems, HistoryItem } from '@/lib/data/historyStore';
import { CallSafetyResult } from '@/components/audio/CallSafetyResult';
import { SampleDataPill } from '@/components/common/SampleDataPill';

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [selectedResult, setSelectedResult] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setHistoryItems(getHistoryItems());
  }, []);

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult =
      resultFilter === 'All' ||
      (resultFilter === 'Safe' && item.riskScore < 40) ||
      (resultFilter === 'Careful' && item.riskScore >= 40 && item.riskScore < 70) ||
      (resultFilter === 'High' && item.riskScore >= 70);

    return matchesSearch && matchesResult;
  });

  const getScorePillClass = (score: number) => {
    if (score >= 70) return 'risk-pill-danger';
    if (score >= 40) return 'risk-pill-warning';
    return 'risk-pill-healthy';
  };

  const getBadgeClass = (score: number) => {
    if (score >= 70) return 'badge-danger';
    if (score >= 40) return 'badge-review';
    return 'badge-healthy';
  };

  return (
    <AdminLayout>
      <div className="history-page">
        {selectedResult ? (
          <CallSafetyResult
            result={selectedResult}
            onReset={() => setSelectedResult(null)}
          />
        ) : (
          <>
            {/* Header Hero Card */}
            <div className="page-hero-card">
              <div className="page-hero-left">
                <div className="card-title-pill-row">
                  <h1 className="page-hero-title">Your Check History</h1>
                  <SampleDataPill />
                </div>
                <p className="page-hero-subtitle">
                  View your previous recordings, transcripts, and neural risk classification results.
                </p>
              </div>

              <div className="page-hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => router.push('/dashboard')}
                >
                  + Check Audio
                </button>
              </div>
            </div>

            {/* Check History Table Card matching ui_7.jpeg */}
            <div className="table-card" style={{ marginBottom: '24px' }}>
              <div className="table-toolbar">
                <div className="table-search-input">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search recordings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="table-filters">
                  <select
                    className="table-select"
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                  >
                    <option value="All">All results</option>
                    <option value="Safe">Looks Safe</option>
                    <option value="Careful">Be Careful</option>
                    <option value="High">High Scam Risk</option>
                  </select>

                  <select
                    className="table-select"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="All">All time</option>
                    <option value="Today">Today</option>
                    <option value="Week">This week</option>
                  </select>

                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 14px' }}
                    onClick={() => router.push('/dashboard')}
                  >
                    Upload New Recording
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Date & Time</th>
                      <th>Risk Score</th>
                      <th>Result</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px' }}>
                          No recordings found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  backgroundColor: '#F3F0FF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'var(--primary)',
                                  flexShrink: 0
                                }}
                              >
                                ▶
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                  {item.fileName}
                                </div>
                                <div style={{ fontSize: '11.5px', color: 'var(--text-light)' }}>
                                  {item.format}
                                  {item.isLiveAnalysis && (
                                    <span style={{ marginLeft: '6px', color: '#059669', fontWeight: 600 }}>
                                      • Live API
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>{item.date}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.timestamp}</div>
                          </td>
                          <td>
                            <span className={`risk-score-pill ${getScorePillClass(item.riskScore)}`}>
                              {item.riskScore} / 100
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${getBadgeClass(item.riskScore)}`}>
                              <span className="status-badge-dot" />
                              <span className="status-badge-text">{item.resultLabel}</span>
                            </span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>
                            {item.duration}
                          </td>
                          <td>
                            <span
                              className="table-action-link"
                              onClick={() => setSelectedResult(item)}
                            >
                              View result →
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-pagination-footer">
                <span className="pagination-info">
                  Showing 1 to {filteredItems.length} of {historyItems.length} records
                </span>
                <div className="pagination-controls">
                  <button className="pagination-btn" disabled>Previous</button>
                  <button className="pagination-btn pagination-page-active">1</button>
                  <button className="pagination-btn" disabled>Next</button>
                </div>
              </div>
            </div>

            {/* Privacy Guaranteed Voice Inspections Card matching ui_7.jpeg */}
            <div className="analytics-card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#F3F0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Privacy Guaranteed Voice Inspections
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    VoiceShield extracts synthetic acoustic artifacts and vocal-tract biomarkers entirely without recording long-term biometric profiles. Audio data is kept strictly inside encrypted private sessions.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

