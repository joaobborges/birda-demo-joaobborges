---
status: diagnosed
phase: 15-image-wiring
source: 15-01-SUMMARY.md, 15-02-SUMMARY.md
started: 2026-03-10T19:00:00Z
updated: 2026-03-10T19:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Bird Images in Welcome Mosaic
expected: The welcome screen's BirdMosaic shows real bird photos loaded from local assets. No broken image icons or blank spaces.
result: issue
reported: "some images have the bird's face out of the composition — needs repositioning so the face of all birds is more towards the center of the container"
severity: minor

### 2. Bird Image in Map Info Card
expected: Tapping a bird pin on the map shows a BirdInfoCard with the bird's photo rendered from a local asset. Image fills its container properly.
result: issue
reported: "pin is not tappable at all — regression from when the tappable area radius was increased in a previous change, which broke pin tapping entirely"
severity: major

### 3. Bird Image in Detail Screen
expected: Opening a bird detail screen displays the bird's photo prominently. The image loads instantly from the local asset (no network spinner).
result: skipped
reason: Can't access bird detail — map pins not tappable (blocked by same regression as test 2)

### 4. Community Sightings Show Bird Images
expected: The community feed/sightings list shows bird images next to each sighting entry, loaded from local assets.
result: pass

### 5. Onboarding Illustration Screens
expected: Navigating through onboarding screens (ai-bird-id, discover, goals, green-time, community, mailing-list, reminders) each show an Image component in the illustration zone. Currently placeholders (transparent), but no crashes or missing-image errors.
result: pass

### 6. Name Screen Avatar
expected: The name input screen shows an avatar image placeholder (from manifest). No emoji fallback, no crash.
result: issue
reported: "no image showing (expected — placeholder), but title uses bold font that doesn't match heading style of other onboarding screens"
severity: cosmetic

### 7. Birding Journey Avatars
expected: The birding journey/skill-level selection screen shows avatar images (not emoji text) inside circular containers for each skill level option.
result: pass

### 8. Paywall Hero Image
expected: The paywall screen shows an Image component in the hero zone (currently placeholder). The image fills the hero area with absoluteFillObject positioning. No crash or layout break.
result: pass

## Summary

total: 8
passed: 4
issues: 3
pending: 0
skipped: 1

## Gaps

- truth: "Bird images in mosaic show the bird's face centered/visible in the container"
  status: failed
  reason: "User reported: some images have the bird's face out of the composition — needs repositioning so the face of all birds is more towards the center of the container"
  severity: minor
  test: 1
  root_cause: "Portrait-oriented bird photos (head in top 15-30% of frame) are center-cropped by contentFit='cover' in landscape containers, cutting off bird heads. All 5 image components lack contentPosition override."
  artifacts:
    - path: "src/components/welcome/BirdMosaic.tsx"
      issue: "contentFit='cover' without contentPosition"
    - path: "src/components/map/BirdInfoCard.tsx"
      issue: "contentFit='cover' without contentPosition"
    - path: "src/components/map/BirdDrawerContent.tsx"
      issue: "contentFit='cover' without contentPosition"
    - path: "app/bird-detail.tsx"
      issue: "contentFit='cover' without contentPosition"
    - path: "app/(main)/community.tsx"
      issue: "contentFit='cover' without contentPosition"
  missing:
    - "Add contentPosition='top' to all 5 bird image components"
  debug_session: ".planning/debug/bird-image-cropping.md"

- truth: "Tapping a bird pin on the map opens the BirdInfoCard"
  status: failed
  reason: "User reported: pin is not tappable at all — regression from when the tappable area radius was increased in a previous change, which broke pin tapping entirely"
  severity: major
  test: 2
  root_cause: "Commit 5e48bc4 wrapped each bird marker in a 44x44 transparent hitArea View. react-native-maps converts Marker children to native annotation bitmaps — the oversized transparent annotations overlap each other, and iOS MKMapView hit-testing fails on transparent pixels and overlapping annotations."
  artifacts:
    - path: "src/components/map/BirdMarker.tsx"
      issue: "44x44 hitArea wrapper causing overlapping native annotations with transparent pixels"
  missing:
    - "Remove 44x44 hitArea wrapper View and use Marker's native hitSlop or keep markers at original 14-18px size"
  debug_session: ".planning/debug/map-pins-not-tappable.md"

- truth: "Name screen title uses same heading style as other onboarding screens"
  status: failed
  reason: "User reported: title uses bold font that doesn't match heading style of other onboarding screens"
  severity: cosmetic
  test: 6
  root_cause: "name.tsx uses typography.subheading + manual overrides (fontFamily: Rubik_700Bold, fontSize: 24) resulting in bold 24px text, while other onboarding screens use typography.h2/h3 (Rubik_400Regular, 26-30px)"
  artifacts:
    - path: "app/(onboarding)/name.tsx"
      issue: "Lines 69-71: uses typography.subheading with bold override instead of typography.h2/h3"
  missing:
    - "Replace heading style with typography.h3 (or h2) to match other onboarding screens"
  debug_session: ".planning/debug/name-screen-font-weight.md"
