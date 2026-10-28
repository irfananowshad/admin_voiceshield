import {
  ModelMetricCardData,
  RecordingTypeData,
  DailyClonedIncidentData,
  ScamCategoryData,
  CaseRecord,
  AdminUser,
  NotificationItem,
  SystemServiceStatus,
  AdminSettingsConfig
} from '../types/admin';

export const SAMPLE_MODEL_HEALTH_METRICS: ModelMetricCardData[] = [
  {
    id: 'stt',
    title: 'Speech-to-Text',
    subtitle: 'Transcription accuracy',
    status: 'Healthy',
    statusLabel: 'Healthy',
    accuracy: 98,
    accuracyFormatted: '98%',
    varianceLabel: 'Nominal (>95%)',
    varianceType: 'nominal',
    progressPercent: 98,
    updatedTime: 'Updated 10m ago',
    icon: 'audio'
  },
  {
    id: 'voice-clone',
    title: 'Voice Clone Detection',
    subtitle: 'Detection accuracy',
    status: 'Healthy',
    statusLabel: 'Healthy',
    accuracy: 96,
    accuracyFormatted: '96%',
    varianceLabel: 'Optimal tier',
    varianceType: 'optimal',
    progressPercent: 96,
    updatedTime: 'Updated 15m ago',
    icon: 'waveform'
  },
  {
    id: 'scam-pattern',
    title: 'Scam Pattern Detection',
    subtitle: 'Pattern recognition accuracy',
    status: 'Needs Review',
    statusLabel: 'Needs Review',
    accuracy: 89,
    accuracyFormatted: '89%',
    varianceLabel: 'Variance -3.2%',
    varianceType: 'warning',
    progressPercent: 89,
    updatedTime: 'Updated 1h ago',
    icon: 'shield'
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    subtitle: 'Overall classification accuracy',
    status: 'Healthy',
    statusLabel: 'Healthy',
    accuracy: 92,
    accuracyFormatted: '92%',
    varianceLabel: 'Standard SLA',
    varianceType: 'sla',
    progressPercent: 92,
    updatedTime: 'Updated 25m ago',
    icon: 'gauge'
  }
];

export const SAMPLE_RECORDING_TYPES: RecordingTypeData[] = [
  {
    category: 'Customer Support Calls',
    count: 1240,
    percentage: 88.5,
    color: '#5542F6'
  },
  {
    category: 'Insurance Offers',
    count: 980,
    percentage: 70.0,
    color: '#6E5CE7'
  },
  {
    category: 'Bank / OTP Calls',
    count: 760,
    percentage: 54.3,
    color: '#8B74FC'
  },
  {
    category: 'Courier / Delivery Calls',
    count: 540,
    percentage: 38.5,
    color: '#A996FD'
  },
  {
    category: 'Prize / Reward Calls',
    count: 420,
    percentage: 30.0,
    color: '#C6B8FE'
  },
  {
    category: 'Other (Miscellaneous)',
    count: 310,
    percentage: 22.1,
    color: '#DFD8FE'
  }
];

export const SAMPLE_DAILY_CLONED_INCIDENTS: DailyClonedIncidentData[] = [
  { date: '2026-10-21', displayDate: 'Oct 21', count: 9 },
  { date: '2026-10-22', displayDate: 'Oct 22', count: 13 },
  { date: '2026-10-23', displayDate: 'Oct 23', count: 10 },
  { date: '2026-10-24', displayDate: 'Oct 24', count: 15 },
  { date: '2026-10-25', displayDate: 'Oct 25', count: 18 },
  { date: '2026-10-26', displayDate: 'Oct 26', count: 22 },
  { date: '2026-10-27', displayDate: 'Oct 27', count: 16 }
];

