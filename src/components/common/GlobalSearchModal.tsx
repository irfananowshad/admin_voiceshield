import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_CASES, SAMPLE_USERS, SAMPLE_MODEL_HEALTH_METRICS } from '@/lib/data/sampleData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase?: (caseId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCase
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation pages matching Admin Portal
  const pages = [
    { title: 'Overview', path: '/overview', desc: 'Research analytics and model telemetry' },
    { title: 'Dashboard', path: '/dashboard', desc: 'Upload audio recording and analyze scams' },
    { title: 'History', path: '/history', desc: 'View past analyzed recordings and safety scores' },
    { title: 'Settings', path: '/settings', desc: 'API keys, inference mode, and alert thresholds' },
    { title: 'Model Health', path: '/model-health', desc: 'Detailed neural specs & infrastructure status' }
  ].filter((p) => !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

  // Cases filtered
  const filteredCases = SAMPLE_CASES.filter(
    (c) =>
      !q ||
      c.fileName.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  );

  // Models filtered
  const filteredModels = SAMPLE_MODEL_HEALTH_METRICS.filter(
    (m) =>
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.subtitle.toLowerCase().includes(q)
  );

  // Users filtered
  const filteredUsers = SAMPLE_USERS.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
  );

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleCaseClick = (caseId: string) => {
    if (onSelectCase) {
      onSelectCase(caseId);
      onClose();
    } else {
      router.push('/history');
      onClose();
    }
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search spectrograms, cases, users, models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-modal-esc" onClick={onClose}>ESC</span>
        </div>

        <div className="search-modal-results">
          {pages.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Navigation Pages</div>
              {pages.map((p) => (
                <div
                  key={p.path}
                  className="search-item"
                  onClick={() => navigateTo(p.path)}
                >
                  <div className="search-item-icon">⚡</div>
                  <div className="search-item-info">
                    <span className="search-item-title">{p.title}</span>
                    <span className="search-item-sub">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCases.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Audio Cases & Recordings</div>
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="search-item"
                  onClick={() => handleCaseClick(c.id)}
                >
                  <div className="search-item-icon">🎙️</div>
                  <div className="search-item-info">
                    <div className="search-item-title-row">
                      <span className="search-item-title">{c.fileName}</span>
                      <span className={`risk-tag risk-${c.threatLevel.toLowerCase()}`}>
                        {c.riskScore}/100 • {c.resultLabel}
                      </span>
                    </div>
                    <span className="search-item-sub">{c.category} • {c.duration} • {c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredModels.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Neural Models & Telemetry</div>
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  className="search-item"
                  onClick={() => navigateTo('/model-health')}
                >
                  <div className="search-item-icon">🧠</div>
                  <div className="search-item-info">
                    <div className="search-item-title-row">
                      <span className="search-item-title">{m.title}</span>
                      <span className="search-item-badge">{m.accuracyFormatted} • {m.status}</span>
                    </div>
                    <span className="search-item-sub">{m.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Team Members & Analysts</div>
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="search-item"
                  onClick={() => navigateTo('/users')}
                >
                  <div className="search-item-icon">👤</div>
                  <div className="search-item-info">
                    <div className="search-item-title-row">
                      <span className="search-item-title">{u.name}</span>
                      <span className="search-item-badge">{u.role}</span>
                    </div>
                    <span className="search-item-sub">{u.email} • {u.department}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pages.length === 0 && filteredCases.length === 0 && filteredModels.length === 0 && filteredUsers.length === 0 && (
            <div className="search-empty">
              No matching cases, spectrograms, or records found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
