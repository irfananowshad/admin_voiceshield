'use client';

import { CaseRecord } from '../types/admin';
import { SAMPLE_CASES } from './sampleData';

const STORAGE_KEY = 'voiceshield_admin_history_v1';

export interface HistoryItem extends CaseRecord {
  isLiveAnalysis?: boolean;
  uploadedAt?: string;
  language?: string;
}

export const getHistoryItems = (): HistoryItem[] => {
  if (typeof window === 'undefined') {
    return SAMPLE_CASES.map((c) => ({ ...c, isLiveAnalysis: false }));
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with standard demo cases from design references
    const initial: HistoryItem[] = SAMPLE_CASES.map((c) => ({
      ...c,
      isLiveAnalysis: false
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // ignore quota errors
    }
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return SAMPLE_CASES.map((c) => ({ ...c, isLiveAnalysis: false }));
  }
};

export const saveHistoryItem = (item: HistoryItem): HistoryItem[] => {
  if (typeof window === 'undefined') return [];

  const current = getHistoryItems();
  // Filter out any duplicate by id
  const updated = [item, ...current.filter((c) => c.id !== item.id)];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }

  return updated;
};

export const getHistoryItemById = (id: string): HistoryItem | undefined => {
  const items = getHistoryItems();
  return items.find((item) => item.id === id);
};

