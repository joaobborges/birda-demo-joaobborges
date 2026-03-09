# Project Research Summary

**Project:** Birda v1.1 Polish & Refinement
**Domain:** Mobile bird watching app (React Native / Expo) -- prototype polish milestone
**Researched:** 2026-03-09
**Confidence:** HIGH

## Executive Summary

Birda v1.1 is a polish milestone for an existing Expo SDK 55 / React Native 0.83 prototype. The app already has a working onboarding flow, map with bird markers, and basic navigation. This milestone adds visual refinement (splash screen, Rubik font loading, design token enforcement), interaction upgrades (bottom sheet drawers, auto-scrolling welcome mosaic), a paywall redesign, and native iOS tab navigation. The existing stack handles nearly everything -- only two new packages are needed: `@gorhom/bottom-sheet` for drawer interactions and `@expo-google-fonts/rubik` for the font assets.

The recommended approach is foundation-first: load the Rubik font (which was never actually loaded despite being referenced in typography tokens) and enforce the design system across all screens before building any new features. This prevents the "some screens match, some don't" problem that compounds as features are added. The mosaic animation, bottom sheets, and paywall redesign all build on the enforced design system. The native tab bar conversion comes last because it is the highest-risk structural change and benefits from a stable codebase to fall back on.

The primary risks are: (1) splash-to-app transition flashing white or showing system font before Rubik loads -- mitigated by embedding fonts at build time via the expo-font config plugin, (2) gesture conflicts between the map bottom sheet and MapView pan/zoom -- mitigated by explicit gesture isolation and disabling map interaction when the sheet is expanded, and (3) paywall dismiss leaving onboarding screens in the navigation stack -- mitigated by using the existing state-driven redirect pattern (`completeOnboarding()` then `router.replace('/')`).

## Key Findings

### Recommended Stack

The existing stack (Expo SDK 55, RN 0.83, Expo Router, Zustand 5, Reanimated 4.2.1) is validated and unchanged. Only two new packages are needed.

**New dependencies:**
- `@gorhom/bottom-sheet ^5.2.8`: Bottom sheet drawers for auth and map bird detail -- peer dependencies explicitly support Reanimated >=4.0.0- (confirmed via npm, support added in v5.1.8). GestureHandlerRootView already wraps the app.
- `@expo-google-fonts/rubik ^0.4.2`: Rubik font TTF assets for build-time embedding via expo-font config plugin. The project references `fontFamily: 'Rubik'` everywhere but the font was never loaded -- this is the critical gap.

**No new packages needed for:**
- Splash screen: expo-splash-screen already installed, needs config plugin options only
- Mosaic animation: Reanimated `useFrameCallback` pattern, ~40 lines of code
- Native tab bar: `expo-router/unstable-native-tabs` (NativeTabs), built into expo-router

**Explicitly avoid:**
- `react-native-true-sheet`: Features research recommended it based on outdated gorhom compatibility info, but gorhom v5.2.8 is confirmed compatible with Reanimated 4
- Any marquee/ticker library: Reanimated handles this natively
- `@react-navigation/bottom-tabs`: NativeTabs provides genuine UITabBarController

### Expected Features

**Must have (table stakes):**
- Splash screen with Birda logo and fade transition
- Design system enforcement (Rubik font actually loaded, typography/spacing tokens used across all screens)
- Onboarding layout fixes (progress dots, spacing, overflow on smaller devices)
- Fixed bottom CTA padding (safe area + consistent inset)

**Should have (differentiators):**
- Auto-scrolling bird image mosaic on welcome screen (the "wow" moment)
- Auth bottom drawer (Apple/Google/Email options via bottom sheet)
- Redesigned single paywall (hero image + benefit bullets + pricing card, dismiss-to-home)
- Full-width swipeable map drawer (replaces floating BirdInfoCard)
- Native iOS tab bar for Map/Capture/Logbook (NativeTabs with SF Symbols)

**Defer (v2+):**
- Actual auth integration (requires backend, out of scope for prototype)
- Payment processing (paywall is visual demo only)
- Tab navigator refactor beyond Map/Capture/Logbook

### Architecture Approach

The architecture follows a modify-in-place strategy. No new stores, no new persistence layers, no new data sources. The main structural change is converting `(main)/_layout.tsx` from Stack to NativeTabs, which replaces the floating bottom bar with a native UITabBarController. The floating top bar (profile, community, notifications) remains. Profile and community become push screens within the map tab's navigation stack. Bottom sheets render at the screen level (not portaled) since there is no tab navigator z-index issue in the current structure.

