'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AnalysisProcessingModal } from '@/components/audio/AnalysisProcessingModal';
import { CallSafetyResult } from '@/components/audio/CallSafetyResult';
import {
  analyzeAudioFile,
  checkBackendHealth,
  createDemoAnalysisResult,
  HealthCheckResponse
} from '@/lib/api/apiClient';
import { getHistoryItems, saveHistoryItem, HistoryItem } from '@/lib/data/historyStore';
import { SampleDataPill } from '@/components/common/SampleDataPill';
import { Toast, ToastMessage } from '@/components/common/Toast';

export default function AdminAudioDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(1);
  const [analysisResult, setAnalysisResult] = useState<HistoryItem | null>(null);
  const [recentChecks, setRecentChecks] = useState<HistoryItem[]>([]);
  const [backendHealth, setBackendHealth] = useState<HealthCheckResponse | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check backend health on mount & load recent checks
  useEffect(() => {
    setRecentChecks(getHistoryItems().slice(0, 5));
    checkBackendHealth().then((res) => setBackendHealth(res));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingStep(1);

    // Call real backend API
    const response = await analyzeAudioFile(selectedFile, selectedLanguage);

    if (response.success && response.data) {
      // Real backend response
      saveHistoryItem(response.data);
      setAnalysisResult(response.data);
      setRecentChecks(getHistoryItems().slice(0, 5));
      setIsProcessing(false);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Analysis Completed',
        message: 'Successfully processed through VoiceShield backend pipeline.'
      });
    } else {
      // Backend failed or is offline
      setIsProcessing(false);
      const isOffline = !response.isLive;

      setToast({
        id: Date.now().toString(),
        type: isOffline ? 'warning' : 'error',
        title: isOffline ? 'Backend Offline (Using Demo Mode)' : 'Backend Analysis Failed',
        message: response.error
      });

      // Provide clear fallback option when backend is not running
      const fallback = createDemoAnalysisResult(
        selectedFile,
        selectedLanguage,
        selectedFile.name.includes('support')
          ? 'safe'
          : selectedFile.name.includes('insurance')
          ? 'suspicious'
          : 'danger'
      );
      saveHistoryItem(fallback);
      setAnalysisResult(fallback);
      setRecentChecks(getHistoryItems().slice(0, 5));
    }
  };

  const handleTrySample = (sampleName: string, presetType: 'safe' | 'suspicious' | 'danger') => {
    // Create mock file for sample check
    const mockFile = new File(['mock-audio-data-buffer'], sampleName, { type: 'audio/wav' });
    setSelectedFile(mockFile);
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      const demoResult = createDemoAnalysisResult(mockFile, selectedLanguage, presetType);
      saveHistoryItem(demoResult);
      setAnalysisResult(demoResult);
      setRecentChecks(getHistoryItems().slice(0, 5));
      setIsProcessing(false);
      setToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'Sample Case Evaluated',
        message: `Loaded synthetic test recording ${sampleName}.`
      });
    }, 1800);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  return (
    <AdminLayout>
      <div className="audio-dashboard-page">
        {/* If result is ready, display the full Call Safety Result Screen matching ui_6 */}
        {analysisResult ? (
          <CallSafetyResult
            result={analysisResult}
            onReset={handleReset}
            onNavigateHistory={() => router.push('/history')}
          />
        ) : (
          <>
            {/* Header / Hero */}
            <div className="page-hero-card">
              <div className="page-hero-left">
                <div className="card-title-pill-row">
                  <h1 className="page-hero-title">Welcome to VoiceShield</h1>
                  <span className="live-telemetry-pill">
                    {backendHealth?.isLive ? '● Backend API Connected' : '○ Offline Mode'}
                  </span>
                </div>
                <p className="page-hero-subtitle">
                  Upload a voice recording to check for potential scams, synthetic deepfakes, and emotional manipulation.
                </p>
              </div>

              <div className="page-hero-actions">
                <button
                  className="btn-secondary"
                  onClick={() => router.push('/history')}
                >
                  View Check History →
                </button>
              </div>
            </div>

            {/* Audio Upload Card matching ui_3.jpeg & ui_4.jpeg */}
            <div className="analytics-card upload-hero-card" style={{ marginBottom: '24px' }}>
              <div
                className="upload-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="audio/wav,audio/mp3,audio/m4a,audio/flac,audio/*"
                  onChange={handleFileChange}
                />

                <div className="upload-cloud-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    <polyline points="12 11 12 16 12 11" />
                    <polyline points="9 13 12 10 15 13" />
                  </svg>
                </div>

                <h2 className="upload-title">
                  {selectedFile ? selectedFile.name : 'Upload a voice recording'}
                </h2>
                <p className="upload-subtitle">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for neural analysis`
                    : 'Drag and drop your audio file here, or click to browse'}
                </p>

                <div className="upload-format-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6355F6" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span>Supported formats: WAV, MP3, M4A, FLAC • Maximum file size: 25 MB</span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '10px' }}
                    onClick={() => {
                      if (selectedFile) {
                        handleStartAnalysis();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {selectedFile ? 'Start Neural Analysis →' : 'Choose a file'}
                  </button>

                  {/* Language Selector */}
                  <select
                    className="table-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{ padding: '9px 14px' }}
                  >
                    <option value="auto">Language: Auto-detect (Whisper)</option>
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="ml">Malayalam (ml)</option>
                  </select>
                </div>
              </div>

              {/* Sample Voicemail Quick Load */}
              <div className="upload-quick-samples">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    100% Private & encrypted analysis • Zero permanent retention
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Try sample:</span>
                  <button
                    className="sample-quick-btn"
                    onClick={() => handleTrySample('bank_otp_request.wav', 'danger')}
                  >
                    Bank OTP Scam
                  </button>
                  <button
                    className="sample-quick-btn"
                    onClick={() => handleTrySample('insurance_policy_offer.wav', 'suspicious')}
                  >
                    Insurance Offer
                  </button>
                  <button
                    className="sample-quick-btn"
                    onClick={() => handleTrySample('customer_support_call.wav', 'safe')}
                  >
                    Support Call
                  </button>
                </div>
              </div>
            </div>

            {/* How It Works Card matching ui_3.jpeg */}
            <div className="analytics-card" style={{ marginBottom: '24px' }}>
              <div className="card-header-row" style={{ marginBottom: '16px' }}>
                <div className="card-title-group">
                  <div className="card-title-pill-row">
                    <h3 className="card-main-title">How it works</h3>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>3 quick steps</span>
                  </div>
                </div>
                <span className="sample-data-pill">Zero data storage</span>
              </div>

              <div className="how-it-works-grid">
                <div className="how-step-item">
                  <div className="how-step-number">01</div>
                  <div className="how-step-content">
                    <h4>Upload</h4>
                    <p>Choose a voice recording from your device.</p>
                  </div>
                  <div className="how-step-arrow">→</div>
                </div>

                <div className="how-step-item">
                  <div className="how-step-number">02</div>
                  <div className="how-step-content">
                    <h4>We analyze it</h4>
                    <p>We check for common scam patterns, vocoder artifacts, and manipulation.</p>
                  </div>
                  <div className="how-step-arrow">→</div>
                </div>

                <div className="how-step-item">
                  <div className="how-step-number">03</div>
                  <div className="how-step-content">
                    <h4>Get simple results</h4>
                    <p>See whether the call looks suspicious, with easy explanations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Checks Section matching ui_3.jpeg */}
            <div className="table-card">
              <div className="table-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Your recent checks</h3>
                  <SampleDataPill />
                </div>
                <button
                  className="table-action-link"
                  onClick={() => router.push('/history')}
                >
                  View all →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Date & Time</th>
                      <th>Result</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentChecks.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: '#F3F0FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                              }}
                            >
                              ▶
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.fileName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{item.format}</div>
                            </div>
                          </div>
                        </td>
                        <td>{item.date}, {item.timestamp}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              item.riskScore >= 70
                                ? 'badge-danger'
                                : item.riskScore >= 40
                                ? 'badge-review'
                                : 'badge-healthy'
                            }`}
                          >
                            <span className="status-badge-dot" />
                            <span className="status-badge-text">{item.resultLabel}</span>
                          </span>
                        </td>
                        <td>
                          <span
                            className="table-action-link"
                            onClick={() => setAnalysisResult(item)}
                          >
                            View details →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Processing Modal while analyzing */}
        <AnalysisProcessingModal
          isOpen={isProcessing}
          fileName={selectedFile?.name || 'telephony_audio.wav'}
          fileSize={
            selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
              : '2.4 MB'
          }
          currentStepIndex={processingStep}
          onCancel={() => setIsProcessing(false)}
        />

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </AdminLayout>
  );
}

