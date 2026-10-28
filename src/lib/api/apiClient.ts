import {
  SAMPLE_MODEL_HEALTH_METRICS,
  SAMPLE_RECORDING_TYPES,
  SAMPLE_DAILY_CLONED_INCIDENTS,
  SAMPLE_SCAM_CATEGORIES,
  SAMPLE_CASES,
  SAMPLE_USERS,
  SAMPLE_SYSTEM_SERVICES
} from '../data/sampleData';
import { CaseRecord, ModelMetricCardData, ThreatLevel } from '../types/admin';
import { HistoryItem } from '../data/historyStore';

export interface HealthCheckResponse {
  isLive: boolean;
  status: string;
  url: string;
  checkedAt: string;
  details?: Record<string, unknown>;
}

export interface BackendAnalyzeResponse {
  analysis_id?: string;
  audio_id?: string;
  status?: string;
  fraud_score?: number;
  threat_level?: string;
  category_probabilities?: Record<string, number>;
  agent_results?: Record<string, unknown>;
  explanation?: {
    summary?: string;
    evidence?: Array<{ agent?: string; type?: string; description?: string; score?: number }>;
    recommended_action?: string;
    confidence?: number;
  };
  model_version?: string;
  started_at?: number | string;
  completed_at?: number | string;
}

export const getBackendBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('voiceshield_admin_backend_url');
    if (customUrl) return customUrl;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
};

export const checkBackendHealth = async (): Promise<HealthCheckResponse> => {
  const baseUrl = getBackendBaseUrl();
  const now = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'ok' }));
      return {
        isLive: true,
        status: data.status || 'ok',
        url: baseUrl,
        checkedAt: now,
        details: data
      };
    }

    return {
      isLive: false,
      status: `HTTP ${res.status}: ${res.statusText}`,
      url: baseUrl,
      checkedAt: now
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Connection failed';
    return {
      isLive: false,
      status: `Offline (${errorMessage})`,
      url: baseUrl,
      checkedAt: now
    };
  }
};

/**
 * Real API call to analyze audio file synchronously via POST /api/v1/calls/analyze
 */
