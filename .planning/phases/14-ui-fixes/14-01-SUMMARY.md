---
phase: 14-ui-fixes
plan: "01"
subsystem: ui
tags: [visual-fix, onboarding, welcome, tab-bar]
dependency_graph:
  requires: []
  provides: [auth-backdrop-fix, onboarding-dot-colors, 3-tab-layout]
  affects: [welcome-screen, onboarding-flow, main-tab-bar]
tech_stack:
  added: []
  patterns: [StyleSheet.absoluteFillObject, BottomSheet.containerStyle]
key_files:
  created: []
  modified:
    - src/components/welcome/AuthDrawer.tsx
    - src/components/onboarding/ProgressDots.tsx
    - app/(main)/_layout.tsx
  deleted:
    - app/(main)/capture.tsx
decisions:
  - "Used BottomSheet containerStyle prop (not style prop) to make backdrop portal fill the full screen"
  - "CaptureFAB.tsx pre-existing TS errors are out of scope — belong to Plan 02 (FAB feature)"
metrics:
  duration: "4 minutes"
  completed: 2026-03-10
---

# Phase 14 Plan 01: UI Fixes — Backdrop, Dots, Tab Bar Summary

**One-liner:** Three targeted visual fixes: full-screen auth drawer backdrop via BottomSheet containerStyle, blue inactive progress dots at 50% opacity, and 3-tab layout with Capture tab removed.

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Fix auth backdrop and stepper dot colors | 6b5469f | AuthDrawer.tsx + ProgressDots.tsx |
| 2 | Remove Capture tab from tab bar | a2ca211 | _layout.tsx modified, capture.tsx deleted |

## Changes Made

### Task 1: Auth Backdrop + Progress Dots

**AuthDrawer.tsx** — Added `containerStyle={StyleSheet.absoluteFillObject}` to the `<BottomSheet>` component. The `BottomSheetBackdrop` already had `style={[props.style, StyleSheet.absoluteFillObject]}`, but the sheet's container itself needed to fill the screen so the portal-rendered backdrop could cover the mosaic grid above.

**ProgressDots.tsx** — Changed `inactive` style `backgroundColor` from `'rgba(255, 255, 255, 0.5)'` to `'rgba(31, 135, 254, 0.5)'`. This is `semantic.actionPrimary` (#1F87FE) at 50% opacity rendered as an rgba literal (StyleSheet.create does not accept dynamic expressions).

### Task 2: Remove Capture Tab

**app/(main)/_layout.tsx** — Removed the `<Tabs.Screen name="capture" ... />` block (9 lines). Tab bar now has exactly 3 screens: Map (index), Community, Logbook.

**app/(main)/capture.tsx** — File deleted. No dead code remains.

## Verification

- capture.tsx: confirmed deleted
- _layout.tsx: no reference to "capture"
- ProgressDots inactive style: `rgba(31, 135, 254, 0.5)` confirmed
- AuthDrawer BottomSheet: `containerStyle={StyleSheet.absoluteFillObject}` confirmed
- TypeScript: passes for all plan-scoped files

## Deviations from Plan

None — plan executed exactly as written.

## Deferred Issues

**Pre-existing TS errors in untracked file `src/components/map/CaptureFAB.tsx`** (5 errors):
- `Argument of type 'unknown' is not assignable to parameter of type 'number'` in useSharedValue usage
- `Cannot find namespace 'JSX'` return type annotation
- `Type 'SharedValue<number>' is not assignable to type 'SharedValue<unknown>'`

These errors exist in a file that is not part of this plan's scope and was never committed to the repo (untracked). They are pre-existing work-in-progress for Plan 02 (FAB feature). They do not affect any of this plan's deliverables.

## Self-Check: PASSED

- src/components/welcome/AuthDrawer.tsx: FOUND
- src/components/onboarding/ProgressDots.tsx: FOUND
- app/(main)/_layout.tsx: FOUND
- app/(main)/capture.tsx: DELETED (confirmed)
- Commit 6b5469f: FOUND
- Commit a2ca211: FOUND
