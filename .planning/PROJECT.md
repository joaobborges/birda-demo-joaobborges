# Birda

## What This Is

Birda is a bird watching companion app prototype built for an interview demo. It features a polished onboarding flow with auto-scrolling bird mosaic welcome screen, bottom-sheet auth drawer, conversion-optimized paywall, native tab bar, and a map home screen with Supercluster clustering and full-width swipeable bird detail drawer. All images are wired to named local assets via imageManifest.ts — 20 real bird species photos from Wikimedia Commons plus named placeholders for onboarding/paywall illustrations ready for drop-in replacement. All data is local — no API, no backend. Built with Expo (SDK 55) + React Native + EAS Dev Client.

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

- ✓ Splash screen with Birda logo on launch — v1.1 (FOUN-05)
- ✓ All text renders in Rubik typeface with build-time font loading — v1.1 (FOUN-06)
- ✓ All CTA buttons use design system color tokens — v1.1 (FOUN-07)
- ✓ All screens use spacing tokens for consistent gaps — v1.1 (FOUN-08)
- ✓ Fixed bottom CTA containers use 24px bottom / 16px horizontal padding — v1.1 (FOUN-09)
- ✓ Welcome screen with auto-scrolling bird mosaic in 3 columns — v1.1 (WELC-01, WELC-02)
- ✓ Auth bottom drawer with Apple, Google, Email sign-in options — v1.1 (AUTH-01, AUTH-02, AUTH-03)
- ✓ Progress dots with correct styling and fixed position — v1.1 (ONBR-04, ONBR-05)
- ✓ Onboarding layout fixes (avatar spacing, name CTA, overflow) — v1.1 (ONBR-06, ONBR-07, ONBR-08, ONBR-09, ONBR-10)
- ✓ Conversion paywall with hero, bullets, social proof, pricing, dismiss-to-home — v1.1 (PAYW-04 through PAYW-10)
- ✓ Native tab bar with Map, Capture, Logbook tabs — v1.1 (NAV-01)
- ✓ Dev panel via double-tap gesture — v1.1 (NAV-02)
- ✓ Full-width swipeable bird detail drawer above all content — v1.1 (NAV-03, NAV-04, NAV-05)

- ✓ Auth backdrop covers full welcome screen including mosaic grid — v1.2 (UFIX-01)
- ✓ Onboarding inactive progress dots blue at 50% opacity — v1.2 (UFIX-02)
- ✓ Capture tab replaced with floating action button on Map tab — v1.2 (UFIX-03)
- ✓ FAB opens animated speed-dial menu (Camera/Mic/Notes) — v1.2 (UFIX-04)
- ✓ Welcome screen mosaic wired to 20 local bird image assets — v1.2 (IMG-01)
- ✓ Onboarding screens wired to hero/cover image assets — v1.2 (IMG-02)
- ✓ Name screen wired to avatar image asset — v1.2 (IMG-03)
- ✓ Map markers wired to species thumbnail assets — v1.2 (IMG-04)
- ✓ Bird detail drawer wired to species thumbnail — v1.2 (IMG-05)
- ✓ Bird detail screen wired to species hero image — v1.2 (IMG-06)
- ✓ Complete image manifest with filenames, dimensions, locations — v1.2 (IMG-07)

### Active

(No active requirements — all shipped through v1.2)

### Out of Scope

- Expo Go support — maps require native modules, EAS dev client only
- Real authentication or backend — prototype uses local data only
- Capture flow — FAB opens animated menu, options are visual only (no camera/mic integration)
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
- **Shipped:** v1.2 UI Polish & Image Wiring on 2026-03-12 (2 phases, 5 plans, 3 days)
- **Previous:** v1.1 Polish & Refinement on 2026-03-10, v1.0 MVP on 2026-03-09
- **Codebase:** 4,059 LOC TypeScript/TSX
- **Stack:** Expo SDK 55, React Native 0.83, Zustand, Reanimated, react-native-maps, Supercluster, Ionicons, @gorhom/bottom-sheet, @expo-google-fonts/rubik
- **Design workflow:** Code-first approach, synced to Paper.design via MCP for visual refinement
- **PRD reference:** `PRD-CLAUDE/01-PRD.md`
- **Codebase map:** `.planning/codebase/` — 7 documents covering stack, architecture, structure, conventions, testing, integrations, concerns
- **Tech debt:** See MILESTONES.md for v1.0 and v1.1 tech debt items

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
| Emoji placeholders for avatar visuals | Resolved in v1.2 — avatars now use ImageSource from imageManifest | ✓ Good |
| Weight-specific font family names (Rubik_400Regular) | React Native requires family name encoding for static font loading | ✓ Good |
| @gorhom/bottom-sheet for auth + map drawers | Reanimated 4 peer dep support, smooth gestures, portal rendering | ✓ Good |
| Standalone layouts for welcome + paywall | Unique screens need full viewport control, not OnboardingLayout wrapper | ✓ Good |
| NativeTabs → standard Expo Router Tabs fallback | NativeTabs alpha caused runtime issues; planned fallback activated | ✓ Good |
| BottomSheetModalProvider at root layout | Required for portal rendering above tab bar | ✓ Good |
| Bird detail screen at root app/ level | Avoids tab routing conflicts — stack push from any context | ✓ Good |
| 44x44px hit area on map markers | Apple HIG / Android minimum tap target guideline | ✓ Good |
| Double-tap (not triple-tap) dev panel trigger | Triple-tap too unreliable in testing | ✓ Good |
| BottomSheet containerStyle for full-screen auth backdrop | containerStyle (not style) fills portal to full screen | ✓ Good |
| Single shared progress value (0-1) for CaptureFAB animations | All animations synchronized from one useSharedValue | ✓ Good |
| Wikipedia API for Wikimedia Commons URL discovery | Original birds.ts URLs returned 404 (files renamed/moved) | ✓ Good |
| Bird.image: ImageSource from expo-image | Accepts require() return type natively, no uri wrapper needed | ✓ Good |
| imageManifest.ts as single source of truth | All require() references in one file; screens import from manifest | ✓ Good |
| Minimal 1x1 transparent PNG placeholders | Metro requires files to exist at build time; Buffer-based generation | ✓ Good |
| contentPosition=top on all bird images | Bird heads stay visible across all container shapes and sizes | ✓ Good |
| Direct Marker children (no wrapper View) | Removed 44x44 hitArea wrapper that caused iOS annotation overlap | ✓ Good |

---
*Last updated: 2026-03-12 after v1.2 milestone completion*
