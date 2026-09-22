/**
 * Spacecraft Design Context & Reducer
 * Provides reactive in-memory design state and auto-updating derived gauges.
 */

import React, { createContext, useContext, useReducer } from 'react';
import {
  MissionId,
  PartCategory,
  SpacecraftDesign,
  DerivedGauges,
} from '../domain/types';
import { MISSIONS } from '../data/missions';
import { PARTS } from '../data/parts';
import { computeDerivedGauges, getDefaultSliderValuesForPart } from '../domain/design';

export interface DesignState {
  missionId: MissionId;
  selectedParts: Partial<Record<PartCategory, string>>;
  sliderValues: Record<string, number>;
  derived: DerivedGauges;
}

export type DesignAction =
  | { type: 'SELECT_PART'; category: PartCategory; partId: string }
  | { type: 'DESELECT_PART'; category: PartCategory }
  | { type: 'SET_SLIDER'; sliderKey: string; value: number }
  | { type: 'SET_MISSION'; missionId: MissionId }
  | { type: 'RESET_DESIGN'; missionId?: MissionId };

function getInitialDesign(missionId: MissionId): DesignState {
  const mission = MISSIONS[missionId] || MISSIONS['earth-orbit'];
  const initialDesign: SpacecraftDesign = {
    missionId: mission.id,
    selectedParts: {},
    sliderValues: {},
  };
  const derived = computeDerivedGauges(initialDesign, mission, PARTS);
  return {
    missionId: mission.id,
    selectedParts: {},
    sliderValues: {},
    derived,
  };
}

function designReducer(state: DesignState, action: DesignAction): DesignState {
  const mission = MISSIONS[state.missionId] || MISSIONS['earth-orbit'];

  switch (action.type) {
    case 'SELECT_PART': {
      const nextParts = {
        ...state.selectedParts,
        [action.category]: action.partId,
      };

      // Populate default slider values for newly selected part if not already present
      const part = PARTS.find((p) => p.id === action.partId);
      const nextSliders = { ...state.sliderValues };
      if (part) {
        const defaults = getDefaultSliderValuesForPart(part);
        for (const [k, v] of Object.entries(defaults)) {
          if (nextSliders[k] === undefined) {
            nextSliders[k] = v;
          }
        }
      }

      const nextDesign: SpacecraftDesign = {
        missionId: state.missionId,
        selectedParts: nextParts,
        sliderValues: nextSliders,
      };

      return {
        ...state,
        selectedParts: nextParts,
        sliderValues: nextSliders,
        derived: computeDerivedGauges(nextDesign, mission, PARTS),
      };
    }

    case 'DESELECT_PART': {
      const nextParts = { ...state.selectedParts };
      delete nextParts[action.category];

      const nextDesign: SpacecraftDesign = {
        missionId: state.missionId,
        selectedParts: nextParts,
        sliderValues: state.sliderValues,
      };

      return {
        ...state,
        selectedParts: nextParts,
        derived: computeDerivedGauges(nextDesign, mission, PARTS),
      };
    }

    case 'SET_SLIDER': {
      const nextSliders = {
        ...state.sliderValues,
        [action.sliderKey]: action.value,
      };

      const nextDesign: SpacecraftDesign = {
        missionId: state.missionId,
        selectedParts: state.selectedParts,
        sliderValues: nextSliders,
      };

      return {
        ...state,
        sliderValues: nextSliders,
        derived: computeDerivedGauges(nextDesign, mission, PARTS),
      };
    }

    case 'SET_MISSION': {
      if (action.missionId === state.missionId) return state;
      const targetMission = MISSIONS[action.missionId] || MISSIONS['earth-orbit'];
      const nextDesign: SpacecraftDesign = {
        missionId: action.missionId,
        selectedParts: state.selectedParts,
        sliderValues: state.sliderValues,
      };

      return {
        ...state,
        missionId: action.missionId,
        derived: computeDerivedGauges(nextDesign, targetMission, PARTS),
      };
    }

    case 'RESET_DESIGN': {
      const targetId = action.missionId || state.missionId;
      return getInitialDesign(targetId);
    }

    default:
      return state;
  }
}

interface DesignContextValue {
  state: DesignState;
  dispatch: React.Dispatch<DesignAction>;
  selectPart: (category: PartCategory, partId: string) => void;
  deselectPart: (category: PartCategory) => void;
  setSlider: (sliderKey: string, value: number) => void;
  setMission: (missionId: MissionId) => void;
  resetDesign: (missionId?: MissionId) => void;
}

const DesignContext = createContext<DesignContextValue | undefined>(undefined);

export const DesignProvider: React.FC<{
  children: React.ReactNode;
  initialMissionId?: MissionId;
}> = ({ children, initialMissionId = 'earth-orbit' }) => {
  const [state, dispatch] = useReducer(designReducer, initialMissionId, getInitialDesign);

  const selectPart = (category: PartCategory, partId: string) =>
    dispatch({ type: 'SELECT_PART', category, partId });

  const deselectPart = (category: PartCategory) =>
    dispatch({ type: 'DESELECT_PART', category });

  const setSlider = (sliderKey: string, value: number) =>
    dispatch({ type: 'SET_SLIDER', sliderKey, value });

  const setMission = (missionId: MissionId) =>
    dispatch({ type: 'SET_MISSION', missionId });

  const resetDesign = (missionId?: MissionId) =>
    dispatch({ type: 'RESET_DESIGN', missionId });

  return (
    <DesignContext.Provider
      value={{
        state,
        dispatch,
        selectPart,
        deselectPart,
        setSlider,
        setMission,
        resetDesign,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
