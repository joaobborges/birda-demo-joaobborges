---
phase: 07-native-tabs-map-drawer
plan: 01
subsystem: navigation
tags: [native-tabs, expo-router, tab-bar, map-screen, iOS]
dependency_graph:
  requires: []
  provides: [NativeTabs layout, Capture placeholder, Logbook placeholder, cleaned map screen]
  affects: [app/(main)/_layout.tsx, app/(main)/index.tsx]
tech_stack:
  added: []
  patterns: [NativeTabs from expo-router/unstable-native-tabs, SF Symbols via NativeTabs.Trigger.Icon]
key_files:
  created:
    - app/(main)/capture.tsx
    - app/(main)/logbook.tsx
  modified:
    - app/(main)/_layout.tsx
    - app/(main)/index.tsx
decisions:
  - "NativeTabs iconColor uses neutral400 (inactive) and neutral700 (active) — matches design system decision"
  - "Placeholder screens use useSafeAreaInsets (not SafeAreaView) for precise padding control"
  - "selectedBird state retained in index.tsx with setSelectedBird wiring — Plan 02 bottom sheet needs it"
  - "Notification icon moved to right side of topBar (previously in topBarRight subgroup) — simplified layout after removing community icon"
metrics:
  duration: 80s
  completed_date: "2026-03-10"
  tasks_completed: 2
  files_changed: 4
---

# Phase 7 Plan 1: Native Tabs Layout Conversion Summary

**One-liner:** NativeTabs layout with 4 SF Symbol tabs replacing the custom floating bottom bar, plus placeholder Capture/Logbook screens and cleaned-up map overlays.

## What Was Built

Converted `app/(main)/_layout.tsx` from a `Stack` navigator to `NativeTabs` from `expo-router/unstable-native-tabs`. The layout now renders a native iOS UITabBarController with four tabs — Map, Community, Capture, and Logbook — in that order. Tab icons use SF Symbols (`map.fill`, `person.2.fill`, `camera.fill`, `book.fill`) with inactive state `neutral400` gray and active state `neutral700` dark navy, matching the design system.

Created two new placeholder screens (`capture.tsx` and `logbook.tsx`) that each show a centered Ionicons icon, a title, and "Coming soon" subtitle using design tokens.

Cleaned up `app/(main)/index.tsx`: removed the floating bottom bar (Capture/Logbook buttons), removed the community icon from the floating top bar, and removed the `BirdInfoCard` conditional render. The `selectedBird` state and `setSelectedBird` wiring are preserved for Plan 02's bottom sheet drawer. Profile and notification floating icons remain.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1: NativeTabs layout + placeholder screens | 60ee568 | feat(07-01): convert main layout to NativeTabs with 4 tabs |
| Task 2: Map screen cleanup | f2973b2 | feat(07-01): clean up map screen overlays |

## Verification

- TypeScript compiles without errors (both tasks verified with `npx tsc --noEmit`)
- NativeTabs layout file uses confirmed API from installed `expo-router ~55.0.4` type definitions
- All 4 tab triggers reference existing route files (index, community, capture, logbook)
- Placeholder screens use `@/theme` design tokens throughout

## Deviations from Plan

**1. [Rule 1 - Refactor] Simplified topBar layout after community icon removal**
- **Found during:** Task 2
- **Issue:** The `topBarRight` subgroup View only contained the notifications icon after removing the community Pressable. The extra wrapper was unnecessary.
- **Fix:** Moved notification icon directly into the `topBar` flex row, removed `topBarRight` View and its styles.
- **Files modified:** `app/(main)/index.tsx`
- **Commit:** f2973b2

## Self-Check

Files exist:
- app/(main)/_layout.tsx: present
- app/(main)/capture.tsx: present
- app/(main)/logbook.tsx: present
- app/(main)/index.tsx: present

Commits exist:
- 60ee568: present
- f2973b2: present