export const SAMPLE_SCAM_CATEGORIES: ScamCategoryData[] = [
  { category: 'Bank / OTP Scam', count: 68, color: '#5542F6' },
  { category: 'Impersonation', count: 52, color: '#6A56E8' },
  { category: 'Insurance Offer', count: 36, color: '#7E69F0' },
  { category: 'Courier / Delivery', count: 28, color: '#8E77F3' },
  { category: 'Prize / Reward', count: 22, color: '#9E8BF7' },
  { category: 'Other', count: 14, color: '#B3A3F9' }
];

export const SAMPLE_CASES: CaseRecord[] = [
  {
    id: 'case-001',
    fileName: 'bank_otp_request.wav',
    fileSize: '3.4 MB',
    duration: '03:26',
    format: 'Stereo • 48.0 kHz',
    date: 'Oct 26, 2026',
    timestamp: '16:18',
    riskScore: 92,
    threatLevel: 'Critical',
    resultLabel: 'Critical Severity',
    category: 'Bank / OTP Scam',
    confidence: 0.94,
    summary: 'The caller repeatedly requested a 6-digit OTP while impersonating bank risk verification services under threat of urgent account termination.',
    recommendedAction: 'Do not share the OTP. Terminate the call and notify bank fraud operations immediately.',
    whatWeNoticed: [
      'The caller urgently asked for a verification passcode / OTP.',
      'The caller threatened immediate account suspension unless action was taken swiftly.',
      'The caller requested personal identity and account credentials.'
    ],
    whatYouShouldDo: [
      'Do not share your OTP, PIN, password, or card security code.',
      'Contact your bank directly via the phone number printed on the back of your card.',
      'Report the telephone number to national cybercrime reporting portals.'
    ],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection (Spectra-AASIST3)',
        status: 'Synthetic Vocoder Detected',
        confidence: 0.96,
        contributionPercent: 35,
        details: 'Acoustic pitch stability 98.4%. Synthetic vocoder prosody artifacts detected in neural frequency bands.',
        indicators: ['Unnatural pitch distribution', 'Vocoder spectral discontinuity', 'Absence of biological micro-tremor']
      },
      {
        agentName: 'Conversation Intelligence (LLM & Rules)',
        status: 'High Manipulation Urgency',
        confidence: 0.93,
        contributionPercent: 40,
        details: 'Identified authority impersonation, temporal urgency coercions, and explicit one-time code requests.',
        indicators: ['Urgency tactics', 'Bank authority claim', 'Repeated OTP solicitation']
      },
      {
        agentName: 'Speech-to-Text (Whisper Local)',
        status: 'Transcription Complete (EN/HI)',
        confidence: 0.99,
        contributionPercent: 10,
        details: 'High-confidence bilingual speech transcription with phoneme alignment.',
        indicators: ['Lossless phoneme alignment', 'Clear acoustic transcript']
      },
      {
        agentName: 'Threat Intelligence (Qdrant Vectors)',
        status: 'Pattern Match 91.2%',
        confidence: 0.91,
        contributionPercent: 15,
        details: 'Correlated with active nationwide KYC revocation scam campaign registered in knowledge base.',
        indicators: ['Pattern ID #VS-KYC-2026-09', 'Similarity score: 0.912']
      }
    ],
    transcript: [
      { timestamp: '00:04', speaker: 'Caller', text: 'Hello, this is officer Roy from the Central Security and Verification Desk.' },
      { timestamp: '00:12', speaker: 'Victim', text: 'Yes, what is this regarding?' },
      { timestamp: '00:18', speaker: 'Caller', text: 'We have observed suspicious transaction attempts on your account. To prevent total blocking, I need to verify your identity.', isFlagged: true, flagReason: 'Authority impersonation' },
      { timestamp: '00:32', speaker: 'Caller', text: 'I am sending a 6-digit one-time authorization code to your mobile device right now. You must read it back to me immediately or your account will be frozen in 10 minutes.', isFlagged: true, flagReason: 'High pressure urgency & OTP demand' },
      { timestamp: '00:46', speaker: 'Victim', text: 'Wait, my bank told me never to share any OTP with anyone over the phone.' },
      { timestamp: '00:54', speaker: 'Caller', text: 'Madam, this is the security server itself. If you do not share it right now, all your cards will be suspended permanently.', isFlagged: true, flagReason: 'Intimidation and threat coercion' }
    ]
  },
  {
    id: 'case-002',
    fileName: 'insurance_policy_offer.wav',
    fileSize: '4.2 MB',
    duration: '04:30',
    format: 'Mono • 44.1 kHz',
    date: 'Oct 27, 2026',
    timestamp: '11:05',
    riskScore: 65,
    threatLevel: 'Medium',
    resultLabel: 'Be Careful',
    category: 'Insurance Offer',
    confidence: 0.78,
    summary: 'The caller offered an unverified high-yield insurance endowment plan with limited-time subscription requirements.',
    recommendedAction: 'Verify policy documentation independently with the authorized insurer before committing payments.',
    whatWeNoticed: [
      'The caller offered an insurance policy you were not expecting.',
      'The caller encouraged you to act quickly to lock in bonus interest.',
      'Some details of the regulatory underwriting require independent confirmation.'
    ],
    whatYouShouldDo: [
      'Contact the company using its official website or verified toll-free customer support.',
      'Do not share banking information or payment authorizations until you have verified the offer.',
      'Request the agent license number and official prospectus via postal mail or email.'
    ],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection (Spectra-AASIST3)',
        status: 'Biological Human Voice',
        confidence: 0.88,
        contributionPercent: 15,
        details: 'Organic vocal tract resonance and natural micro-tremor detected. Low synthetic probability.',
        indicators: ['Natural acoustic jitter', 'Consistent vocal tract harmonics']
      },
      {
        agentName: 'Conversation Intelligence',
        status: 'Moderate Commercial Pressure',
        confidence: 0.82,
        contributionPercent: 55,
        details: 'High-pressure financial promotion with aggressive timeline constraints.',
        indicators: ['Artificial deadline urgency', 'High return guarantees']
      },
      {
        agentName: 'Threat Intelligence',
        status: 'Unverified Underwriter',
        confidence: 0.65,
        contributionPercent: 30,
        details: 'Matches typical unsolicited cold-calling scripts without registered IRDAI verification.',
        indicators: ['Cold-call lead generation pattern']
      }
    ],
    transcript: [
      { timestamp: '00:03', speaker: 'Caller', text: 'Good morning! Am I speaking with the policyholder?' },
      { timestamp: '00:10', speaker: 'Victim', text: 'Yes, who is this?' },
      { timestamp: '00:15', speaker: 'Caller', text: 'I am calling regarding a special bonus accrued on your lapsed health coverage that qualifies you for an instant 24% tax-free endowment rebate today only.', isFlagged: true, flagReason: 'Unrealistic return & sudden incentive' },
      { timestamp: '00:35', speaker: 'Caller', text: 'We only require your bank debit card number to process the initial token fee before 2:00 PM.', isFlagged: true, flagReason: 'Urgent card credential solicitation' }
    ]
  },
  {
    id: 'case-003',
    fileName: 'customer_support_call.wav',
    fileSize: '2.8 MB',
    duration: '04:12',
    format: 'Mono • 44.1 kHz',
    date: 'Oct 27, 2026',
    timestamp: '14:32',
    riskScore: 12,
    threatLevel: 'Low',
    resultLabel: 'Looks Safe',
    category: 'Customer Support',
    confidence: 0.95,
    summary: 'Standard broadband technical support query troubleshooting router WiFi configuration without suspicious requests.',
    recommendedAction: 'No risk indicators detected. Safe to continue normal service interactions.',
    whatWeNoticed: [
      'The conversation is consistent with a normal customer support call.',
      'No scam warning signs or sensitive credential requests were detected.',
      'Voice characteristics show natural human biological acoustics.'
    ],
    whatYouShouldDo: [
      'Follow normal service instructions.',
      'Never share your password or OTP even during genuine customer support sessions.'
    ],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection',
        status: 'Natural Human Voice',
        confidence: 0.97,
        contributionPercent: 10,
        details: 'Human acoustic biomarkers verified across whole audio stream.',
        indicators: ['Human vocal tract', 'Natural background room reverberation']
      },
      {
        agentName: 'Conversation Intelligence',
        status: 'Benign Customer Service',
        confidence: 0.96,
        contributionPercent: 10,
        details: 'Standard technical troubleshooting dialogue. Zero sensitive data requested.',
        indicators: ['Informational inquiry', 'No pressure tactics']
      }
    ],
    transcript: [
      { timestamp: '00:02', speaker: 'Agent', text: 'Thank you for calling broadband support, my name is Alex. How can I assist you today?' },
      { timestamp: '00:09', speaker: 'Customer', text: 'Hi Alex, our fiber internet connection has been flickering intermittently since this morning.' },
      { timestamp: '00:18', speaker: 'Agent', text: 'I apologize for the inconvenience. Let me check the optical line terminal in your neighborhood to see if there is any scheduled maintenance.' }
    ]
  },
  {
    id: 'case-004',
    fileName: 'courier_update.wav',
    fileSize: '1.9 MB',
    duration: '02:14',
    format: 'Mono • 44.1 kHz',
    date: 'Oct 26, 2026',
    timestamp: '10:21',
    riskScore: 42,
    threatLevel: 'Medium',
    resultLabel: 'Be Careful',
    category: 'Courier / Delivery',
    confidence: 0.72,
    summary: 'Automated notification regarding an undeliverable package requesting redelivery address confirmation through an external link.',
    recommendedAction: 'Verify shipment tracking numbers exclusively on the official courier portal.',
    whatWeNoticed: [
      'Caller claimed a high-value parcel could not be delivered due to missing tax fees.',
      'Requested recipient to click an SMS link to pay an address modification charge.'
    ],
    whatYouShouldDo: [
      'Do not click unknown links sent over SMS.',
      'Check the order tracking ID in the store app where you made the purchase.'
    ],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection',
        status: 'Pre-recorded / Automated TTS',
        confidence: 0.81,
        contributionPercent: 30,
        details: 'Synthetic text-to-speech cadence detected on robotic caller branch.',
        indicators: ['Robotic prosody', 'Monotone pitch trajectory']
      },
      {
        agentName: 'Conversation Intelligence',
        status: 'Suspicious Delivery Fee Phishing',
        confidence: 0.75,
        contributionPercent: 50,
        details: 'Common parcel redelivery fee phishing hook.',
        indicators: ['Urgent redelivery fee', 'External link solicitation']
      }
    ],
    transcript: [
      { timestamp: '00:03', speaker: 'Automated Voice', text: 'Express Logistics Notification: Your package ID 9821 cannot be dispatched due to unpaid customs clearance.' },
      { timestamp: '00:15', speaker: 'Automated Voice', text: 'Please pay the Rs 25 handling fee within 2 hours to avoid return to sender.' }
    ]
  },
  {
    id: 'case-005',
    fileName: 'delivery_call.wav',
    fileSize: '2.1 MB',
    duration: '03:02',
    format: 'Mono • 44.1 kHz',
    date: 'Oct 25, 2026',
    timestamp: '09:40',
    riskScore: 18,
    threatLevel: 'Low',
    resultLabel: 'Looks Safe',
    category: 'Courier / Delivery',
    confidence: 0.91,
    summary: 'Genuine delivery rider confirming gate entry pass and delivery location.',
    recommendedAction: 'Normal delivery interaction.',
    whatWeNoticed: [
      'Normal location coordination.',
      'No personal or financial information requested.'
    ],
    whatYouShouldDo: ['Proceed with standard delivery package receipt.'],
    agentBreakdown: [
      {
        agentName: 'Voice Clone Detection',
        status: 'Natural Human Voice',
        confidence: 0.94,
        contributionPercent: 10,
        details: 'Authentic human voice characteristics with ambient traffic acoustics.',
        indicators: ['Natural ambient environmental acoustics']
      }
    ],
    transcript: [
      { timestamp: '00:03', speaker: 'Rider', text: 'Hello sir, I am at the building security gate with your grocery order.' },
      { timestamp: '00:08', speaker: 'Resident', text: 'Please leave it at the doorstep of flat 402, thank you.' }
    ]
  },
  {
    id: 'case-006',
    fileName: 'prize_offer.wav',
    fileSize: '3.1 MB',
    duration: '04:08',
    format: 'Mono • 44.1 kHz',
    date: 'Oct 24, 2026',
    timestamp: '18:15',
    riskScore: 78,
    threatLevel: 'High',
    resultLabel: 'High Scam Risk',
    category: 'Prize / Reward',
    confidence: 0.89,
    summary: 'Caller claimed user won a luxury sports car lottery in a nationwide telecom sweepstake requiring immediate processing tax payment.',
    recommendedAction: 'Hang up. Legitimate sweepstakes never require advance fee deposits to claim winnings.',
    whatWeNoticed: [
      'Caller announced a massive lottery win for a contest never entered.',
      'Demanded upfront deposit of registration fee into personal UPI handle.'
    ],
    whatYouShouldDo: [
      'Never send advance fees to claim lottery prizes.',
      'Block the caller and report the number.'
    ],
    agentBreakdown: [
      {
        agentName: 'Conversation Intelligence',
        status: 'Advance-Fee Lottery Scam',
        confidence: 0.95,
        contributionPercent: 70,
        details: 'Classic 419 / advance-fee sweepstakes scam pattern.',
        indicators: ['Unsolicited lottery win', 'Advance processing fee', 'UPI deposit request']
      }
    ],
    transcript: [
      { timestamp: '00:05', speaker: 'Caller', text: 'Congratulations! Your mobile SIM number has been selected in the festive mega draw for first prize of 25 Lakh rupees!' },
      { timestamp: '00:18', speaker: 'Victim', text: 'I never entered any lucky draw.' },
      { timestamp: '00:23', speaker: 'Caller', text: 'All active telecom users are automatically included! To release the check, deposit government stamp duty of Rs 4,999 to our registrar ID.', isFlagged: true, flagReason: 'Advance fee fraud requirement' }
    ]
  }
];

