# Birda

## What This Is

Birda is a bird watching companion app prototype built for an interview demo. It showcases a polished multi-step onboarding flow with user profiling, a paywall with a Nature Day discount variant, and a map-based home screen with zoom-dependent bird visibility. All data is local — no API, no backend. Built with Expo (SDK 55) + React Native + EAS Dev Client.

## Core Value

A polished, production-grade mobile prototype that demonstrates real-world mobile engineering craft — smooth animations, thoughtful UX patterns, and a codebase ready to ship with minimal changes when a backend is added.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing codebase. -->

- ✓ Expo Router file-based navigation with onboarding and main route groups — existing
- ✓ Zustand store with AsyncStorage persistence for onboarding state — existing
- ✓ Basic onboarding screens (welcome, name, location, skill-level, interests, notifications, summary, paywall) — existing
- ✓ Map screen with react-native-maps and zoom-based bird visibility — existing
- ✓ Bird info card on marker tap — existing
- ✓ Reusable Button component with haptic feedback and Reanimated press animation — existing
- ✓ ProgressDots onboarding indicator — existing
- ✓ Dev panel (conditional __DEV__ mount) with reset/navigate/state dump actions — existing
- ✓ Error boundary on map screen — existing
- ✓ EAS build profiles (development, preview, production) — existing
- ✓ Metro config with experimental import support — existing
- ✓ New Architecture enabled — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Polished onboarding UX with animated transitions (FadeIn content, spring button effects)
- [ ] Disabled back gesture on onboarding stack (enforce linear wizard flow)
- [ ] Uncontrolled TextInput pattern for name/location screens (ref-based, commit on Continue)
- [ ] Standard paywall with personalized headline, feature benefits, monthly/annual toggle with spring animation
- [ ] Nature Day discount paywall variant (triggered via debug panel)
- [ ] Full-bleed map with floating UI (profile, community, notification icons + bottom capture/logbook buttons)
- [ ] Marker clustering via react-native-map-clustering
- [ ] Profile screen as native form sheet (avatar, username, skill badge, mock achievements)
- [ ] Community screen as native form sheet with LegendList feed
- [ ] Custom fonts via expo-font config plugin (no runtime loading)
- [ ] React Compiler (babel-plugin-react-compiler) for auto-memoization
- [ ] ESLint crash prevention rules (jsx-no-leaked-render, no-barrel-files)
- [ ] Production bundle optimizations (tree shaking, R8 shrinking, Hermes mmap, iOS asset catalog)
- [ ] FPS monitor in dev panel using Reanimated useFrameCallback
- [ ] Consistent styling conventions (borderCurve continuous, gap spacing, boxShadow, gradients)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Expo Go support — maps require native modules, EAS dev client only
- Real authentication or backend — prototype uses local data only
- Capture flow — visual button only, no functionality
- Logbook functionality — visual button only, no functionality
- Push notifications — deferred to production version
- Payment processing — paywall is visual demo only
- CI/CD pipeline — EAS config ready, pipeline wiring deferred
- Automated testing — architecture supports it, tests deferred
- Web platform — mobile-only prototype

## Context

- **Purpose:** Interview demo prototype to showcase mobile engineering craft
- **Design workflow:** Code-first approach, synced to Paper.design via MCP for visual refinement, then back to code
- **Current state:** Early working prototype with basic navigation, screens, and state management in place. Needs polishing, missing features (paywall variants, form sheets, clustering, optimizations), and convention enforcement
- **PRD reference:** `PRD-CLAUDE/01-PRD.md` — comprehensive spec with code patterns, animation strategies, and production readiness checklist
- **Codebase map:** `.planning/codebase/` — 7 documents covering stack, architecture, structure, conventions, testing, integrations, concerns

## Constraints

- **Stack:** Expo SDK 55 + React Native 0.83 + EAS Dev Client — no Expo Go
- **Data:** All local (mock JSON, ~30-50 bird entries) — no API calls, no backend
- **Platform:** iOS primary, Android secondary — optimised for iOS
- **Performance:** 60fps animations mandatory — only animate transform/opacity (GPU properties)
- **Imports:** No barrel imports — direct source file imports enforced
- **Rendering:** No `&&` with falsy values — use ternary to prevent crashes
- **Animations:** Reanimated only — all on native/UI thread

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No tab navigator — floating custom UI on map | Map is full-bleed; tab bar would waste space and fight with map gestures | — Pending |
| Zustand over Context/Redux | Minimal boilerplate, built-in persist middleware, works well with React Compiler | ✓ Good |
| LegendList over FlashList for community feed | Simpler API, better defaults for this use case | — Pending |
| GestureDetector + Gesture.Tap() for button press animation | Runs entirely on UI thread — no JS round-trip for press feedback | — Pending |
| Uncontrolled TextInput for onboarding | Avoids re-render on every keystroke, better perf | — Pending |
| Code-first design with Paper.design sync | Enables rapid iteration — build in code, refine visually, sync back | — Pending |

---
*Last updated: 2026-03-09 after initialization*
