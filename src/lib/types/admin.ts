export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type HealthStatus = 'Healthy' | 'Needs Review' | 'Degraded';
export type UserRole = 'Administrator' | 'Analyst' | 'End User';
export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface ModelMetricCardData {
  id: string;
  title: string;
  subtitle: string;
  status: HealthStatus;
  statusLabel: string;
  accuracy: number;
  accuracyFormatted: string;
  varianceLabel: string;
  varianceType: 'optimal' | 'nominal' | 'warning' | 'sla';
  progressPercent: number;
  updatedTime: string;
  icon: 'audio' | 'waveform' | 'shield' | 'gauge';
}

export interface RecordingTypeData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyClonedIncidentData {
  date: string;
  displayDate: string;
  count: number;
}

export interface ScamCategoryData {
  category: string;
  count: number;
  color: string;
}

export interface AgentBreakdownDetail {
  agentName: string;
  status: string;
  confidence: number;
  contributionPercent: number;
  details: string;
  indicators: string[];
}

export interface TranscriptUtterance {
  timestamp: string;
  speaker: string;
  text: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface CaseRecord {
  id: string;
  fileName: string;
  fileSize: string;
  duration: string;
  format: string;
  date: string;
  timestamp: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  resultLabel: 'Looks Safe' | 'Be Careful' | 'High Scam Risk' | 'Critical Severity';
  category: string;
  confidence: number;
  summary: string;
  recommendedAction: string;
  whatWeNoticed: string[];
  whatYouShouldDo: string[];
  agentBreakdown: AgentBreakdownDetail[];
  transcript: TranscriptUtterance[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  analysesCount: number;
  lastActive: string;
  createdAt: string;
  avatarBg?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  read: boolean;
  link?: string;
}

export interface SystemServiceStatus {
  name: string;
  component: string;
  port: number | string;
  status: 'ONLINE' | 'DEGRADED' | 'STANDBY' | 'OFFLINE';
  latencyMs: number;
  version: string;
  notes: string;
}

export interface AdminSettingsConfig {
  backendUrl: string;
  apiKey: string;
  inferenceMode: 'sequential' | 'parallel';
  voiceCloneProvider: string;
  criticalThreshold: number;
  highThreshold: number;
  warningThreshold: number;
  telemetryAnonymization: boolean;
  redactPii: boolean;
  autoExportDaily: boolean;
}

