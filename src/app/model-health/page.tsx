'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ModelHealthCards } from '@/components/analytics/ModelHealthCards';
import {
  SAMPLE_MODEL_HEALTH_METRICS,
  SAMPLE_SYSTEM_SERVICES
} from '@/lib/data/sampleData';
import { SampleDataPill } from '@/components/common/SampleDataPill';
import { Badge } from '@/components/common/Badge';
import { checkBackendHealth, HealthCheckResponse } from '@/lib/api/apiClient';

export default function ModelHealthPage() {
  const [probeResult, setProbeResult] = useState<HealthCheckResponse | null>(null);
  const [isProbing, setIsProbing] = useState(false);

  const handleProbeBackend = async () => {
    setIsProbing(true);
    try {
      const res = await checkBackendHealth();
      setProbeResult(res);
    } catch {
      setProbeResult({
        isLive: false,
        status: 'Offline / Network Blocked',
        url: 'http://localhost:8000',
        checkedAt: new Date().toISOString()
      });
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="model-health-page">
        {/* Header Hero Card */}
        <div className="page-hero-card">
          <div className="page-hero-left">
            <div className="card-title-pill-row">
              <h1 className="page-hero-title">Model Health & Neural Telemetry</h1>
              <SampleDataPill />
            </div>
            <p className="page-hero-subtitle">
              Inspect neural acoustic inference providers, calibration boundaries, and backend infrastructure probes.
            </p>
          </div>

          <div className="page-hero-actions">
            <button
              className="btn-primary"
              onClick={handleProbeBackend}
              disabled={isProbing}
            >
              {isProbing ? 'Probing...' : '⚡ Probe Live Backend'}
            </button>
          </div>
        </div>

        {/* Live Backend Probe Result Banner */}
        {probeResult && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              backgroundColor: probeResult.isLive ? '#ECFDF5' : '#FFFBEB',
              border: `1px solid ${probeResult.isLive ? '#A7F3D0' : '#FDE68A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: probeResult.isLive ? '#065F46' : '#92400E' }}>
                  {probeResult.isLive ? '✓ Backend Gateway Reachable' : 'ℹ️ Live Backend Offline (Sample Mode Active)'}
                </span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  Tested at {new Date(probeResult.checkedAt).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: probeResult.isLive ? '#047857' : '#78350F' }}>
                {probeResult.isLive
                  ? `FastAPI responded successfully on ${probeResult.url}/health with status: "${probeResult.status}".`
                  : `Could not reach ${probeResult.url}/health. Operating in honest offline mode with documented demo telemetry.`}
              </p>
            </div>
            <button
              style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--primary)' }}
              onClick={() => setProbeResult(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Core Neural Model Metrics */}
        <div style={{ marginBottom: '28px' }}>
          <div className="section-header-row">
            <div className="section-header-title-group">
              <h2 className="section-title">Active Inference Providers</h2>
              <SampleDataPill />
            </div>
            <span className="section-subtitle-telemetry">
              Calibrated on production v4.18 neural inference edge
            </span>
          </div>

          <ModelHealthCards metrics={SAMPLE_MODEL_HEALTH_METRICS} />
        </div>

        {/* Section 2: Detailed Architectural Contract */}
        <div className="table-card" style={{ marginBottom: '28px' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Neural Agent Specifications & Resource Allocations</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Configured models according to MASTER_ARCHITECTURE-1.md and GPU_EXECUTION_STRATEGY-1.md
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Neural Provider</th>
                  <th>Framework / Checkpoint</th>
                  <th>Memory / VRAM</th>
                  <th>Languages</th>
                  <th>Latency</th>
                  <th>Calibration State</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Speech-to-Text</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Whisper Local Provider</div>
                  </td>
                  <td>Whisper-small (244M params)</td>
                  <td>0.91 GB FP32 / 0.23 GB INT8</td>
                  <td>EN / HI / ML</td>
                  <td>~1,200 ms</td>
                  <td>
                    <Badge status="Optimal" variant="healthy" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Voice Clone Detection</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Spectra-AASIST3 ONNX</div>
                  </td>
                  <td>WavLM-Base + Anti-spoof head</td>
                  <td>0.18 GB FP16 / 0.09 GB INT8</td>
                  <td>Acoustic (Universal)</td>
                  <td>~420 ms</td>
                  <td>
                    <span className="status-badge badge-purple">
                      <span className="status-badge-dot" />
                      <span className="status-badge-text">Uncalibrated (Score-only)</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Scam Pattern Detection</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deterministic Rules + LLM</div>
                  </td>
                  <td>services/scam_rules.py + OpenRouter</td>
                  <td>0.20 GB memory</td>
                  <td>Bilingual EN / HI</td>
                  <td>~850 ms</td>
                  <td>
                    <Badge status="Needs Review" variant="review" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Risk Fusion Engine</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Multi-agent fusion V1</div>
                  </td>
                  <td>Pydantic / Rules-based orchestrator</td>
                  <td>Ephemeral RAM</td>
                  <td>Language-agnostic</td>
                  <td>~65 ms</td>
                  <td>
                    <Badge status="Healthy" variant="healthy" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Underlying Platform Services Status */}
        <div className="table-card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Underlying Platform Infrastructure Services</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Core database, cache, and vector storage components (as defined in SYSTEM_ARCHITECTURE.md)
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Port / DSN</th>
                  <th>Health Status</th>
                  <th>Ping Latency</th>
                  <th>Version</th>
                  <th>Role & Verification Notes</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_SYSTEM_SERVICES.map((s) => (
                  <tr key={s.name}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.component}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>:{s.port}</td>
                    <td>
                      <Badge status="Online" variant="healthy" />
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{s.latencyMs} ms</td>
                    <td style={{ fontSize: '12.5px' }}>{s.version}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