export const SAMPLE_USERS: AdminUser[] = [
  {
    id: 'usr-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@voiceshield.ai',
    role: 'Administrator',
    status: 'Active',
    department: 'AI Security & Operations',
    analysesCount: 1842,
    lastActive: 'Just now',
    createdAt: '2026-01-15',
    avatarBg: '#5542F6'
  },
  {
    id: 'usr-002',
    name: 'Vikram Nair',
    email: 'vikram.nair@voiceshield.ai',
    role: 'Analyst',
    status: 'Active',
    department: 'Fraud Investigation Unit',
    analysesCount: 924,
    lastActive: '12m ago',
    createdAt: '2026-03-10',
    avatarBg: '#059669'
  },
  {
    id: 'usr-003',
    name: 'Ananya Patel',
    email: 'ananya.patel@voiceshield.ai',
    role: 'Analyst',
    status: 'Active',
    department: 'Speech Forensics & Neural R&D',
    analysesCount: 715,
    lastActive: '45m ago',
    createdAt: '2026-04-02',
    avatarBg: '#D97706'
  },
  {
    id: 'usr-004',
    name: 'Elena Lopez',
    email: 'elena.lopez@bankingcorp.com',
    role: 'Analyst',
    status: 'Active',
    department: 'Partner Bank Telephony Security',
    analysesCount: 380,
    lastActive: '2h ago',
    createdAt: '2026-06-18',
    avatarBg: '#7C3AED'
  },
  {
    id: 'usr-005',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@enterprise-client.in',
    role: 'End User',
    status: 'Active',
    department: 'Retail Consumer Banking',
    analysesCount: 46,
    lastActive: '1d ago',
    createdAt: '2026-08-11',
    avatarBg: '#2563EB'
  },
  {
    id: 'usr-006',
    name: 'David Miller',
    email: 'david.m@cyberdef.org',
    role: 'Analyst',
    status: 'Pending',
    department: 'Telecom Security Taskforce',
    analysesCount: 0,
    lastActive: 'Never',
    createdAt: '2026-10-24',
    avatarBg: '#64748B'
  },
  {
    id: 'usr-007',
    name: 'Sunita Menon',
    email: 'sunita.menon@auditteam.gov.in',
    role: 'End User',
    status: 'Suspended',
    department: 'External Compliance Observer',
    analysesCount: 14,
    lastActive: '5d ago',
    createdAt: '2026-05-30',
    avatarBg: '#DC2626'
  }
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Risk Incident Flagged',
    message: 'bank_otp_request.wav scored 92/100 risk index with confirmed deepfake acoustic telemetry.',
    timestamp: '8m ago',
    type: 'alert',
    read: false,
    link: '/cases'
  },
  {
    id: 'notif-2',
    title: 'Model Variance Alert',
    message: 'Scam Pattern Detection model accuracy dropped to 89% (Variance -3.2%). Review suggested.',
    timestamp: '1h ago',
    type: 'warning',
    read: false,
    link: '/model-health'
  },
  {
    id: 'notif-3',
    title: 'Engine Telemetry Synced',
    message: 'Inference edge successfully synchronized with production cluster v4.18 neural weights.',
    timestamp: '3h ago',
    type: 'info',
    read: true,
    link: '/model-health'
  }
];

