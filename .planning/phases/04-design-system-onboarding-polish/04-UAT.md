---
status: diagnosed
phase: 04-design-system-onboarding-polish
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md]
started: 2026-03-09T20:00:00Z
updated: 2026-03-09T20:08:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Start the app fresh with `npx expo start`. The app boots without errors in the terminal and loads in the simulator/device without crash.
result: pass

### 2. Splash Screen with Birda Logo
expected: On app launch, a splash screen with the Birda bird logo appears briefly (~0.5s minimum) before the first screen loads.
result: issue
reported: "i dont see the splash screen"
severity: major

### 3. Rubik Font Rendering
expected: Text throughout the app (headings, body, buttons) renders in the Rubik typeface instead of the system default font. Different weights are visible (e.g., bolder headings vs lighter body text).
result: issue
reported: "its not loading"
severity: major

### 4. Blue Pill-Shaped Primary Buttons
expected: Primary CTA buttons (e.g., "Continue" on onboarding screens) are blue (#1F87FE), pill-shaped (fully rounded ends), with white text.
result: pass

### 5. Button Disabled State on Name Screen
expected: On the name entry screen, the "Continue" button starts dimmed/disabled (lower opacity). After typing a name, it becomes fully opaque and tappable.
result: pass

### 6. No Skip Button on Name Screen
expected: The name entry onboarding screen does NOT have a "Skip" button. The only way forward is entering a name and tapping Continue.
result: pass

### 7. Progress Dots Styling
expected: Onboarding progress dots show the active dot in blue and inactive dots as white at ~50% opacity (translucent, not gray).
result: pass

### 8. Overflow Fixed on Reminders & Mailing List
expected: The reminders and mailing-list onboarding screens display all content without any text or elements being clipped or overflowing off-screen.
result: issue
reported: "still not set as it should - title 'Stay in the loop' clipped at top, layout broken with large empty space"
severity: major

## Summary

total: 8
passed: 5
issues: 3
pending: 0
skipped: 0

## Gaps

- truth: "Splash screen with Birda bird logo appears briefly (~0.5s minimum) before the first screen loads"
  status: failed
  reason: "User reported: i dont see the splash screen"
  severity: major
  test: 2
  root_cause: "expo-splash-screen plugin in app.json registered as bare string with no config. Top-level splash key is deprecated in SDK 55 and ignored. No image specified in plugin options."
  artifacts:
    - path: "app.json"
      issue: "Line 47: expo-splash-screen plugin has no configuration object. Lines 11-15: deprecated top-level splash key ignored."
  missing:
    - "Configure expo-splash-screen plugin with image, resizeMode, backgroundColor"
    - "Remove deprecated top-level splash key"
  debug_session: ""

- truth: "Text renders in Rubik typeface with visible weight differences"
  status: failed
  reason: "User reported: its not loading"
  severity: major
  test: 3
  root_cause: "No useFonts() hook anywhere in codebase. expo-font config plugin only works in EAS/production builds, not Expo Go. No runtime font loading exists."
  artifacts:
    - path: "app/_layout.tsx"
      issue: "Missing useFonts() hook and font-readiness gating"
    - path: "app.json"
      issue: "Config plugin is correct for production but insufficient alone for dev"
  missing:
    - "Add useFonts() hook with 5 Rubik variants in app/_layout.tsx"
    - "Gate rendering and splash hide on fontsLoaded being true"
  debug_session: ".planning/debug/rubik-font-not-loading.md"

- truth: "Reminders and mailing-list screens display all content without clipping or overflow"
  status: failed
  reason: "User reported: still not set as it should - title clipped at top, layout broken with large empty space"
  severity: major
  test: 8
  root_cause: "OnboardingLayout only applies safe area top padding when illustration or header props are provided. Reminders passes neither, so content starts at y=0 behind notch. flexGrow:1 on scrollContent creates unbounded empty space."
  artifacts:
    - path: "src/components/onboarding/OnboardingLayout.tsx"
      issue: "Lines 20-33: no fallback safe area padding. Line 70: flexGrow:1 causes empty space"
    - path: "app/(onboarding)/reminders.tsx"
      issue: "Passes no illustration or header prop, triggering unpadded path"
  missing:
    - "Add fallback paddingTop with safe area inset when neither illustration nor header provided"
    - "Fix vertical content distribution for screens without illustration"
  debug_session: ".planning/debug/reminders-layout-broken.md"
