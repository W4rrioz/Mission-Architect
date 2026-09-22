/**
 * Personal Best High Score Manager
 * Source: 01-prd.md §4.6, §5 (Local persistence via localStorage)
 *
 * Saves and retrieves personal best scores per mission profile.
 * Completely client-side, zero network dependencies.
 */

import { MissionId } from './types';

export interface PersonalBestRecord {
  score: number;
  dateIso: string;
}

const STORAGE_KEY = 'mission_architect_personal_bests';

export function getPersonalBest(missionId: MissionId): PersonalBestRecord | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const records: Record<string, PersonalBestRecord> = JSON.parse(raw);
    return records[missionId] || null;
  } catch {
    return null;
  }
}

export function savePersonalBest(missionId: MissionId, newScore: number): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const records: Record<string, PersonalBestRecord> = raw ? JSON.parse(raw) : {};

    const existing = records[missionId];
    if (!existing || newScore > existing.score) {
      records[missionId] = {
        score: newScore,
        dateIso: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true; // Indicates new record established
    }
    return false;
  } catch {
    return false;
  }
}

export function getAllPersonalBests(): Partial<Record<MissionId, PersonalBestRecord>> {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