export const SAMPLE_SYSTEM_SERVICES: SystemServiceStatus[] = [
  {
    name: 'FastAPI Core Gateway',
    component: 'backend/app/main.py',
    port: 8000,
    status: 'ONLINE',
    latencyMs: 14,
    version: 'v1.4.2 (FastAPI ASGI)',
    notes: 'Handles audio normalization, pre-check routing, and API authentication'
  },
  {
    name: 'PostgreSQL Relational DB',
    component: 'PostgreSQL 16 / Alembic baseline',
    port: 5433,
    status: 'ONLINE',
    latencyMs: 8,
    version: 'v16.2 (13 tables registered)',
    notes: 'Stores analyses, transcripts, agent results, model versions & audit events'
  },
  {
    name: 'Redis In-Memory State & Queue',
    component: 'Redis 7.2 Streams',
    port: 6379,
    status: 'ONLINE',
    latencyMs: 3,
    version: 'v7.2.4',
    notes: 'Rate-limiting token buckets and asynchronous pipeline coordination'
  },
  {
    name: 'Qdrant Vector Engine',
    component: 'Qdrant Neural Search',
    port: 6333,
    status: 'ONLINE',
    latencyMs: 22,
    version: 'v1.8.3',
    notes: 'Embeddings similarity search against 1,400+ indexed scam modus operandi'
  },
  {
    name: 'MinIO Object Storage',
    component: 'MinIO S3-Compatible',
    port: 9000,
    status: 'ONLINE',
    latencyMs: 18,
    version: 'RELEASE.2026-08',
    notes: 'Encrypted ephemeral scratch storage for raw and normalized 16kHz WAVs'
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettingsConfig = {
  backendUrl: 'http://localhost:8000',
  apiKey: 'vs_live_sec_994827103847291',
  inferenceMode: 'sequential',
  voiceCloneProvider: 'spectra_aasist3_int8',
  criticalThreshold: 80,
  highThreshold: 60,
  warningThreshold: 40,
  telemetryAnonymization: true,
  redactPii: true,
  autoExportDaily: false
};