**Major components:**
1. `MosaicAnimation` (new) -- self-contained Reanimated component using `useFrameCallback` for frame-accurate continuous vertical scrolling of bird image columns
2. `@gorhom/bottom-sheet` -- used for auth drawer (single snap point ~40%) and map bird detail drawer (two snap points at 50%/95%)
3. `NativeTabs` layout (modified) -- replaces Stack in (main)/_layout.tsx, provides Map/Capture/Logbook tabs with SF Symbol icons
4. Paywall screen (modified) -- visual redesign with dismiss-to-home via `completeOnboarding()` + `router.replace('/')`

### Critical Pitfalls

1. **Splash/font white flash** -- The app gates splash hide on Zustand hydration only. Adding font loading creates a second async dependency. Mitigation: embed fonts at build time via expo-font config plugin (fonts available synchronously, zero FOUT). Requires EAS rebuild.

2. **Bottom sheet + map gesture conflicts** -- MapView and bottom sheet both consume pan gestures. Mitigation: `pointerEvents="box-none"` on sheet container, disable map interaction when sheet is expanded past threshold, configure `activeOffsetY` on sheet to require deliberate vertical swipe.

3. **Paywall dismiss stack corruption** -- Using `router.push('/(main)')` from onboarding leaves the paywall in the back stack. Mitigation: set `completed: true` in Zustand store first, then `router.replace('/')`. The existing redirect guard routes to `/(main)` based on state.

4. **Mosaic memory pressure** -- 30-50 bird image tiles at full resolution can consume 300-500MB. Mitigation: limit to 12-16 tiles, decode at display size via explicit dimensions on expo-image, animate a single container view (not individual tiles), cancel animation on screen blur.

5. **Tab bar + floating bottom bar overlap** -- Adding NativeTabs while keeping the floating bottom bar creates duplicate navigation. Mitigation: remove floating bottom bar entirely when NativeTabs is added; keep floating top bar only.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (Design System + Splash)
**Rationale:** Every subsequent feature depends on fonts being loaded and design tokens being enforced. The Rubik font gap is the single most pervasive issue -- it affects every screen. Splash screen config change requires an EAS rebuild, so batch it with font embedding (also requires rebuild).
**Delivers:** Working Rubik font across all screens, branded splash screen, all hardcoded styles replaced with theme tokens, fixed bottom CTA padding.
**Addresses:** Splash screen, design system enforcement, onboarding layout fixes, bottom CTA standardization.
**Avoids:** Splash white flash (Pitfall 1), FOUT (Pitfall 1), token migration inconsistency (Pitfall 6).

### Phase 2: Welcome Screen + Auth Drawer
**Rationale:** The welcome screen is the first thing users see after the splash. The mosaic animation is the "hero" visual feature of this milestone. The auth drawer is triggered from the welcome screen buttons, so they are naturally coupled.
**Delivers:** Auto-scrolling bird mosaic, bottom sheet auth drawer with Apple/Google/Email buttons.
**Uses:** @gorhom/bottom-sheet (new), Reanimated useFrameCallback (existing), expo-image (existing).
**Avoids:** Mosaic memory pressure (Pitfall 3) by limiting tiles and using proper image sizing from the start.

### Phase 3: Paywall Redesign
**Rationale:** The paywall is the last onboarding screen before home. It depends on design tokens (Phase 1) being in place. The dismiss-to-home navigation change is a critical flow alteration that must be verified independently.
**Delivers:** Hero image + benefits + pricing card paywall, dismiss navigates to home via state-driven redirect.
**Avoids:** Navigation stack corruption (Pitfall 4) by using `completeOnboarding()` + `router.replace('/')`.

### Phase 4: Native Tab Bar + Map Drawer
**Rationale:** This is the highest-risk change -- it modifies the navigation structure of the main app. Do it after all onboarding work is stable. The map drawer (bottom sheet on map) shares the same bottom sheet library as Phase 2 but adds gesture conflict complexity with MapView.
**Delivers:** Native iOS tab bar (Map/Capture/Logbook) with SF Symbols, placeholder tab screens, full-width swipeable map bird detail drawer.
**Avoids:** Tab bar + floating UI conflict (Pitfall 5) by removing floating bottom bar, gesture conflicts (Pitfall 2) by isolating gestures, z-index layer issues (Pitfall 7) by rendering sheet last in component tree.

### Phase 5: Final Polish
**Rationale:** Pure refinement after all features are integrated. No new components.
**Delivers:** Debug button repositioned to top of screen, cross-feature integration testing, entering animation replay fix on map floating UI.

