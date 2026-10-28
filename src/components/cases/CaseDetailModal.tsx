'use client';

import React, { useState } from 'react';
import { CaseRecord } from '@/lib/types/admin';
import { SampleDataPill } from '../common/SampleDataPill';

interface CaseDetailModalProps {
  caseRecord: CaseRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseRecord, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'transcript'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !caseRecord) return null;

  const isHighRisk = caseRecord.riskScore >= 70;
  const isMediumRisk = caseRecord.riskScore >= 40 && caseRecord.riskScore < 70;
  const isSafe = caseRecord.riskScore < 40;

  const riskColor = isHighRisk ? '#DC2626' : isMediumRisk ? '#D97706' : '#059669';

  return (
    <div className="case-modal-backdrop" onClick={onClose}>
      <div className="case-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="case-modal-top-bar">
          <div className="case-modal-title-row">
            <button className="case-modal-back-btn" onClick={onClose}>
              ← Back to Cases
            </button>
            <div className="case-modal-header-file">
              <span className="case-modal-filename">{caseRecord.fileName}</span>
              <span className="case-modal-meta">
                {caseRecord.date} • {caseRecord.timestamp} • {caseRecord.format}
              </span>
              <SampleDataPill />
            </div>
          </div>
          <button className="case-modal-close-icon" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="case-modal-tabs">
          <button
            className={`case-tab-btn ${activeTab === 'overview' ? 'case-tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Investigation Verdict
          </button>
          <button
            className={`case-tab-btn ${activeTab === 'agents' ? 'case-tab-active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Multi-Agent Evidence ({caseRecord.agentBreakdown.length})
          </button>
          <button
            className={`case-tab-btn ${activeTab === 'transcript' ? 'case-tab-active' : ''}`}
            onClick={() => setActiveTab('transcript')}
          >
            Transcript & Acoustic Spans
          </button>
        </div>

        {/* Modal Body */}
        <div className="case-modal-content">
          {activeTab === 'overview' && (
            <div className="case-overview-layout">
              {/* Top Row: Risk Gauge Card & Verdict Banner matching ui_6-1, ui_6-2, ui_6-3 */}
              <div className="case-results-top-grid">
                {/* Risk Gauge Card */}
                <div className="case-gauge-card">
                  <div className="case-gauge-header">
                    <span className="case-gauge-tag">RISK INDEX</span>
                    <span className={`case-severity-dot-label ${isHighRisk ? 'text-danger' : isMediumRisk ? 'text-warning' : 'text-success'}`}>
                      ● {caseRecord.resultLabel}
                    </span>
                  </div>

                  <div className="case-gauge-circle-wrapper">
                    {/* SVG Gauge */}
                    <svg viewBox="0 0 100 100" className="case-gauge-svg">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F2F4F7"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={riskColor}
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * caseRecord.riskScore) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="case-gauge-center-text">
                      <span className="case-gauge-score">{caseRecord.riskScore}</span>
                      <span className="case-gauge-max">/ 100 RISK</span>
                    </div>
                  </div>

                  <div className="case-gauge-footer-pill">
                    <span className={`case-status-badge ${isHighRisk ? 'badge-danger' : isMediumRisk ? 'badge-review' : 'badge-healthy'}`}>
                      {isHighRisk && '🛡️ High Scam Risk'}
                      {isMediumRisk && '⚠️ Be Careful'}
                      {isSafe && '✓ Looks Safe'}
                    </span>
                    <span className="case-gauge-note">Sample / Demo Score</span>
                  </div>
                </div>

                {/* Verdict Explanation Box */}
                <div className={`case-verdict-box ${isHighRisk ? 'verdict-danger' : isMediumRisk ? 'verdict-warning' : 'verdict-safe'}`}>
                  <div className="case-verdict-header">
                    <div className="case-verdict-icon">
                      {isHighRisk && '⚠️'}
                      {isMediumRisk && '⚠️'}
                      {isSafe && '✓'}
                    </div>
                    <h3 className="case-verdict-title">
                      {isHighRisk && 'This call shows strong signs of a possible scam.'}
                      {isMediumRisk && 'This call may be suspicious.'}
                      {isSafe && "We didn't find strong signs of a scam in this recording."}
                    </h3>
                  </div>

                  <p className="case-verdict-desc">{caseRecord.summary}</p>

                  <div className="case-verdict-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>Scam risk and voice authenticity are evaluated separately across multiple neural agents.</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Two Information Cards */}
              <div className="case-notices-grid">
                {/* What We Noticed Card */}
                <div className="case-notice-card">
                  <div className="case-notice-header">
                    <span className="case-notice-icon">📋</span>
                    <h4>What we noticed</h4>
                  </div>
                  <ul className="case-notice-list">
                    {caseRecord.whatWeNoticed.map((item, idx) => (
                      <li key={idx} className="case-notice-item">
                        <span className="case-notice-bullet">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What You Should Do Card */}
                <div className="case-notice-card">
                  <div className="case-notice-header">
                    <span className="case-notice-icon">🛡️</span>
                    <h4>What you should do</h4>
                  </div>
                  <ul className="case-notice-list">
                    {caseRecord.whatYouShouldDo.map((item, idx) => (
                      <li key={idx} className="case-notice-item">
                        <span className="case-notice-check">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Audio Waveform Player Simulation */}
              <div className="case-player-card">
                <div className="case-player-left">
                  <button
                    className="case-play-toggle"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause' : 'Play audio simulation'}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                  <div className="case-player-details">
                    <span className="case-player-label">Original Audio</span>
                    <span className="case-player-rate">{caseRecord.format}</span>
                  </div>
                </div>

                {/* Animated / Static Waveform bars */}
                <div className="case-player-waveform">
                  {[...Array(36)].map((_, i) => {
                    const h = ((Math.sin(i * 0.4) + 1.2) * 14) + (i % 3) * 6;
                    const isFlaggedBar = isHighRisk && i > 12 && i < 22;
                    return (
                      <span
                        key={i}
                        className={`waveform-bar ${isFlaggedBar ? 'waveform-bar-flagged' : ''} ${isPlaying ? 'waveform-anim' : ''}`}
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>

                <div className="case-player-timing">
                  <span className="case-time-text">00:00 / {caseRecord.duration}</span>
                  <span className="case-speed-tag">1.0x</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="case-agents-list">
              <div className="case-agents-intro">
                <p>
                  VoiceShield evaluates telephony speech using an orchestrated multi-agent neural ensemble.
                  Inspect individual agent confidence and telemetry indicators below.
                </p>
              </div>

              {caseRecord.agentBreakdown.map((agent, i) => (
                <div key={i} className="case-agent-card">
                  <div className="case-agent-header">
                    <div className="case-agent-title-col">
                      <span className="case-agent-name">{agent.agentName}</span>
                      <span className="case-agent-verdict">{agent.status}</span>
                    </div>
                    <div className="case-agent-score-col">
                      <span className="case-agent-confidence">
                        {(agent.confidence * 100).toFixed(0)}% Confidence
                      </span>
                      <span className="case-agent-weight">
                        Weight: {agent.contributionPercent}%
                      </span>
                    </div>
                  </div>

                  <p className="case-agent-details">{agent.details}</p>

                  <div className="case-agent-indicators">
                    <span className="indicator-title">Acoustic & Semantic Flags:</span>
                    <div className="indicator-pills">
                      {agent.indicators.map((ind, j) => (
                        <span key={j} className="indicator-pill">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="case-transcript-view">
              <div className="case-transcript-header">
                <span className="transcript-header-title">Speech-to-Text Transcription</span>
                <span className="transcript-header-lang">Bilingual (English / Hindi local Whisper provider)</span>
              </div>

              <div className="case-utterances-list">
                {caseRecord.transcript.map((item, i) => (
                  <div
                    key={i}
                    className={`case-utterance-item ${item.isFlagged ? 'utterance-flagged' : ''}`}
                  >
                    <div className="utterance-meta">
                      <span className="utterance-time">{item.timestamp}</span>
                      <span className={`utterance-speaker speaker-${item.speaker.toLowerCase()}`}>
                        {item.speaker}
                      </span>
                      {item.isFlagged && (
                        <span className="utterance-flag-badge">⚠️ {item.flagReason}</span>
                      )}
                    </div>
                    <p className="utterance-text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="case-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Inspection
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              alert(`Case report ${caseRecord.fileName} copied to clipboard (Demo).`);
            }}
          >
            Copy Case Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

