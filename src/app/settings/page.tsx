'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DEFAULT_ADMIN_SETTINGS } from '@/lib/data/sampleData';
import { AdminSettingsConfig } from '@/lib/types/admin';
import { SampleDataPill } from '@/components/common/SampleDataPill';
import { Toast, ToastMessage } from '@/components/common/Toast';
import { checkBackendHealth } from '@/lib/api/apiClient';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettingsConfig>(DEFAULT_ADMIN_SETTINGS);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('voiceshield_admin_settings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('voiceshield_admin_settings', JSON.stringify(settings));
      localStorage.setItem('voiceshield_admin_backend_url', settings.backendUrl);
    }
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Settings Saved Successfully',
      message: 'Configuration parameters applied to this admin session.'
    });
  };

  const handleTestBackend = async () => {
    setIsTesting(true);
    try {
      const res = await checkBackendHealth();
      if (res.isLive) {
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Backend Gateway Connected',
          message: `Endpoint ${res.url} responded with status: "${res.status}".`
        });
      } else {
        setToast({
          id: Date.now().toString(),
          type: 'warning',
          title: 'Backend Endpoint Unreachable',
          message: `Could not reach ${settings.backendUrl}. Platform using documented sample telemetry.`
        });
      }
    } catch {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Connection Test Error',
        message: 'Could not contact target backend.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="settings-page">
        {/* Header Hero Card */}
        <div className="page-hero-card">
          <div className="page-hero-left">
            <div className="card-title-pill-row">
              <h1 className="page-hero-title">Admin Settings</h1>
              <SampleDataPill />
            </div>
            <p className="page-hero-subtitle">
              Configure backend API endpoints, neural inference execution modes, and security alert thresholds.
            </p>
          </div>

          <div className="page-hero-actions">
            <button
              className="btn-secondary"
              type="button"
              onClick={handleTestBackend}
              disabled={isTesting}
            >
              {isTesting ? 'Testing...' : 'Test Backend Connection'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Card 1: Backend & API Integration */}
          <div className="analytics-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Backend API & Cluster Integration
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Configured endpoint as defined in VoiceShield_Developer-B_WebApp_Spec.md
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  FastAPI Backend Base URL
                </label>
                <input
                  type="text"
                  value={settings.backendUrl}
                  onChange={(e) => setSettings({ ...settings, backendUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                  Default local endpoint: http://localhost:8000
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Active API Secret Key
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-card)',
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'monospace',
                      fontSize: '13px'
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setSettings({
                        ...settings,
                        apiKey: `vs_live_sec_${Math.random().toString(36).substring(2, 12)}`
                      });
                      setToast({
                        id: Date.now().toString(),
                        type: 'info',
                        title: 'Demo Key Rotated',
                        message: 'New sample API token generated.'
                      });
                    }}
                  >
                    Rotate
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                  Rate limit: 100 requests per minute
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Neural Inference & Execution Strategy */}
          <div className="analytics-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Neural Execution Strategy (GPU_EXECUTION_STRATEGY-1.md)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Control orchestrator resource bounds for local and cloud inference nodes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Inference Mode (INFERENCE_MODE)
                </label>
                <select
                  value={settings.inferenceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inferenceMode: e.target.value as 'sequential' | 'parallel'
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '13px'
                  }}
                >
                  <option value="sequential">sequential (Default — safe on CPU / 6GB VRAM)</option>
                  <option value="parallel">parallel (Requires verified VRAM headroom &gt; 12GB)</option>
                </select>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                  Loads one neural model at a time and unloads before the next.
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Voice Clone Provider
                </label>
                <select
                  value={settings.voiceCloneProvider}
                  onChange={(e) => setSettings({ ...settings, voiceCloneProvider: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '13px'
                  }}
                >
                  <option value="spectra_aasist3_int8">spectra_aasist3_int8 (AASIST3 INT8 ONNX)</option>
                  <option value="wavlm_synthetic_head">wavlm_synthetic_head (WavLM Anti-spoof V3)</option>
                  <option value="mock_voiceclone">mock_voiceclone (Local test stub)</option>
                </select>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                  Active setting: VOICE_CLONE_PROVIDER
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Threat Detection Thresholds */}
          <div className="analytics-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Risk Scoring & Scam Alert Thresholds
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Define boundary scores for automated scam warnings and severity classifications (0-100 index).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Critical Severity Threshold (Score ≥)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.criticalThreshold}
                  onChange={(e) => setSettings({ ...settings, criticalThreshold: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  High Scam Risk Threshold (Score ≥)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.highThreshold}
                  onChange={(e) => setSettings({ ...settings, highThreshold: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Warning / Review Threshold (Score ≥)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.warningThreshold}
                  onChange={(e) => setSettings({ ...settings, warningThreshold: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Security & Privacy Policies */}
          <div className="analytics-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Data Privacy & Ephemeral Retention
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enforce strict zero-retention policies for recorded audio buffers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
                <input
                  type="checkbox"
                  checked={settings.redactPii}
                  onChange={(e) => setSettings({ ...settings, redactPii: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Automatically redact PII (credit cards, names, OTPs) from stored transcripts</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
                <input
                  type="checkbox"
                  checked={settings.telemetryAnonymization}
                  onChange={(e) => setSettings({ ...settings, telemetryAnonymization: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Anonymize acoustic spectrogram features in research telemetry exports</span>
              </label>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSettings(DEFAULT_ADMIN_SETTINGS)}
            >
              Reset to Defaults
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </AdminLayout>
  );
}

