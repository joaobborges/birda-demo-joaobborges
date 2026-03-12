---
status: diagnosed
trigger: "Rubik font not loading/rendering in Expo app"
created: 2026-03-09T00:00:00Z
updated: 2026-03-09T00:00:00Z
---

## Current Focus

hypothesis: No runtime font loading -- config plugin only works in native builds, not Expo Go
test: Search codebase for useFonts/loadAsync calls
expecting: None found
next_action: Report root cause

## Symptoms

expected: Rubik font renders across all text in the app
actual: System font displayed instead (font fallback)
errors: None reported (silent fallback)
reproduction: Run app in Expo Go dev client
started: After Phase 04 added font config

## Eliminated

(none needed -- root cause found on first hypothesis)

## Evidence

- timestamp: 2026-03-09
  checked: app.json expo-font plugin config (lines 36-46)
  found: 5 Rubik weight .ttf files correctly referenced via config plugin
  implication: Build-time embedding is configured correctly for native builds

- timestamp: 2026-03-09
  checked: node_modules/@expo-google-fonts/rubik/400Regular/
  found: .ttf files exist at the exact paths referenced in app.json
  implication: Paths are valid, dependency is installed

- timestamp: 2026-03-09
  checked: Entire codebase for useFonts, loadAsync, Font.load
  found: ZERO matches -- no runtime font loading anywhere
  implication: In Expo Go, fonts are never loaded at runtime

- timestamp: 2026-03-09
  checked: app/_layout.tsx
  found: No useFonts hook, no font loading, no font-ready gating
  implication: App renders immediately without waiting for fonts

- timestamp: 2026-03-09
  checked: src/theme/typography.ts
  found: fontFamily references like "Rubik_400Regular" are correct naming convention
  implication: Typography tokens are fine; the problem is upstream (fonts never loaded)

## Resolution

root_cause: |
  The expo-font config plugin in app.json (lines 36-46) ONLY embeds fonts at
  native build time (EAS Build / expo run:ios / expo run:android). It does NOT
  load fonts in Expo Go, which is a pre-built client that cannot run config plugins.

  There is NO runtime font loading anywhere in the codebase. The app/_layout.tsx
  has no useFonts() hook from @expo-google-fonts/rubik or expo-font. Therefore,
  when running in Expo Go (the typical dev workflow), the fonts are never loaded
  and React Native silently falls back to the system font.

fix: |
  Add runtime font loading in app/_layout.tsx using the useFonts hook from
  @expo-google-fonts/rubik. Gate rendering on fontsLoaded to prevent FOUT.
  Keep the config plugin for production builds (it's a performance optimization).

verification: pending
files_changed: []
