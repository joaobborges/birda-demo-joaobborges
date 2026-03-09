# Project Research Summary

**Project:** Birda -- Bird Watching Companion App (Interview Prototype)
**Domain:** Map-centric mobile app prototype (Expo/React Native)
**Researched:** 2026-03-09
**Confidence:** MEDIUM-HIGH

## Executive Summary

Birda is a brownfield Expo SDK 55 / React Native 0.83 prototype designed to demonstrate senior mobile engineering craft in an interview setting. The codebase already has the core stack installed (Expo Router, Zustand, Reanimated 4, react-native-maps, LegendList) with a working onboarding flow and map screen. The work ahead is polish and completion, not greenfield construction. Only two new npm packages are needed: `react-native-map-clustering` for map markers and ESLint tooling for code quality. Everything else is configuration, extraction, and new screens using already-installed libraries.

The recommended approach is foundation-first: fix the Zustand hydration race condition, extract theme tokens from 13+ files of hardcoded colors, configure React Compiler, then layer on feature work in dependency order -- onboarding polish, map clustering, form sheet screens (profile/community), and paywall refinement. This ordering ensures the demo is presentable at any stopping point. The architecture follows a full-bleed map shell with native iOS form sheet overlays (no tab navigator), which is the correct pattern for map-first apps and already partially implemented.

The primary risks are: (1) react-native-map-clustering compatibility with New Architecture/Fabric -- this must be verified immediately during integration, with a fallback to raw Supercluster if it fails; (2) React Compiler potentially breaking Reanimated worklets -- Babel plugin ordering is critical; (3) entering animations replaying on route focus, which is an existing bug that will look especially bad in a demo. All three have known mitigations documented in the pitfalls research.

## Key Findings

### Recommended Stack

The stack is 90% installed. The project runs on Expo SDK 55 with React Native 0.83 (New Architecture enabled), Expo Router for file-based navigation, Zustand 5 for state management, and Reanimated 4 for animations. These are current, well-matched versions with no compatibility concerns.

**Core technologies (already installed):**
- **Expo SDK 55 + RN 0.83:** New Architecture enabled, native module support via EAS Dev Client
- **Expo Router:** File-based navigation with native Stack screens
- **react-native-screens 4.23:** Native formSheet presentation with detents (verified in source)
- **Zustand 5 + AsyncStorage:** Client-only persistent state, no backend needed
- **Reanimated 4 + Gesture Handler:** UI-thread animations and gesture-driven interactions
- **LegendList 2.0.19:** Dynamic-height list virtualization for community feed
- **expo-image:** High-performance image loading with blurhash support

**To install:**
- `react-native-map-clustering` (^3.4) -- Supercluster-based marker clustering
- ESLint 9 + `@expo/eslint-config` + `eslint-plugin-react` + `eslint-plugin-no-barrel-files`

**Key "do not use" decisions:** No expo-linear-gradient (RN 0.83 has built-in gradients), no gorhom/bottom-sheet (native formSheet is superior), no NativeWind (mid-project style migration is wasteful), no React Query (no backend/API calls).

### Expected Features

**Must have (table stakes):**
- Multi-step onboarding with progress indication (exists, needs polish)
- Paywall screen with animated plan toggle (exists, needs responsive width fix)
- Full-bleed map with bird markers and info card (exists)
- Marker clustering (not built -- use react-native-map-clustering)
- Profile screen as native form sheet (not built)
- Community feed with LegendList (not built)
- Theme/color token consistency (not done -- hardcoded colors across 13+ files)
- Store hydration guard to prevent flash of onboarding (not done -- visible bug)

**Should have (differentiators that win interviews):**
- React Compiler integration (single config change, major talking point)
- ESLint crash prevention rules (jsx-no-leaked-render, no-barrel-files)
- FPS monitor via Reanimated useFrameCallback in debug panel
- Shared onboarding layout extraction (7 duplicated StyleSheets is a code smell)
- Production bundle optimizations (tree shaking, R8, Hermes verification)
- `borderCurve: 'continuous'` throughout (native iOS polish detail)

**Defer entirely:**
- Real auth/backend, camera capture, working logbook, push notifications, payment processing, ML bird ID, dark mode, i18n, automated tests, CI/CD pipeline

### Architecture Approach

The app uses a full-bleed map shell pattern: the map is the always-visible primary surface, with all secondary screens (profile, community) presented as native iOS form sheets via react-native-screens. There is no tab navigator -- floating UI buttons overlay the map and trigger sheet presentations. State is exclusively client-side via a single Zustand store (onboarding data). Bird data is a static typed array. This is the correct architecture for a map-first app and should not change.

