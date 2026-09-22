/**
 * Phase 8 — Accessibility (a11y), Contrast & Responsive Design Unit Tests
 * Source: 04-ui-ux-brief.md §8 and 01-prd.md §8
 */

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { CategoryTabs } from '../components/CategoryTabs';
import { Slider } from '../components/Slider';
import { Gauge } from '../components/Gauge';
import { DecisionCardModal } from '../components/DecisionCardModal';
import { DecisionCard } from '../domain/types';

describe('Phase 8 — Accessibility & Responsive Architecture', () => {
  it('renders skip-link and main content landmark for keyboard users', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(html).toContain('class="skip-link"');
    expect(html).toContain('href="#main-content"');
    expect(html).toContain('id="main-content"');
  });

  it('renders category tabs with proper WAI-ARIA tablist semantics', () => {
    const html = renderToString(
      <CategoryTabs
        activeCategory="launchVehicle"
        onSelectCategory={() => {}}
        selectedParts={{}}
      />
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('id="tab-launchVehicle"');
    expect(html).toContain('aria-controls="panel-launchVehicle"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('tabindex="-1"');
  });

  it('renders slider with complete ARIA value attributes and accessible labels', () => {
    const html = renderToString(
      <Slider
        id="test-slider"
        label="Propellant Load"
        min={50}
        max={1000}
        step={10}
        value={350}
        unit="kg"
        onChange={() => {}}
      />
    );

    expect(html).toContain('type="range"');
    expect(html).toContain('aria-label="Propellant Load"');
    expect(html).toContain('aria-valuemin="50"');
    expect(html).toContain('aria-valuemax="1000"');
    expect(html).toContain('aria-valuenow="350"');
    expect(html).toContain('aria-valuetext="350 kg"');
    expect(html).toContain('for="test-slider"');
  });

  it('renders telemetry gauges with ARIA meter roles and descriptive text', () => {
    const html = renderToString(
      <Gauge
        label="Total Mass"
        currentValue={1200}
        limitValue={1500}
        unit="kg"
        percentage={80}
        status="good"
      />
    );

    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-label="Total Mass"');
    expect(html).toContain('aria-valuenow="1200"');
    expect(html).toContain('aria-valuemax="1500"');
    expect(html).toContain('aria-valuetext="1200 of 1500 kg"');
  });

  it('renders decision card modal with alertdialog role, countdown numeral, and options', () => {
    const mockCard: DecisionCard = {
      id: 'test-card',
      type: 'failure',
      prompt: 'Reaction wheel friction detected. Choose attitude control recovery mode.',
      timeoutSeconds: 15,
      defaultResponseId: 'resp-1',
      responses: [
        {
          id: 'resp-1',
          label: 'Switch to RCS thrusters',
          description: 'Consumes monopropellant to maintain 3-axis pointing.',
          fuelCostKg: 15,
        },
        {
          id: 'resp-2',
          label: 'Accept coarse sun-pointing',
          description: 'Reduces solar generation efficiency.',
          powerCostW: 50,
        },
      ],
    };

    const html = renderToString(
      <DecisionCardModal
        card={mockCard}
        secondsRemaining={12}
        onSelectResponse={() => {}}
      />
    );

    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="decision-card-title"');
    expect(html).toContain('12'); // Countdown numeral
    expect(html).toContain('SEC');
    expect(html).toContain('Switch to RCS thrusters');
    expect(html).toContain('TIMEOUT DEFAULT');
  });

  it('renders responsive layout classes across Spacecraft Design and Mission Control', () => {
    const designHtml = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/design']}>
        <App />
      </MemoryRouter>
    );
    expect(designHtml).toContain('class="workbench-grid"');
    expect(designHtml).toContain('class="gauges-grid"');

    const controlHtml = renderToString(
      <MemoryRouter initialEntries={['/missions/earth-orbit/control']}>
        <App />
      </MemoryRouter>
    );
    expect(controlHtml).toContain('class="console-grid"');
    expect(controlHtml).toContain('role="toolbar"');
  });
});
