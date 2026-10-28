'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SAMPLE_CASES } from '@/lib/data/sampleData';
import { CaseRecord } from '@/lib/types/admin';
import { SampleDataPill } from '@/components/common/SampleDataPill';
import { CaseDetailModal } from '@/components/cases/CaseDetailModal';

export default function CasesPage() {
  const [cases] = useState<CaseRecord[]>(SAMPLE_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [threatFilter, setThreatFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesThreat =
      threatFilter === 'All' ||
      (threatFilter === 'High' && (c.threatLevel === 'High' || c.threatLevel === 'Critical')) ||
      (threatFilter === 'Medium' && c.threatLevel === 'Medium') ||
      (threatFilter === 'Low' && c.threatLevel === 'Low');

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesThreat && matchesCategory;
  });

  const getRiskScoreClass = (score: number) => {
    if (score >= 70) return 'risk-pill-danger';
    if (score >= 40) return 'risk-pill-warning';
    return 'risk-pill-healthy';
  };

  const getResultBadgeClass = (score: number) => {
    if (score >= 70) return 'badge-danger';
    if (score >= 40) return 'badge-review';
    return 'badge-healthy';
  };

  return (
    <AdminLayout>
      <div className="cases-page">
        {/* Header Hero Card */}
        <div className="page-hero-card">
          <div className="page-hero-left">
            <div className="card-title-pill-row">
              <h1 className="page-hero-title">Case Management</h1>
              <SampleDataPill />
            </div>
            <p className="page-hero-subtitle">
              Review, filter, and investigate flagged voice recordings across telephony streams.
            </p>
          </div>

          <div className="page-hero-actions">
            <div className="incident-summary-banner" style={{ padding: '8px 16px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--primary)' }}>
                6 Active Sample Recordings
              </span>
            </div>
          </div>
        </div>

        {/* Cases Table Card */}
        <div className="table-card">
          <div className="table-toolbar">
            <div className="table-search-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search recordings, transcripts, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-filters">
              <select
                className="table-select"
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
              >
                <option value="All">All Threat Levels</option>
                <option value="High">High / Critical Scam Risk</option>
                <option value="Medium">Medium / Be Careful</option>
                <option value="Low">Low / Looks Safe</option>
              </select>

              <select
                className="table-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Bank / OTP Scam">Bank / OTP Scam</option>
                <option value="Insurance Offer">Insurance Offer</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Courier / Delivery">Courier / Delivery</option>
                <option value="Prize / Reward">Prize / Reward</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audio File Name</th>
                  <th>Date & Time</th>
                  <th>Risk Score</th>
                  <th>Verdict Result</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px' }}>
                      No matching cases found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#F3F0FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary)',
                              flexShrink: 0
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.fileName}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-light)' }}>{c.format}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{c.date}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.timestamp}</div>
                      </td>
                      <td>
                        <span className={`risk-score-pill ${getRiskScoreClass(c.riskScore)}`}>
                          {c.riskScore} / 100
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getResultBadgeClass(c.riskScore)}`}>
                          <span className="status-badge-dot" />
                          <span className="status-badge-text">{c.resultLabel}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.category}</td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px' }}>
                        {c.duration}
                      </td>
                      <td>
                        <span
                          className="table-action-link"
                          onClick={() => setSelectedCase(c)}
                        >
                          View details →
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
              Showing 1 to {filteredCases.length} of {cases.length} demo recordings
            </span>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>Previous</button>
              <button className="pagination-btn pagination-page-active">1</button>
              <button className="pagination-btn" disabled>Next</button>
            </div>
          </div>
        </div>

        {/* Deep Dive Case Investigation Modal */}
        <CaseDetailModal
          caseRecord={selectedCase}
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      </div>
    </AdminLayout>
  );
}