### Phase Ordering Rationale

- **Foundation first** because the font gap and token inconsistency affect every screen. Fixing this early means all new code uses the design system from day one, eliminating the "migrate later" debt pattern.
- **Welcome + Auth before Paywall** because the welcome screen is the first impression and the mosaic is the highest-impact visual feature. Also, building the bottom sheet for auth validates the gorhom integration before the more complex map drawer use case.
- **Paywall standalone** because the dismiss-to-home navigation change alters the onboarding completion flow and needs isolated testing to catch stack corruption.
- **Tab bar last** because converting from Stack to NativeTabs is structurally invasive. If it proves problematic (alpha API), the fallback is restyling the existing floating bottom bar -- which only works if everything else is already polished.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Welcome Mosaic):** Performance profiling needed -- Reanimated 4.x has documented regressions on New Architecture with many animated nodes. Need to validate tile count and memory impact on target devices.
- **Phase 4 (Native Tabs + Map Drawer):** NativeTabs is alpha (`unstable-native-tabs`). Needs testing for edge cases with iOS 18 and for push-screen-within-tab navigation pattern. Map drawer gesture isolation needs iterative testing.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Well-documented expo-font config plugin, expo-splash-screen config, and straightforward token replacement sweep.
- **Phase 3 (Paywall):** Standard screen redesign with a known navigation pattern (state-driven redirect).
- **Phase 5 (Polish):** Minor layout adjustments, no new patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Both new packages verified via npm. Peer dependencies confirmed. Existing stack unchanged. |
| Features | HIGH | Feature list is well-scoped. All features achievable with recommended stack. Competitor analysis provides clear direction. |
| Architecture | HIGH | Codebase fully analyzed. Integration points are clear. Build order accounts for dependencies. |
| Pitfalls | HIGH | All pitfalls sourced from official docs, verified GitHub issues, and codebase analysis. Recovery strategies identified for each. |

**Overall confidence:** HIGH

### Gaps to Address

- **gorhom runtime validation:** The STACK researcher confirmed gorhom v5.2.8 peer deps support Reanimated 4. The ARCHITECTURE and FEATURES researchers recommended alternatives based on older information. This summary resolves the conflict in favor of gorhom. However, if gorhom exhibits issues at runtime, the fallback is a custom Reanimated bottom sheet (~100 lines, the codebase already uses Gesture.Pan patterns).

- **NativeTabs alpha stability:** The API is imported from `unstable-native-tabs`. Acceptable for a prototype/demo, but no guarantee against breaking changes. Fallback: restyle the existing floating bottom bar with icon-above-label layout and active states.

- **Mosaic performance on older devices:** The 12-16 tile recommendation is general guidance. Actual performance on iPhone SE (3GB RAM) needs device testing. Nuclear fallback: pre-composited mosaic as a single static image.

- **Build-time font naming:** The expo-font config plugin registers fonts under their TTF file names (e.g., `Rubik_400Regular`). The exact names need verification after installing `@expo-google-fonts/rubik` -- typography tokens must map weight references to these specific names.

## Sources

### Primary (HIGH confidence)
- [@gorhom/bottom-sheet npm](https://www.npmjs.com/package/@gorhom/bottom-sheet) -- v5.2.8 peer deps verified: `react-native-reanimated: ">=3.16.0 || >=4.0.0-"`
- [Expo SplashScreen docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/) -- config plugin API
- [Expo Fonts docs](https://docs.expo.dev/develop/user-interface/fonts/) -- build-time embedding via config plugin
- [@expo-google-fonts/rubik npm](https://www.npmjs.com/package/@expo-google-fonts/rubik) -- v0.4.2
- [Reanimated useFrameCallback](https://docs.swmansion.com/react-native-reanimated/examples/marquee/) -- marquee pattern
- Codebase analysis (all source files read directly)

### Secondary (MEDIUM confidence)
- [Expo Router Native Tabs docs](https://docs.expo.dev/router/advanced/native-tabs/) -- NativeTabs API (alpha/unstable)
- [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55) -- NativeTabs availability
- [gorhom/bottom-sheet Reanimated v4 issue #2546](https://github.com/gorhom/react-native-bottom-sheet/issues/2546) -- compatibility confirmed in v5.1.8+

### Tertiary (LOW confidence)
- [Reanimated New Arch perf regression #8250](https://github.com/software-mansion/react-native-reanimated/issues/8250) -- may affect mosaic performance, needs device validation

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
