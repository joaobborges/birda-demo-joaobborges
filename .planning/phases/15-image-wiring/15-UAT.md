---
status: complete
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
  artifacts: []
  missing: []

- truth: "Tapping a bird pin on the map opens the BirdInfoCard"
  status: failed
  reason: "User reported: pin is not tappable at all — regression from when the tappable area radius was increased in a previous change, which broke pin tapping entirely"
  severity: major
  test: 2
  artifacts: []
  missing: []

- truth: "Name screen title uses same heading style as other onboarding screens"
  status: failed
  reason: "User reported: title uses bold font that doesn't match heading style of other onboarding screens"
  severity: cosmetic
  test: 6
  artifacts: []
  missing: []
