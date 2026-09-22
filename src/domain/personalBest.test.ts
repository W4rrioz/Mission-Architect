import { describe, it, expect, beforeEach } from 'vitest';
import { getPersonalBest, savePersonalBest, getAllPersonalBests } from './personalBest';

describe('Personal Best High Score Manager', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const key in store) {
      delete store[key];
    }
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key in store) {
          delete store[key];
        }
      },
    };
    (globalThis as any).window = { localStorage: mockLocalStorage };
    (globalThis as any).localStorage = mockLocalStorage;
  });

  it('returns null when no personal best has been recorded yet', () => {
    expect(getPersonalBest('earth-orbit')).toBeNull();
    expect(getAllPersonalBests()).toEqual({});
  });

  it('records a new personal best score and retrieves it', () => {
    const isNew = savePersonalBest('earth-orbit', 85);
    expect(isNew).toBe(true);

    const record = getPersonalBest('earth-orbit');
    expect(record).not.toBeNull();
    expect(record?.score).toBe(85);
    expect(record?.dateIso).toBeDefined();
  });

  it('updates when a higher score is achieved and ignores a lower score', () => {
    savePersonalBest('moon', 70);
    expect(getPersonalBest('moon')?.score).toBe(70);

    // Lower score should not overwrite
    const lowerIsNew = savePersonalBest('moon', 65);
    expect(lowerIsNew).toBe(false);
    expect(getPersonalBest('moon')?.score).toBe(70);

    // Higher score should overwrite
    const higherIsNew = savePersonalBest('moon', 94);
    expect(higherIsNew).toBe(true);
    expect(getPersonalBest('moon')?.score).toBe(94);
  });

  it('tracks distinct personal bests for distinct missions', () => {
    savePersonalBest('earth-orbit', 88);
    savePersonalBest('mars', 92);

    const all = getAllPersonalBests();
    expect(all['earth-orbit']?.score).toBe(88);
    expect(all['mars']?.score).toBe(92);
    expect(all['asteroid']).toBeUndefined();
  });
});
