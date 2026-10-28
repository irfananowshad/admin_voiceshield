import {
  SAMPLE_MODEL_HEALTH_METRICS,
  SAMPLE_RECORDING_TYPES,
  SAMPLE_DAILY_CLONED_INCIDENTS,
  SAMPLE_SCAM_CATEGORIES,
  SAMPLE_CASES
} from '../data/sampleData';

export interface ExportReportOptions {
  format?: 'csv' | 'json';
  dateRangeLabel?: string;
}

export function exportResearchReport({ format = 'csv', dateRangeLabel = 'Last 30 days' }: ExportReportOptions = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `voiceshield-research-report-${timestamp}.${format}`;

  if (format === 'json') {
    const reportData = {
      meta: {
        reportType: 'VoiceShield Research Analytics Report',
        dateRange: dateRangeLabel,
        generatedAt: new Date().toISOString(),
        telemetrySync: 'production v4.18 neural inference edge (Sample dataset)',
        cohortTotalCalls: 220,
        detectedCasesThisWeek: 100,
        weeklyChange: '+25% vs prev week'
      },
      modelHealth: SAMPLE_MODEL_HEALTH_METRICS,
      recordingTypes: SAMPLE_RECORDING_TYPES,
      dailyClonedVoiceIncidents: SAMPLE_DAILY_CLONED_INCIDENTS,
      scamCategories: SAMPLE_SCAM_CATEGORIES,
      investigatedCases: SAMPLE_CASES.map((c) => ({
        id: c.id,
        fileName: c.fileName,
        riskScore: c.riskScore,
        threatLevel: c.threatLevel,
        category: c.category,
        date: c.date,
        duration: c.duration,
        confidence: c.confidence,
        summary: c.summary
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
    return filename;
  }

  // CSV export
  const lines: string[] = [];
  lines.push('# VOICESHIELD RESEARCH ANALYTICS REPORT (Sample Dataset)');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Time Window: ${dateRangeLabel}`);
  lines.push('');

  lines.push('# MODEL HEALTH METRICS');
  lines.push('ID,Model Name,Subtitle,Accuracy,Status,Variance SLA,Last Updated');
  SAMPLE_MODEL_HEALTH_METRICS.forEach((m) => {
    lines.push(`"${m.id}","${m.title}","${m.subtitle}","${m.accuracyFormatted}","${m.status}","${m.varianceLabel}","${m.updatedTime}"`);
  });
  lines.push('');

  lines.push('# RECORDING TYPES IN RESEARCH');
  lines.push('Category,Indexed Sample Count,Percentage of Cohort');
  SAMPLE_RECORDING_TYPES.forEach((r) => {
    lines.push(`"${r.category}",${r.count},${r.percentage}%`);
  });
  lines.push('');

  lines.push('# CLONED-VOICE SCAMS DETECTED PER DAY');
  lines.push('Date,Detected Count');
  SAMPLE_DAILY_CLONED_INCIDENTS.forEach((d) => {
    lines.push(`"${d.displayDate}",${d.count}`);
  });
  lines.push('');

  lines.push('# SCAM CATEGORIES IN COHORT (Total: 220 calls)');
  lines.push('Category,Validated Calls');
  SAMPLE_SCAM_CATEGORIES.forEach((s) => {
    lines.push(`"${s.category}",${s.count}`);
  });
  lines.push('');

  lines.push('# SAMPLE INVESTIGATED CASES');
  lines.push('Case ID,File Name,Risk Score,Threat Level,Category,Duration,Date,Audio Format');
  SAMPLE_CASES.forEach((c) => {
    lines.push(`"${c.id}","${c.fileName}",${c.riskScore},"${c.threatLevel}","${c.category}","${c.duration}","${c.date}","${c.format}"`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
  return filename;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

