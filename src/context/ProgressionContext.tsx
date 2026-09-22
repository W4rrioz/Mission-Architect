/**
 * Progression & Unlock Context
 * Source: 01-prd.md §4.1, §4.7 and 06-implementation-plan.md Phase 7
 *
 * Manages mission unlock state across the campaign and tutorial guidance overlay.
 * Earth-orbit is unlocked by default; completing it unlocks Moon, Mars, and Asteroid.
 */

import React, { createContext, useContext, useState } from 'react';
import { MissionId } from '../domain/types';

interface ProgressionContextValue {
  unlockedMissions: Set<MissionId>;
  completedMissions: Set<MissionId>;
  isMissionUnlocked: (missionId: MissionId) => boolean;
  unlockMission: (missionId: MissionId) => void;
  unlockAllMissions: () => void;
  markMissionCompleted: (missionId: MissionId) => void;
  tutorialDismissed: boolean;
  dismissTutorial: () => void;
  resetTutorial: () => void;
}

const ProgressionContext = createContext<ProgressionContextValue | undefined>(undefined);

const STORAGE_KEY_UNLOCKED = 'mission_architect_unlocked';
const STORAGE_KEY_COMPLETED = 'mission_architect_completed';
const STORAGE_KEY_TUTORIAL = 'mission_architect_tutorial_dismissed';

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedMissions, setUnlockedMissions] = useState<Set<MissionId>>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
        if (saved) {
          const parsed = JSON.parse(saved);
          return new Set<MissionId>(['earth-orbit', ...parsed]);
        }
      }
    } catch {
      // Fallback
    }
    return new Set<MissionId>(['earth-orbit']);
  });

  const [completedMissions, setCompletedMissions] = useState<Set<MissionId>>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
        if (saved) {
          return new Set<MissionId>(JSON.parse(saved));
        }
      }
    } catch {
      // Fallback
    }
    return new Set<MissionId>();
  });

  const [tutorialDismissed, setTutorialDismissed] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(STORAGE_KEY_TUTORIAL) === 'true';
      }
    } catch {
      // Fallback
    }
    return false;
  });

  const saveUnlocked = (set: Set<MissionId>) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(Array.from(set)));
      }
    } catch {
      // Ignore storage errors
    }
  };

  const saveCompleted = (set: Set<MissionId>) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(Array.from(set)));
      }
    } catch {
      // Ignore storage errors
    }
  };

  const isMissionUnlocked = (id: MissionId): boolean => {
    if (id === 'earth-orbit') return true;
    return unlockedMissions.has(id);
  };

  const unlockMission = (id: MissionId) => {
    setUnlockedMissions((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveUnlocked(next);
      return next;
    });
  };

  const unlockAllMissions = () => {
    const all: MissionId[] = ['earth-orbit', 'moon', 'mars', 'asteroid'];
    const next = new Set<MissionId>(all);
    setUnlockedMissions(next);
    saveUnlocked(next);
  };

  const markMissionCompleted = (id: MissionId) => {
    setCompletedMissions((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveCompleted(next);
      return next;
    });

    // PRD §4.1: Completing Earth-orbit unlocks all other missions
    if (id === 'earth-orbit') {
      unlockAllMissions();
    }
  };

  const dismissTutorial = () => {
    setTutorialDismissed(true);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_TUTORIAL, 'true');
      }
    } catch {
      // Ignore
    }
  };

  const resetTutorial = () => {
    setTutorialDismissed(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_TUTORIAL);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <ProgressionContext.Provider
      value={{
        unlockedMissions,
        completedMissions,
        isMissionUnlocked,
        unlockMission,
        unlockAllMissions,
        markMissionCompleted,
        tutorialDismissed,
        dismissTutorial,
        resetTutorial,
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
};

const defaultProgressionValue: ProgressionContextValue = {
  unlockedMissions: new Set<MissionId>(['earth-orbit', 'moon', 'mars', 'asteroid']),
  completedMissions: new Set<MissionId>(),
  isMissionUnlocked: () => true,
  unlockMission: () => {},
  unlockAllMissions: () => {},
  markMissionCompleted: () => {},
  tutorialDismissed: false,
  dismissTutorial: () => {},
  resetTutorial: () => {},
};

export function useProgression(): ProgressionContextValue {
  const ctx = useContext(ProgressionContext);
  return ctx || defaultProgressionValue;
}
