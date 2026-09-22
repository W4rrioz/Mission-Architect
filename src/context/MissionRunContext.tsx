/**
 * Mission Run Context
 * Holds the active mission run state across Live Mission Control and Debrief.
 */

import React, { createContext, useContext, useState } from 'react';
import { MissionRunState } from '../domain/types';

interface MissionRunContextValue {
  runState: MissionRunState | null;
  setRunState: (state: MissionRunState | null) => void;
}

const MissionRunContext = createContext<MissionRunContextValue | undefined>(undefined);

export const MissionRunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [runState, setRunState] = useState<MissionRunState | null>(null);

  return (
    <MissionRunContext.Provider value={{ runState, setRunState }}>
      {children}
    </MissionRunContext.Provider>
  );
};

export function useMissionRun(): MissionRunContextValue {
  const context = useContext(MissionRunContext);
  if (!context) {
    throw new Error('useMissionRun must be used within a MissionRunProvider');
  }
  return context;
}
