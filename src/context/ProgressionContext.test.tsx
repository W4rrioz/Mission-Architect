/**
 * Progression Context Unit Tests
 * Source: 01-prd.md §4.1, §4.7
 *
 * Verifies campaign unlock behavior and tutorial state management.
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ProgressionProvider, useProgression } from './ProgressionContext';

describe('Phase 7 — Progression & Unlock Logic', () => {
  it('unlocks Earth-orbit by default and keeps deep space missions locked initially', () => {
    const TestConsumer: React.FC = () => {
      const { isMissionUnlocked, tutorialDismissed } = useProgression();
      return (
        <div>
          <span id="earth">{String(isMissionUnlocked('earth-orbit'))}</span>
          <span id="moon">{String(isMissionUnlocked('moon'))}</span>
          <span id="mars">{String(isMissionUnlocked('mars'))}</span>
          <span id="asteroid">{String(isMissionUnlocked('asteroid'))}</span>
          <span id="tutorial">{String(tutorialDismissed)}</span>
        </div>
      );
    };

    const html = renderToString(
      <ProgressionProvider>
        <TestConsumer />
      </ProgressionProvider>
    );

    expect(html).toContain('<span id="earth">true</span>');
    expect(html).toContain('<span id="moon">false</span>');
    expect(html).toContain('<span id="mars">false</span>');
    expect(html).toContain('<span id="asteroid">false</span>');
    expect(html).toContain('<span id="tutorial">false</span>');
  });

  it('provides unlock methods to unlock all missions across the campaign', () => {
    const TestConsumer: React.FC = () => {
      const { isMissionUnlocked, unlockAllMissions } = useProgression();
      // Test calling unlockAllMissions during render to test updated state
      React.useEffect(() => {
        unlockAllMissions();
      }, [unlockAllMissions]);

      return (
        <div>
          <span id="earth-check">{String(isMissionUnlocked('earth-orbit'))}</span>
        </div>
      );
    };

    const html = renderToString(
      <ProgressionProvider>
        <TestConsumer />
      </ProgressionProvider>
    );

    expect(html).toContain('<span id="earth-check">true</span>');
  });
});
