---
status: resolved
phase: 03-map-and-screens
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md]
started: 2026-03-09T15:00:00Z
updated: 2026-03-09T16:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Map Marker Clustering
expected: Map screen shows bird markers. When zoomed out, nearby markers cluster into a single blue circle showing the count. Tapping a cluster zooms in to expand it into individual markers.
result: pass

### 2. Shape-Coded Rarity Markers
expected: Individual bird markers use different shapes by rarity — green circles for common, orange diamonds for uncommon, red stars for rare birds.
result: pass

### 3. Bird Info Card
expected: Tapping a bird marker opens a slide-up detail card showing the bird's image, name, rarity badge, and a close button to dismiss.
result: pass

### 4. Floating Navigation Icons
expected: Map screen has floating icon buttons (profile, community, notifications, capture, logbook) using Ionicons — no emoji visible anywhere.
result: issue
reported: "Profile icon is filled but community, notifications, capture and logbook icons are outline-only. All icons should be consistent (all filled)."
severity: cosmetic

### 5. Clean Map Style
expected: Map background is clean and muted with no POI labels or building outlines visible.
result: pass

### 6. Profile Screen
expected: Profile screen shows an Ionicons person icon on a blue circle as avatar. Achievement badges display as icons on soft pastel background circles with labels below.
result: pass

### 7. Community Feed
expected: Community screen shows sighting cards with a heart-outline icon and like count on each card. Screen uses stack header navigation (no duplicate title).
result: issue
reported: "Community feed doesn't feel like a proper social feed — needs large image on top, short description, location. Also header shows 'index' text on back arrow instead of just an icon."
severity: major

## Summary

total: 7
passed: 5
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "Floating navigation icons should all use consistent filled style"
  status: resolved
  reason: "User reported: Profile icon is filled but community, notifications, capture and logbook icons are outline-only. All icons should be consistent (all filled)."
  severity: cosmetic
  test: 4
  root_cause: "All 5 floating nav icons use outline variants (person-circle-outline, people-outline, notifications-outline, camera-outline, book-outline). Need filled equivalents."
  artifacts:
    - path: "app/(main)/index.tsx"
      issue: "Lines 141, 145, 148, 158, 163 use outline icon names"
  missing:
    - "Change icon names to filled variants: person-circle, people, notifications, camera, book"
  debug_session: ""

- truth: "Community feed shows sighting cards as a proper social feed with large image, description, location, and clean header navigation"
  status: resolved
  reason: "User reported: Community feed doesn't feel like a proper social feed — needs large image on top, short description, location. Also header shows 'index' text on back arrow instead of just an icon."
  severity: major
  test: 7
  root_cause: "SightingItem uses horizontal row layout (flexDirection: row) with 90x100 thumbnail. Index screen has no title set so back button shows literal 'index' name."
  artifacts:
    - path: "app/(main)/community.tsx"
      issue: "Line 75 flexDirection row, lines 82-84 tiny 90x100 image"
    - path: "app/(main)/_layout.tsx"
      issue: "Line 6 index screen has no title, no headerBackTitle set on community"
  missing:
    - "Restructure SightingItem to vertical layout with full-width hero image (~200px), description, location with icon"
    - "Add headerBackTitle: '' to community screen options in _layout.tsx"
  debug_session: ""
