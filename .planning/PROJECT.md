# Birda

## What This Is

Birda is a bird watching companion app prototype built for an interview demo. It features a polished 12-screen animated onboarding wizard, a personalized paywall with Nature Day discount variant, and a map home screen with Supercluster marker clustering and floating navigation UI. All data is local — no API, no backend. Built with Expo (SDK 55) + React Native + EAS Dev Client.

## Core Value

A polished, production-grade mobile prototype that demonstrates real-world mobile engineering craft — smooth animations, thoughtful UX patterns, and a codebase ready to ship with minimal changes when a backend is added.

## Requirements

### Validated

- ✓ Expo Router file-based navigation with onboarding and main route groups — existing
- ✓ Zustand store with AsyncStorage persistence for onboarding state — existing
- ✓ Map screen with react-native-maps and zoom-based bird visibility — existing
- ✓ Bird info card on marker tap — existing
- ✓ Reusable Button component with haptic feedback and Reanimated press animation — existing
- ✓ ProgressDots onboarding indicator — existing
- ✓ Dev panel (conditional __DEV__ mount) with reset/navigate/state dump actions — existing
- ✓ Error boundary on map screen — existing
- ✓ EAS build profiles (development, preview, production) — existing
- ✓ Metro config with experimental import support — existing
- ✓ New Architecture enabled — existing
- ✓ Centralized theme tokens (colors, spacing) replacing hardcoded hex values — v1.0 (FOUN-01)
- ✓ Hydration guard preventing onboarding flash for returning users — v1.0 (FOUN-02)
- ✓ React Compiler auto-memoization enabled — v1.0 (FOUN-03)
- ✓ ESLint jsx-no-leaked-render and no-barrel-files rules — v1.0 (FOUN-04)
- ✓ Animated onboarding transitions with FadeIn and spring effects — v1.0 (ONBR-01)
- ✓ Reusable OnboardingLayout component across 12 screens — v1.0 (ONBR-02)
- ✓ Uncontrolled TextInput pattern for name/location — v1.0 (ONBR-03)
- ✓ Adaptive paywall toggle with withSpring animation — v1.0 (PAYW-01)
- ✓ Personalized paywall headline from onboarding store — v1.0 (PAYW-02)
- ✓ Nature Day discount variant via debug panel — v1.0 (PAYW-03)
- ✓ borderCurve: continuous on all rounded corners — v1.0 (STYL-01)
- ✓ Supercluster marker clustering on map — v1.0 (MAP-01)
- ✓ Floating UI overlay with Ionicons navigation — v1.0 (MAP-02)
- ✓ BirdMarker and BirdInfoCard extracted to src/components/map/ — v1.0 (MAP-03)
- ✓ Profile push screen with avatar, badges, achievements — v1.0 (SCRN-01)
- ✓ Community push screen with LegendList social feed — v1.0 (SCRN-02)

### Active

(None — define in next milestone)

### Out of Scope

- Expo Go support — maps require native modules, EAS dev client only
- Real authentication or backend — prototype uses local data only
- Capture flow — visual button only, no functionality
- Logbook functionality — visual button only, no functionality
- Push notification delivery — requires backend, APNs/FCM
- Payment processing — paywall is visual demo only
- CI/CD pipeline — EAS config ready, pipeline wiring deferred
- Automated testing — architecture supports it, tests deferred
- Web platform — mobile-only prototype
- Dark mode — doubles design surface, single theme is better
- Bird identification (ML/AI) — separate project scope
- Internationalization — English only, strings are extractable

## Context

- **Purpose:** Interview demo prototype to showcase mobile engineering craft
- **Shipped:** v1.0 MVP on 2026-03-09 (3 phases, 10 plans, 4 days)
- **Codebase:** 2,649 LOC TypeScript/TSX across 81 files
- **Stack:** Expo SDK 55, React Native 0.83, Zustand, Reanimated, react-native-maps, Supercluster, Ionicons
- **Design workflow:** Code-first approach, synced to Paper.design via MCP for visual refinement
- **PRD reference:** `PRD-CLAUDE/01-PRD.md`
- **Codebase map:** `.planning/codebase/` — 7 documents covering stack, architecture, structure, conventions, testing, integrations, concerns
- **Tech debt:** 3 dead code items in `src/theme/` (see MILESTONES.md)

## Constraints

- **Stack:** Expo SDK 55 + React Native 0.83 + EAS Dev Client — no Expo Go
- **Data:** All local (mock JSON, ~30-50 bird entries) — no API calls, no backend
- **Platform:** iOS primary, Android secondary — optimised for iOS
- **Performance:** 60fps animations mandatory — only animate transform/opacity (GPU properties)
- **Imports:** No barrel imports — direct source file imports enforced (theme barrel exempted)
- **Rendering:** No `&&` with falsy values — use ternary to prevent crashes
- **Animations:** Reanimated only — all on native/UI thread

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No tab navigator — floating custom UI on map | Map is full-bleed; tab bar would waste space and fight with map gestures | ✓ Good |
| Zustand over Context/Redux | Minimal boilerplate, built-in persist middleware, works well with React Compiler | ✓ Good |
| LegendList over FlashList for community feed | Simpler API, better defaults for this use case | ✓ Good |
| GestureDetector + Gesture.Tap() for button press animation | Runs entirely on UI thread — no JS round-trip for press feedback | ✓ Good |
| Uncontrolled TextInput for onboarding | Avoids re-render on every keystroke, better perf | ✓ Good |
| Code-first design with Paper.design sync | Enables rapid iteration — build in code, refine visually, sync back | ✓ Good |
| Raw Supercluster over react-native-map-clustering | New Architecture/Fabric compatibility — library wrapper incompatible | ✓ Good |
| Stack push navigation over formSheet for profile/community | Consistent cross-platform behavior, simpler implementation | ✓ Good |
| Theme barrel exempted from no-barrel-files rule | Legitimate aggregation point for design tokens | ✓ Good |
| No custom babel.config.js | babel-preset-expo handles React Compiler + Reanimated plugin ordering | ✓ Good |
| OnboardingLayout handles safe area internally | Screens never import useSafeAreaInsets — single responsibility | ✓ Good |
| borderCurve: continuous alongside every borderRadius | iOS continuous corners throughout the app — STYL-01 convention | ✓ Good |
| Emoji placeholders for avatar visuals | No real bird assets available — demonstrates dynamic behavior pattern | ⚠️ Revisit |

---
*Last updated: 2026-03-09 after v1.0 milestone*
