import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateStreak, dayKey, getMoonPhase, moonFill } from './focus';

test('moonFill clamps to a valid daily fill ratio', () => {
  assert.equal(moonFill(10, 15), 2 / 3);
  assert.equal(moonFill(50, 15), 1);
  assert.equal(moonFill(-5, 15), 0);
  assert.equal(moonFill(5, 0), 0);
});

test('phase snapping stays on quarter moon boundaries', () => {
  assert.equal(getMoonPhase(0.1), 0);
  assert.equal(getMoonPhase(0.26), 0.25);
  assert.equal(getMoonPhase(0.51), 0.5);
  assert.equal(getMoonPhase(0.74), 0.75);
  assert.equal(getMoonPhase(1), 1);
});

test('dayKey uses the 04:00 local boundary', () => {
  assert.equal(dayKey(new Date('2026-10-10T03:59:00')), '2026-10-09');
  assert.equal(dayKey(new Date('2026-10-10T04:00:00')), '2026-10-10');
});

test('calculateStreak resets after a missed day and respects the boundary', () => {
  const entries = [
    { dayKey: '2026-10-10', focusedMinutes: 15, dailyGoalMinutes: 15 },
    { dayKey: '2026-10-09', focusedMinutes: 15, dailyGoalMinutes: 15 },
    { dayKey: '2026-10-08', focusedMinutes: 15, dailyGoalMinutes: 15 },
  ];

  assert.equal(calculateStreak(entries, new Date('2026-10-10T12:00:00')), 3);
  assert.equal(
    calculateStreak(
      [
        { dayKey: '2026-10-10', focusedMinutes: 15, dailyGoalMinutes: 15 },
        { dayKey: '2026-10-09', focusedMinutes: 0, dailyGoalMinutes: 15 },
        { dayKey: '2026-10-08', focusedMinutes: 15, dailyGoalMinutes: 15 },
      ],
      new Date('2026-10-10T12:00:00')
    ),
    1
  );
});
