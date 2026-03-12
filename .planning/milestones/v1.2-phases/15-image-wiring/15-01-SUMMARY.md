---
phase: 15-image-wiring
plan: 01
subsystem: ui
tags: [expo-image, react-native, local-assets, bird-data]

requires: []
provides:
  - 20 bird species JPEG files in src/assets/birds/ (kebab-case named)
  - Bird.image type changed from string to ImageSource (expo-image)
  - All 20 bird entries use require('@/assets/birds/*.jpg') for local assets
  - All 5 consumer components (BirdMosaic, BirdInfoCard, BirdDrawerContent, bird-detail, community) render images from local assets
affects: [15-image-wiring]

tech-stack:
  added: []
  patterns:
    - "ImageSource type from expo-image for typed local require() image references"
    - "require('@/assets/birds/{kebab-name}.jpg') pattern for static bird images"

key-files:
  created:
    - scripts/download-images.js
    - src/assets/birds/*.jpg (20 files)
    - src/data/birds.ts
  modified:
    - package.json
    - src/components/welcome/BirdMosaic.tsx
    - src/components/map/BirdInfoCard.tsx
    - src/components/map/BirdDrawerContent.tsx
    - app/bird-detail.tsx
    - app/(main)/community.tsx

key-decisions:
  - "Used Wikipedia API to discover correct Wikimedia Commons filenames when original birds.ts URLs returned 404 (many had moved)"
  - "ImageSource from expo-image used for Bird.image type — accepts require() return type natively"
  - "Community sightings use require() directly (same asset dir) rather than importing from birds.ts"

patterns-established:
  - "Static image pattern: Bird.image: ImageSource = require('@/assets/birds/{kebab-name}.jpg')"
  - "All Image components use source={bird.image} without uri: wrapper for local assets"

requirements-completed: [IMG-01, IMG-04, IMG-05, IMG-06]

duration: 11min
completed: 2026-03-10
---

# Phase 15 Plan 01: Image Wiring — Local Asset Download & Wiring Summary

**20 bird species JPEGs downloaded to src/assets/birds/, Bird.image typed as ImageSource with require() imports, and all 5 bird-image-consuming components updated to use local assets without uri wrappers.**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-03-10T18:01:48Z
- **Completed:** 2026-03-10T18:12:50Z
- **Tasks:** 2
- **Files modified:** 8 (+ 20 image files created)

## Accomplishments

- Created re-runnable `scripts/download-images.js` Node.js download script with retry/backoff and skip-existing logic
- Downloaded all 20 bird species JPEG images (3KB-74KB each) to src/assets/birds/
- Updated Bird interface: `image: string` -> `image: ImageSource` (expo-image type)
- Replaced all 20 `image: 'https://...'` entries in birds.ts with `require('@/assets/birds/*.jpg')`
- Updated all 5 consumer components to use `source={bird.image}` (removed `{ uri: }` wrappers)
- Updated community.tsx Sighting interface and SIGHTINGS array to use same local assets
- TypeScript compiles cleanly with zero errors

## Task Commits

1. **Task 1: Create download script and fetch bird images** - `6d02294` (feat)
2. **Task 2: Update Bird type and wire all consumers** - `bf916c2` (feat)

## Files Created/Modified

- `scripts/download-images.js` - Re-runnable download script using verified Wikimedia Commons URLs
- `src/assets/birds/*.jpg` - 20 JPEG files, one per species, kebab-case named
- `src/data/birds.ts` - Bird.image: ImageSource, 20 require() imports
- `package.json` - Added `download-images` npm script
- `src/components/welcome/BirdMosaic.tsx` - Two source= props updated
- `src/components/map/BirdInfoCard.tsx` - source= prop updated
- `src/components/map/BirdDrawerContent.tsx` - source= prop updated
- `app/bird-detail.tsx` - source= prop updated
- `app/(main)/community.tsx` - Sighting interface updated, SIGHTINGS array uses require(), source= prop updated

## Decisions Made

- Used Wikipedia REST API (`/w/api.php?action=query&prop=pageimages`) to discover current Wikimedia Commons filenames when the original birds.ts URLs returned 404 (many had moved/renamed)
- `ImageSource` from `expo-image` chosen for Bird.image type — it's the correct type accepted by expo-image's `<Image source={...}>` prop and covers `require()` return values natively
- Community sightings use `require()` directly in the SIGHTINGS array rather than importing bird objects from birds.ts — keeps community feed independent with its own data

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated download script with corrected Wikimedia URLs**
- **Found during:** Task 1 (running download script)
- **Issue:** Many original Wikipedia thumbnail URLs in birds.ts returned HTTP 404 (files renamed/moved on Wikimedia Commons). Additionally Wikipedia rate-limited aggressively (429) requiring delays between requests.
- **Fix:** Used Wikipedia API to discover current correct filenames for all 20 species; updated script with verified URLs and per-bird delays. Used Python urllib for batch download with longer delays between requests to satisfy rate limiting.
- **Files modified:** scripts/download-images.js
- **Verification:** All 20 files present in src/assets/birds/, each >1KB
- **Committed in:** 6d02294 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug/URL staleness)
**Impact on plan:** Necessary to obtain the actual images. The final script uses verified working URLs. No scope creep.

## Issues Encountered

- Original Wikipedia thumbnail URLs from birds.ts returned HTTP 404 — Wikimedia Commons had moved/renamed many files since the URLs were added. Resolved via Wikipedia API discovery.
- Wikipedia/Wikimedia rate-limited aggressively (HTTP 429) requiring sequential downloads with 0.8-3 second delays between requests and multiple retry sessions.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 20 bird images are local assets; app works fully offline for bird images
- Bird.image is typed as ImageSource — any new consumers should use `source={bird.image}` (no uri wrapper)
- Ready for phase 15 plan 02 (remaining image wiring tasks if any)

---
*Phase: 15-image-wiring*
*Completed: 2026-03-10*

## Self-Check: PASSED

- FOUND: scripts/download-images.js
- FOUND: src/assets/birds/ (20 JPEG files)
- FOUND: src/data/birds.ts
- FOUND: 15-01-SUMMARY.md
- FOUND commit: 6d02294 (Task 1)
- FOUND commit: bf916c2 (Task 2)
- Image count: 20
- TypeScript: PASS (0 errors)