**Major components:**
1. **Root Layout** -- GestureHandlerRootView wrapper, StatusBar config, DevPanel mount point
2. **Router Guard** (app/index.tsx) -- gates navigation on `onboarding.completed` after hydration
3. **Onboarding Stack** -- linear 8-screen wizard flow with disabled back gesture
4. **Map Screen** -- ClusteredMapView + floating UI overlay + BirdInfoCard
5. **Profile/Community Sheets** -- formSheet presentation reading from store and static data
6. **OnboardingStore** -- Zustand with AsyncStorage persist, single source of user state
7. **Theme module** -- color tokens, typography, spacing (to be extracted from hardcoded values)

### Critical Pitfalls

1. **Zustand hydration race condition** -- returning users see a flash of onboarding. Fix: gate routing on `hasHydrated()`. This is a one-line fix but must be done first.
2. **react-native-map-clustering + New Architecture** -- clustering library may not support Fabric. Test immediately during integration; fallback is raw Supercluster. Markers must be direct children of ClusteredMapView, not wrapped in fragments.
3. **React Compiler breaking Reanimated worklets** -- Babel plugin ordering matters. Reanimated plugin must come BEFORE React Compiler. Use `'use no memo'` directive in worklet-heavy files if needed.
4. **Entering animations replaying on route focus** -- floating UI elements on map re-animate when returning from sheets. Use mount-once shared value pattern instead of `entering` prop.
5. **Hardcoded paywall toggle width** -- breaks on different screen sizes. Fix with `onLayout` + shared values for responsive calculation.

## Implications for Roadmap

### Phase 1: Foundation and Tooling
**Rationale:** Theme tokens, hydration fix, and tooling affect every subsequent phase. Doing this first means all future code is consistent and correct from the start.
**Delivers:** Unified color/typography system, working return-user flow, auto-memoization, lint safety net
**Addresses:** Theme consistency (table stakes), store hydration guard (table stakes), React Compiler (differentiator), ESLint rules (differentiator)
**Avoids:** Pitfall 4 (hydration race), Pitfall 11 (font loading), Pitfall 10 (compiler + worklets -- verify early)

### Phase 2: Onboarding Polish
**Rationale:** Onboarding is the first-run experience. A polished onboarding means the demo is presentable even if later phases are incomplete. Depends on Phase 1 theme tokens.
**Delivers:** Smooth animated wizard flow, shared layout (DRY), uncontrolled inputs, spring animations
**Addresses:** Onboarding polish (table stakes), shared layout extraction (differentiator), uncontrolled TextInput (differentiator)
**Avoids:** Pitfall 2 (JS-thread animations), Pitfall 7 (entering animation replay on push screens is fine)

### Phase 3: Map Enhancement
**Rationale:** The map is the primary screen and the core value proposition. Clustering changes the MapView import fundamentally, so it must be done before wiring sheet navigation from the map.
**Delivers:** Clustered markers, extracted BirdMarker/BirdInfoCard components, refined floating UI
**Addresses:** Marker clustering (table stakes), component extraction (architecture quality)
**Avoids:** Pitfall 1 (clustering integration), Pitfall 6 (image markers jank), Pitfall 8 (New Architecture compatibility), Pitfall 14 (location permission UX)

### Phase 4: Form Sheets (Profile and Community)
**Rationale:** Profile and community screens are opened from the map. The map must be stable first. These screens establish the form sheet convention for any future overlays.
**Delivers:** Native iOS profile sheet, community feed with LegendList, form sheet configuration pattern
**Addresses:** Profile screen (table stakes), community feed (table stakes)
**Avoids:** Pitfall 3 (non-native modal), Pitfall 12 (LegendList blank frames)

### Phase 5: Paywall Polish
**Rationale:** Paywall is in the onboarding flow (can run in parallel with Phases 3-4). Needs responsive toggle fix and variant architecture cleanup.
**Delivers:** Responsive plan toggle, variant data extraction, spring animations, Nature Day banner
**Addresses:** Paywall polish (table stakes), A/B variant architecture (differentiator)
**Avoids:** Pitfall 9 (hardcoded toggle width), Pitfall 2 (JS-thread toggle animation)

