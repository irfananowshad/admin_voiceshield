'use client';

import React, { useEffect, useState } from 'react';

interface AnalysisProcessingModalProps {
  isOpen: boolean;
  fileName: string;
  fileSize: string;
  onCancel: () => void;
  currentStepIndex?: number;
}

export const AnalysisProcessingModal: React.FC<AnalysisProcessingModalProps> = ({
  isOpen,
  fileName,
  fileSize,
  onCancel,
  currentStepIndex = 1
}) => {
  const [internalStep, setInternalStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setInternalStep(1);
      return;
    }
    // Advance progress steps visually
    const interval = setInterval(() => {
      setInternalStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const activeStep = Math.max(currentStepIndex, internalStep);

  const steps = [
    { label: 'Converting speech to text', id: 1 },
    { label: 'Looking for common scam patterns', id: 2 },
    { label: 'Analyzing the conversation', id: 3 },
    { label: 'Preparing your results', id: 4 }
  ];

  return (
    <div className="case-modal-backdrop" onClick={onCancel}>
      <div className="processing-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="processing-modal-header">
          <div className="processing-header-title">
            <div className="processing-shield-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Analyzing your recording</h3>
          </div>
          <button className="case-modal-close-icon" onClick={onCancel} aria-label="Cancel analysis">
            ✕
          </button>
        </div>

        {/* Subheader: file metadata & encrypted tag */}
        <div className="processing-file-meta-row">
          <div className="processing-file-info">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="processing-filename">{fileName}</span>
            <span className="processing-filesize">• {fileSize}</span>
          </div>
          <span className="processing-encrypted-tag">Encrypted Stream</span>
        </div>

        {/* Concentric Circle Animation & Waveform matching ui_5.jpeg */}
        <div className="processing-visual-area">
          <div className="processing-pulsing-rings">
            <div className="pulse-ring ring-3" />
            <div className="pulse-ring ring-2" />
            <div className="pulse-ring ring-1" />
            <div className="processing-center-orb">
              <div className="orb-waveform">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className={`orb-wave-bar wave-bar-${i}`} />
                ))}
              </div>
            </div>
          </div>

          <h4 className="processing-headline">Please wait while we analyze your recording...</h4>
          <p className="processing-subheadline">This usually takes less than a minute.</p>
        </div>

        {/* Stepper Checklist matching ui_5.jpeg */}
        <div className="processing-steps-list">
          {steps.map((st) => {
            const isDone = activeStep > st.id;
            const isInProgress = activeStep === st.id;
            const isPending = activeStep < st.id;

            return (
              <div key={st.id} className="processing-step-row">
                <div className="processing-step-left">
                  <div
                    className={`processing-step-icon ${
                      isDone
                        ? 'step-icon-done'
                        : isInProgress
                        ? 'step-icon-inprogress'
                        : 'step-icon-pending'
                    }`}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isInProgress ? (
                      <span className="step-pulsing-dot" />
                    ) : (
                      <span className="step-pending-dot" />
                    )}
                  </div>
                  <span
                    className={`processing-step-text ${
                      isDone ? 'step-text-done' : isInProgress ? 'step-text-inprogress' : 'step-text-pending'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>

                <div className="processing-step-status">
                  {isDone && <span className="step-tag-done">Done</span>}
                  {isInProgress && (
                    <span className="step-tag-inprogress">
                      <span className="step-tag-dot" /> In progress...
                    </span>
                  )}
                  {isPending && <span className="step-tag-pending">Pending</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Retention Disclaimer */}
        <div className="processing-retention-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            Encrypted analysis in progress. Audio is securely inspected without permanent retention.
          </span>
        </div>

        {/* Cancel Button */}
        <div className="processing-modal-actions">
          <button className="btn-cancel-analysis" onClick={onCancel}>
            Cancel Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

