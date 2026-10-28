'use client';

import React, { useState } from 'react';
import { HistoryItem } from '@/lib/data/historyStore';
import { SampleDataPill } from '../common/SampleDataPill';

interface CallSafetyResultProps {
  result: HistoryItem;
  onReset: () => void;
  onNavigateHistory?: () => void;
}

export const CallSafetyResult: React.FC<CallSafetyResultProps> = ({
  result,
  onReset,
  onNavigateHistory
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showAgentDetails, setShowAgentDetails] = useState(false);

  const isHighRisk = result.riskScore >= 70;
  const isMediumRisk = result.riskScore >= 40 && result.riskScore < 70;
  const isSafe = result.riskScore < 40;

  const riskColor = isHighRisk ? '#DC2626' : isMediumRisk ? '#D97706' : '#059669';

  return (
    <div className="call-safety-result-container">
      {/* Back Button & Top Navigation */}
      <div className="result-top-nav">
        <button className="result-back-link" onClick={onReset}>
          ← Back to Audio Upload
        </button>

        <div className="result-file-meta">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="result-filename">{result.fileName}</span>
          <span className="result-separator">•</span>
          <span className="result-time">{result.date}, {result.timestamp}</span>
          {result.isLiveAnalysis ? (
            <span className="live-telemetry-pill">● Real API Telemetry</span>
          ) : (
            <SampleDataPill />
          )}
        </div>
      </div>

      <div className="result-heading-group">
        <h1 className="result-main-title">Your Call Safety Results</h1>
        <p className="result-sub-title">
          Automated acoustic and linguistic risk analysis of uploaded telephony audio.
        </p>
      </div>

      {/* Top Grid: Risk Gauge & Verdict Card */}
      <div className="case-results-top-grid">
        {/* Left: Risk Gauge Card */}
        <div className="case-gauge-card">
          <div className="case-gauge-header">
            <span className="case-gauge-tag">RISK INDEX</span>
            <span className={`case-severity-dot-label ${isHighRisk ? 'text-danger' : isMediumRisk ? 'text-warning' : 'text-success'}`}>
              ● {result.resultLabel}
            </span>
          </div>

          <div className="case-gauge-circle-wrapper">
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
                strokeDashoffset={251.2 - (251.2 * result.riskScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="case-gauge-center-text">
              <span className="case-gauge-score">{result.riskScore}</span>
              <span className="case-gauge-max">/ 100 RISK</span>
            </div>
          </div>

          <div className="case-gauge-footer-pill">
            <span className={`case-status-badge ${isHighRisk ? 'badge-danger' : isMediumRisk ? 'badge-review' : 'badge-healthy'}`}>
              {isHighRisk && '🛡️ High Scam Risk'}
              {isMediumRisk && '⚠️ Be Careful'}
              {isSafe && '✓ Looks Safe'}
            </span>
            <span className="case-gauge-note">
              {result.isLiveAnalysis ? 'Calculated via Fast-API' : 'Sample / Demo Score'}
            </span>
          </div>
        </div>

        {/* Right: Verdict Summary Box */}
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

          <p className="case-verdict-desc">{result.summary}</p>

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

      {/* Middle Grid: What we noticed & What you should do */}
      <div className="case-notices-grid">
        <div className="case-notice-card">
          <div className="case-notice-header">
            <span className="case-notice-icon">📋</span>
            <h4>{isSafe ? 'What we found' : 'What we noticed'}</h4>
          </div>
          <ul className="case-notice-list">
            {result.whatWeNoticed.map((item, idx) => (
              <li key={idx} className="case-notice-item">
                <span className={isSafe ? 'case-notice-check' : 'case-notice-bullet'}>
                  {isSafe ? '✓' : '!'}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="case-notice-card">
          <div className="case-notice-header">
            <span className="case-notice-icon">🛡️</span>
            <h4>{isSafe ? 'A few things to remember' : 'What you should do'}</h4>
          </div>
          <ul className="case-notice-list">
            {result.whatYouShouldDo.map((item, idx) => (
              <li key={idx} className="case-notice-item">
                <span className="case-notice-check">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Audio Player Card */}
      <div className="case-player-card" style={{ marginBottom: '20px' }}>
        <div className="case-player-left">
          <button
            className="case-play-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio simulation'}
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
            <span className="case-player-rate">{result.format}</span>
          </div>
        </div>

        <div className="case-player-waveform">
          {[...Array(40)].map((_, i) => {
            const h = ((Math.sin(i * 0.35) + 1.2) * 12) + (i % 4) * 4;
            const isFlaggedBar = isHighRisk && i > 14 && i < 24;
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
          <span className="case-time-text">00:00 / {result.duration}</span>
          <span className="case-speed-tag">1.0x</span>
        </div>
      </div>

      {/* Accordion / Drawer: Plain-English Audio Transcript */}
      <div className="result-detail-accordion">
        <button
          className="result-accordion-toggle"
          onClick={() => setShowTranscript(!showTranscript)}
        >
          <div className="accordion-title-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="accordion-title-text">
              View Conversation Text (Plain-English audio transcript)
            </span>
          </div>
          <span className="accordion-chevron">{showTranscript ? '▲' : '▼'}</span>
        </button>

        {showTranscript && (
          <div className="case-utterances-list" style={{ padding: '16px 20px', borderTop: '1px solid #EAECF0' }}>
            {result.transcript.map((item, i) => (
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
        )}
      </div>

      {/* Accordion: Multi-Agent Neural Breakdown */}
      <div className="result-detail-accordion" style={{ marginTop: '14px' }}>
        <button
          className="result-accordion-toggle"
          onClick={() => setShowAgentDetails(!showAgentDetails)}
        >
          <div className="accordion-title-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="accordion-title-text">
              Multi-Agent Neural Breakdown & Indicators ({result.agentBreakdown.length} agents)
            </span>
          </div>
          <span className="accordion-chevron">{showAgentDetails ? '▲' : '▼'}</span>
        </button>

        {showAgentDetails && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #EAECF0' }}>
            {result.agentBreakdown.map((agent, i) => (
              <div key={i} className="case-agent-card">
                <div className="case-agent-header">
                  <div>
                    <span className="case-agent-name">{agent.agentName}</span>
                    <span className="case-agent-verdict">{agent.status}</span>
                  </div>
                  <span className="case-agent-confidence">
                    {(agent.confidence * 100).toFixed(0)}% Confidence (Weight: {agent.contributionPercent}%)
                  </span>
                </div>
                <p className="case-agent-details">{agent.details}</p>
                <div className="indicator-pills">
                  {agent.indicators.map((ind, j) => (
                    <span key={j} className="indicator-pill">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="result-actions-footer">
        <button className="btn-secondary" onClick={onReset}>
          Check Another Recording
        </button>
        {onNavigateHistory && (
          <button className="btn-primary" onClick={onNavigateHistory}>
            View in Check History →
          </button>
        )}
      </div>
    </div>
  );
};