### Phase 6: Dev Tooling and Debug Panel
**Rationale:** Debug panel enhancements (FPS monitor, state inspector) support development throughout but the FPS monitor specifically validates Phase 7 optimizations. Lower priority than user-facing features.
**Delivers:** FPS monitor via useFrameCallback, improved DevPanel UX, state inspector
**Addresses:** FPS monitor (differentiator), debug panel (differentiator)

### Phase 7: Production Optimization and QA
**Rationale:** Optimization must come last -- features must be complete before they can be measured and optimized. Verifies Hermes bytecode, tree shaking, bundle size.
**Delivers:** Verified production build, 60fps animations, correct Hermes compilation, Android shadow fallbacks
**Addresses:** Production bundle optimizations (differentiator), 60fps verification (table stakes)
**Avoids:** Pitfall 5 (missing Hermes bytecode), Pitfall 13 (Android shadow fallback), Pitfall 10 (final React Compiler verification)

### Phase Ordering Rationale

- **Foundation first** because theme tokens and React Compiler configuration propagate to every component written afterward. The hydration fix eliminates the most visible bug.
- **Onboarding before map** because onboarding is the first-run experience -- if the demo starts there, it must be polished.
- **Map before sheets** because sheets are opened from the map. The map's clustering changes its component structure, which must stabilize before wiring navigation to sheets.
- **Paywall is semi-independent** -- it lives in the onboarding flow and can be polished in parallel with map/sheet work.
- **Optimization last** because premature optimization is waste; features must exist before they can be profiled.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Map Enhancement):** react-native-map-clustering + New Architecture compatibility is unverified. Must test on device before committing to the library. Have Supercluster fallback ready.
- **Phase 1 (Foundation):** React Compiler + Reanimated 4 interaction needs hands-on verification. Babel plugin order and worklet exclusion patterns must be tested.

Phases with standard, well-documented patterns (skip deep research):
- **Phase 2 (Onboarding Polish):** Standard Reanimated animation patterns, shared layout extraction is straightforward refactoring.
- **Phase 4 (Form Sheets):** react-native-screens formSheet is verified in the installed source code. Configuration-only work.
- **Phase 5 (Paywall Polish):** onLayout + shared values is a well-documented Reanimated pattern.
- **Phase 7 (Production Optimization):** Standard Expo/EAS build configuration documented in official guides.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core dependencies verified from installed package.json and node_modules. Only react-native-map-clustering version needs npm resolution. |
| Features | MEDIUM | Feature priorities are sound for interview context. Birding app domain knowledge from training data (not verified). Interview evaluation criteria based on general industry knowledge. |
| Architecture | HIGH | Architecture verified from existing codebase. Form sheet APIs confirmed in installed react-native-screens source. Patterns are standard Expo Router conventions. |
| Pitfalls | MEDIUM-HIGH | Pitfalls are grounded in codebase analysis and known RN ecosystem issues. New Architecture + clustering compatibility is the main uncertainty. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **react-native-map-clustering + Fabric compatibility:** No way to verify without running `npm install` and testing on device. Plan for Supercluster fallback during Phase 3 planning.
- **React Compiler + Reanimated 4 edge cases:** Known to mostly work but silent animation breakage is possible. Needs manual testing after enabling.
- **ESLint 9 + @expo/eslint-config compatibility:** Exact version compatibility with SDK 55 unverified. Resolve at install time.
- **LegendList stability:** Smaller community than FlashList. If issues arise, vanilla FlatList is sufficient for ~50 mock items.
- **`experimental_backgroundImage` for gradients:** Marked experimental in RN 0.83. Functional but may have edge cases on Android. Test gradient rendering on both platforms.

## Sources

### Primary (HIGH confidence)
- Project `package.json` -- all installed dependency versions verified
- Project `node_modules/` -- react-native-screens formSheet API, React Compiler 1.0, LegendList 2.0.19 verified in source
- PRD (`PRD-CLAUDE/01-PRD.md`) -- feature scope, architecture decisions, library choices
- Codebase analysis (`.planning/codebase/`) -- current implementation state, known issues

### Secondary (MEDIUM confidence)
- React Native 0.83 New Architecture patterns (training data)
- Reanimated 4.x worklet/compiler interaction patterns (training data)
- react-native-map-clustering usage patterns (training data)
- react-native-screens 4.x form sheet API (training data, confirmed against installed source)

### Tertiary (LOW confidence)
- Birding app domain knowledge (eBird, Merlin, Birda comparisons -- training data, not web-verified)
- Mobile engineering interview evaluation patterns (general industry knowledge)

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