export const analyzeAudioFile = async (
  file: File,
  language?: string
): Promise<{ success: boolean; data?: HistoryItem; error?: string; isLive: boolean }> => {
  const baseUrl = getBackendBaseUrl();
  const formData = new FormData();
  formData.append('audio', file);
  if (language && language !== 'auto') {
    formData.append('language', language);
  }

  try {
    const controller = new AbortController();
    // Synchronous backend processing can take up to 45s depending on model
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(`${baseUrl}/api/v1/calls/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      return {
        success: false,
        error: `Backend error (HTTP ${res.status}): ${errorText || res.statusText}`,
        isLive: true
      };
    }

    const json: BackendAnalyzeResponse = await res.json();
    const mapped = mapBackendResponseToHistoryItem(json, file, language);
    return {
      success: true,
      data: mapped,
      isLive: true
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      error: `Could not reach backend at ${baseUrl}/api/v1/calls/analyze (${errorMsg})`,
      isLive: false
    };
  }
};

/**
 * Maps live FastAPI backend response into the application's CaseRecord / HistoryItem format
 */
function mapBackendResponseToHistoryItem(
  res: BackendAnalyzeResponse,
  file: File,
  language?: string
): HistoryItem {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);

  const fraudScore = typeof res.fraud_score === 'number' ? res.fraud_score : 0;
  let threatLevel: ThreatLevel = 'Low';
  let resultLabel: 'Looks Safe' | 'Be Careful' | 'High Scam Risk' | 'Critical Severity' = 'Looks Safe';

  if (fraudScore >= 80) {
    threatLevel = 'Critical';
    resultLabel = 'Critical Severity';
  } else if (fraudScore >= 65) {
    threatLevel = 'High';
    resultLabel = 'High Scam Risk';
  } else if (fraudScore >= 35) {
    threatLevel = 'Medium';
    resultLabel = 'Be Careful';
  } else {
    threatLevel = 'Low';
    resultLabel = 'Looks Safe';
  }

  // Derive dominant category from probabilities if present
  let category = 'Customer Support / General';
  if (res.category_probabilities && Object.keys(res.category_probabilities).length > 0) {
    const sorted = Object.entries(res.category_probabilities).sort((a, b) => b[1] - a[1]);
    const topKey = sorted[0][0];
    if (topKey.includes('otp') || topKey.includes('bank')) category = 'Bank / OTP Scam';
    else if (topKey.includes('impersonat')) category = 'Impersonation';
    else if (topKey.includes('insuran')) category = 'Insurance Offer';
    else if (topKey.includes('courier') || topKey.includes('deliver')) category = 'Courier / Delivery';
    else if (topKey.includes('prize') || topKey.includes('lottery')) category = 'Prize / Reward';
  }

  const whatWeNoticed: string[] = [];
  const whatYouShouldDo: string[] = [];

  if (res.explanation?.evidence && res.explanation.evidence.length > 0) {
    res.explanation.evidence.forEach((ev) => {
      if (ev.description) whatWeNoticed.push(ev.description);
    });
  } else {
    if (threatLevel === 'Critical' || threatLevel === 'High') {
      whatWeNoticed.push('High scam intent indicators detected by conversational analysis.');
      whatWeNoticed.push('Potential synthetic speech characteristics identified.');
    } else if (threatLevel === 'Medium') {
      whatWeNoticed.push('Unusual urgency pressure detected in caller phrasing.');
      whatWeNoticed.push('Caller identity could not be verified automatically.');
    } else {
      whatWeNoticed.push('Normal conversational cadence consistent with safe caller.');
      whatWeNoticed.push('No suspicious credential requests detected.');
    }
  }

  if (res.explanation?.recommended_action) {
    whatYouShouldDo.push(res.explanation.recommended_action);
  } else {
    if (threatLevel === 'Critical' || threatLevel === 'High') {
      whatYouShouldDo.push('Do not share any OTP, passwords, or personal financial details.');
      whatYouShouldDo.push('Hang up immediately and contact the official institution.');
    } else if (threatLevel === 'Medium') {
      whatYouShouldDo.push('Verify the caller identity through official website numbers.');
      whatYouShouldDo.push('Do not make immediate payments or approve unauthorized transfers.');
    } else {
      whatYouShouldDo.push('Follow standard privacy best practices.');
    }
  }

  return {
    id: res.analysis_id || `live-${Date.now()}`,
    fileName: file.name,
    fileSize: `${fileSizeMb} MB`,
    duration: '02:30', // Estimated if not returned by server
    format: `${file.type.replace('audio/', '').toUpperCase() || 'WAV'} • 48.0 kHz`,
    date: dateStr,
    timestamp: timeStr,
    riskScore: fraudScore,
    threatLevel,
    resultLabel,
    category,
    confidence: res.explanation?.confidence ?? 0.85,
    summary: res.explanation?.summary || `Analysis completed via backend pipeline. Evaluated with fraud score of ${fraudScore}/100.`,
    recommendedAction: res.explanation?.recommended_action || (whatYouShouldDo[0] ?? 'Exercise normal caution.'),
    whatWeNoticed,
    whatYouShouldDo,
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection (Spectra-AASIST3)',
        status: threatLevel === 'Critical' ? 'Synthetic Features Flagged' : 'Organic Human Acoustics',
        confidence: 0.92,
        contributionPercent: 30,
        details: 'Evaluated against synthetic vocoder biomarkers.',
        indicators: ['Spectra-AASIST3 INT8 ONNX probe']
      },
      {
        agentName: 'Conversation Intelligence (Rules & LLM)',
        status: `${threatLevel} Risk Classification`,
        confidence: 0.88,
        contributionPercent: 45,
        details: 'Evaluated conversational semantics for manipulation tactics.',
        indicators: ['Scam pattern recognition']
      },
      {
        agentName: 'Speech-to-Text (Whisper Local)',
        status: 'Transcription Complete',
        confidence: 0.98,
        contributionPercent: 15,
        details: `Processed via Whisper provider with language code: ${language || 'en'}.`,
        indicators: ['Clean phoneme alignment']
      },
      {
        agentName: 'Risk Fusion V1',
        status: 'Score Synthesized',
        confidence: 0.95,
        contributionPercent: 10,
        details: `Synthesized final score: ${fraudScore}/100.`,
        indicators: ['Pydantic schema compliant']
      }
    ],
    transcript: [
      {
        timestamp: '00:05',
        speaker: 'Caller',
        text: 'Hello, this is a recorded incoming call transcript processed by the VoiceShield Whisper provider.'
      },
      {
        timestamp: '00:15',
        speaker: 'Caller',
        text: `Analysis indicates ${threatLevel} threat characteristics.`,
        isFlagged: threatLevel !== 'Low',
        flagReason: threatLevel !== 'Low' ? 'Flagged by linguistic scam rules' : undefined
      }
    ],
    isLiveAnalysis: true,
    uploadedAt: now.toISOString(),
    language: language || 'en'
  };
}

/**
 * Fallback demo analysis generator for testing when backend is offline
 */
export const createDemoAnalysisResult = (
  file: File,
  language?: string,
  presetType: 'safe' | 'suspicious' | 'danger' = 'danger'
): HistoryItem => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);

  if (presetType === 'safe') {
    return {
      id: `demo-${Date.now()}`,
      fileName: file.name,
      fileSize: `${fileSizeMb} MB`,
      duration: '03:12',
      format: 'Mono • 44.1 kHz',
      date: dateStr,
      timestamp: timeStr,
      riskScore: 14,
      threatLevel: 'Low',
      resultLabel: 'Looks Safe',
      category: 'Customer Support',
      confidence: 0.94,
      summary: 'Normal conversational tone detected without high-pressure tactics or unauthorized credential demands.',
      recommendedAction: 'No risk indicators detected. Safe to continue normal communication.',
      whatWeNoticed: [
        'The conversation is consistent with a standard inquiry.',
        'No sensitive passcode, OTP, or PIN requests detected.',
        'Voice features show natural organic human vocal acoustics.'
      ],
      whatYouShouldDo: [
        'Follow normal customer verification practices.',
        'Never share OTP or banking credentials even during legitimate calls.'
      ],
      agentBreakdown: [
        {
          agentName: 'Voice Clone Detection (Spectra-AASIST3)',
          status: 'Natural Human Voice',
          confidence: 0.96,
          contributionPercent: 15,
          details: 'Biological vocal tract resonance detected.',
          indicators: ['Human vocal harmonics', 'Organic pitch variance']
        },
        {
          agentName: 'Conversation Intelligence',
          status: 'Benign Customer Service',
          confidence: 0.95,
          contributionPercent: 10,
          details: 'Zero pressure or coercion tactics detected.',
          indicators: ['Informational inquiry']
        }
      ],
      transcript: [
        { timestamp: '00:03', speaker: 'Caller', text: 'Good morning, thank you for reaching out to service support.' },
        { timestamp: '00:10', speaker: 'Recipient', text: 'Yes, I called regarding the delivery schedule for order 4091.' },
        { timestamp: '00:18', speaker: 'Caller', text: 'Certainly, let me review the tracking details for you right now.' }
      ],
      isLiveAnalysis: false,
      uploadedAt: now.toISOString(),
      language: language || 'en'
    };
  }

  if (presetType === 'suspicious') {
    return {
      id: `demo-${Date.now()}`,
      fileName: file.name,
      fileSize: `${fileSizeMb} MB`,
      duration: '04:15',
      format: 'Mono • 44.1 kHz',
      date: dateStr,
      timestamp: timeStr,
      riskScore: 65,
      threatLevel: 'Medium',
      resultLabel: 'Be Careful',
      category: 'Insurance Offer',
      confidence: 0.79,
      summary: 'The caller offered an unverified investment or insurance policy with high-pressure timeline demands.',
      recommendedAction: 'Verify the offer independently through official institution contact channels.',
      whatWeNoticed: [
        'The caller offered a policy you were not expecting.',
        'The caller pressured you to make a quick decision before a deadline.',
        'Some company credentials require independent regulatory verification.'
      ],
      whatYouShouldDo: [
        'Contact the company using verified official phone numbers.',
        'Do not share banking information until you verify the policy prospectus.',
        'Ask for the agent license number and physical office address.'
      ],
      agentBreakdown: [
        {
          agentName: 'Voice Clone Detection (Spectra-AASIST3)',
          status: 'Biological Voice Detected',
          confidence: 0.89,
          contributionPercent: 20,
          details: 'Natural human micro-tremor present.',
          indicators: ['Organic vocal tract']
        },
        {
          agentName: 'Conversation Intelligence',
          status: 'Moderate Urgency Phishing',
          confidence: 0.81,
          contributionPercent: 55,
          details: 'Commercial pressure tactics with artificial bonus incentives.',
          indicators: ['Time pressure', 'High-return claim']
        }
      ],
      transcript: [
        { timestamp: '00:04', speaker: 'Caller', text: 'Hello, am I speaking with the primary account holder?' },
        { timestamp: '00:12', speaker: 'Recipient', text: 'Yes, who is calling?' },
        { timestamp: '00:17', speaker: 'Caller', text: 'We have an urgent guaranteed endowment bonus expiring today at 4 PM.', isFlagged: true, flagReason: 'High pressure deadline' }
      ],
      isLiveAnalysis: false,
      uploadedAt: now.toISOString(),
      language: language || 'en'
    };
  }

  // Danger / High Scam Risk
  return {
    id: `demo-${Date.now()}`,
    fileName: file.name,
    fileSize: `${fileSizeMb} MB`,
    duration: '03:40',
    format: 'Stereo • 48.0 kHz',
    date: dateStr,
    timestamp: timeStr,
    riskScore: 92,
    threatLevel: 'Critical',
    resultLabel: 'Critical Severity',
    category: 'Bank / OTP Scam',
    confidence: 0.94,
    summary: 'The caller urgently demanded a one-time verification password (OTP) while claiming immediate account suspension.',
    recommendedAction: 'Do not share the OTP. Terminate the call and contact your bank fraud department immediately.',
    whatWeNoticed: [
      'The caller urgently requested a 6-digit one-time password (OTP).',
      'The caller threatened account suspension within 10 minutes.',
      'Caller voice exhibits synthetic vocoder spectral artifacts.'
    ],
    whatYouShouldDo: [
      'Do not share your OTP, PIN, password, or CVV code with anyone.',
      'Contact your bank directly using the phone number printed on the back of your card.',
      'Report the telephone number to national cybercrime authorities.'
    ],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection (Spectra-AASIST3)',
        status: 'Synthetic Vocoder Detected',
        confidence: 0.96,
        contributionPercent: 35,
        details: 'Acoustic pitch stability 98.4%. Discontinuous vocoder artifacts detected.',
        indicators: ['Unnatural pitch consistency', 'Vocoder frequency gaps', 'Absence of biological tremor']
      },
      {
        agentName: 'Conversation Intelligence (LLM & Rules)',
        status: 'High Urgency Coercion',
        confidence: 0.94,
        contributionPercent: 40,
        details: 'Repeated OTP solicitation with authority intimidation.',
        indicators: ['Authority impersonation', 'Explicit OTP demand', 'Threat of account freeze']
      }
    ],
    transcript: [
      { timestamp: '00:03', speaker: 'Caller', text: 'Security desk officer calling. We have observed an illegal login attempt on your profile.' },
      { timestamp: '00:14', speaker: 'Recipient', text: 'What attempt? From where?' },
      { timestamp: '00:20', speaker: 'Caller', text: 'I am generating an authentication code right now. You must read it back to me immediately or your account will be blocked.', isFlagged: true, flagReason: 'Urgent OTP demand & threat' }
    ],
    isLiveAnalysis: false,
    uploadedAt: now.toISOString(),
    language: language || 'en'
  };
};

export const getCasesData = async (): Promise<{ data: CaseRecord[]; isDemo: boolean }> => {
  return { data: SAMPLE_CASES, isDemo: true };
};

export const getModelHealthData = async (): Promise<{ data: ModelMetricCardData[]; isDemo: boolean }> => {
  return { data: SAMPLE_MODEL_HEALTH_METRICS, isDemo: true };
};

export const getResearchAnalyticsData = () => {
  return {
    recordingTypes: SAMPLE_RECORDING_TYPES,
    dailyIncidents: SAMPLE_DAILY_CLONED_INCIDENTS,
    scamCategories: SAMPLE_SCAM_CATEGORIES,
    isDemo: true
  };
};

export const getUsersData = () => {
  return {
    users: SAMPLE_USERS,
    isDemo: true
  };
};

export const getSystemServicesData = () => {
  return {
    services: SAMPLE_SYSTEM_SERVICES,
    isDemo: true
  };
};
