---
phase: 15-image-wiring
plan: 02
subsystem: ui
tags: [expo-image, react-native, local-assets, onboarding, image-manifest]

requires:
  - 15-01 (bird images in src/assets/birds/, Bird.image: ImageSource)

provides:
  - src/data/imageManifest.ts — central registry for all require() references
  - 13 placeholder PNG files (onboarding, avatars, paywall hero)
  - All 10 onboarding/paywall screens wired to import from manifest

affects: [onboarding-screens, paywall]

tech-stack:
  added: []
  patterns:
    - "imageManifest.ts as single source of truth for all require() image references"
    - "ONBOARDING_IMAGES['screen-key'] pattern for illustration screens"
    - "AVATAR_IMAGES['level-key'] pattern for skill-level avatar images"
    - "PAYWALL_HERO for full-bleed hero zone"
    - "expo-image Image component with contentFit='cover' for all image slots"

key-files:
  created:
    - src/data/imageManifest.ts
    - src/assets/onboarding/ai-bird-id.png (placeholder)
    - src/assets/onboarding/discover.png (placeholder)
    - src/assets/onboarding/goals.png (placeholder)
    - src/assets/onboarding/green-time.png (placeholder)
    - src/assets/onboarding/community.png (placeholder)
    - src/assets/onboarding/mailing-list.png (placeholder)
    - src/assets/onboarding/reminders.png (placeholder)
    - src/assets/avatars/new.png (placeholder)
    - src/assets/avatars/garden.png (placeholder)
    - src/assets/avatars/intermediate.png (placeholder)
    - src/assets/avatars/expert.png (placeholder)
    - src/assets/paywall-hero.png (placeholder)
    - src/assets/avatar-default.png (placeholder)
  modified:
    - app/(onboarding)/ai-bird-id.tsx
    - app/(onboarding)/discover.tsx
    - app/(onboarding)/goals.tsx
    - app/(onboarding)/green-time.tsx
    - app/(onboarding)/community.tsx
    - app/(onboarding)/mailing-list.tsx
    - app/(onboarding)/reminders.tsx
    - app/(onboarding)/name.tsx
    - app/(onboarding)/birding-journey.tsx
    - app/(onboarding)/paywall.tsx

key-decisions:
  - "imageManifest.ts is the single source of truth for all require() references — components import from manifest, not inline require()"
  - "Minimal 1x1 transparent PNG placeholders created via Buffer (no external deps) — Metro bundler resolves require() at build time and crashes on missing files"
  - "birding-journey.tsx AVATAR_MAP updated with ImageSource values; emoji Text replaced with Image component; avatarImage style fills 120x120 circle"
  - "paywall.tsx heroPlaceholder View renamed to heroImage style — same absoluteFillObject positioning"

metrics:
  duration: 4min
  completed: 2026-03-10
  tasks: 3
  files-created: 14
  files-modified: 10
---

# Phase 15 Plan 02: Image Wiring — Manifest and Screen Wiring Summary

**imageManifest.ts created as single source of truth for all require() references, 13 placeholder PNG files generated, and all 10 onboarding/paywall screens wired to import image sources from the manifest.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-10T18:15:24Z
- **Completed:** 2026-03-10T18:19:14Z
- **Tasks:** 3
- **Files modified:** 10 screen files (+ 14 asset files created)

## Accomplishments

- Generated 13 minimal 1x1 transparent PNG placeholder files using raw Buffer bytes (no external deps)
- Created `src/data/imageManifest.ts` with 9 named exports: ONBOARDING_IMAGES, AVATAR_IMAGES, PAYWALL_HERO, BIRD_IMAGES (quick-access) plus ONBOARDING_MANIFEST, AVATAR_MANIFEST, PAYWALL_MANIFEST, BIRD_MANIFEST, IMAGE_MANIFEST (with metadata: filename, dimensions, location, status)
- Wired all 5 illustration-prop screens (ai-bird-id, discover, goals, green-time, community) to use ONBOARDING_IMAGES
- Wired mailing-list.tsx and reminders.tsx (imagePlaceholder pattern) to ONBOARDING_IMAGES
- Wired name.tsx avatar to AVATAR_IMAGES['default']
- Replaced birding-journey.tsx emoji-based AVATAR_MAP with ImageSource values from AVATAR_IMAGES; replaced Text emoji with Image component inside avatar circle
- Replaced paywall.tsx heroPlaceholder View with Image component using PAYWALL_HERO
- TypeScript compiles cleanly with zero errors
- Zero inline require() calls remaining in any onboarding or paywall screen file

## Task Commits

1. **Task 1: Create placeholder assets and image manifest** — `592fed4` (feat)
2. **Task 2: Wire onboarding illustration screens to import from manifest** — `679f383` (feat)
3. **Task 3: Wire name, birding-journey, and paywall screens to import from manifest** — `9b20184` (feat)

## Files Created

- `src/data/imageManifest.ts` — Single source of truth; exports ONBOARDING_IMAGES, AVATAR_IMAGES, PAYWALL_HERO, BIRD_IMAGES, IMAGE_MANIFEST (+ manifest arrays)
- `src/assets/onboarding/*.png` — 7 placeholder PNGs for onboarding hero illustrations
- `src/assets/avatars/*.png` — 4 placeholder PNGs for skill-level avatar images
- `src/assets/paywall-hero.png` — Placeholder for paywall hero zone
- `src/assets/avatar-default.png` — Placeholder for name-screen user avatar

## Files Modified

- `app/(onboarding)/ai-bird-id.tsx` — Image from ONBOARDING_IMAGES['ai-bird-id']
- `app/(onboarding)/discover.tsx` — Image from ONBOARDING_IMAGES['discover']
- `app/(onboarding)/goals.tsx` — Image from ONBOARDING_IMAGES['goals']
- `app/(onboarding)/green-time.tsx` — Image from ONBOARDING_IMAGES['green-time']
- `app/(onboarding)/community.tsx` — Image from ONBOARDING_IMAGES['community']
- `app/(onboarding)/mailing-list.tsx` — Image from ONBOARDING_IMAGES['mailing-list']
- `app/(onboarding)/reminders.tsx` — Image from ONBOARDING_IMAGES['reminders']
- `app/(onboarding)/name.tsx` — Image from AVATAR_IMAGES['default']
- `app/(onboarding)/birding-journey.tsx` — AVATAR_MAP uses ImageSource; Image replaces emoji; avatarImage style added
- `app/(onboarding)/paywall.tsx` — Image from PAYWALL_HERO with absoluteFillObject

## Decisions Made

- imageManifest.ts is the single source of truth for all require() references — screen components import from manifest (per user decision from planning)
- Used raw Buffer bytes to generate minimal 1x1 transparent PNG files — Metro bundler resolves require() at build time and will crash if a file doesn't exist; this approach needs no external dependencies
- birding-journey AVATAR_MAP switched from emoji strings to ImageSource values — existing avatar circle container (120x120, borderRadius 60) kept; avatarImage style added to fill it; overflow:hidden ensures circular clip
- paywall heroPlaceholder style renamed heroImage — same absoluteFillObject + backgroundColor tint retained as load-state fallback

## Deviations from Plan

None — plan executed exactly as written.

## User Setup Required

When custom illustrations are ready, drop PNG/JPG files into:
- `src/assets/onboarding/{screen-name}.png` — for onboarding hero images
- `src/assets/avatars/{level}.png` — for skill-level avatars (new, garden, intermediate, expert)
- `src/assets/avatar-default.png` — for name screen default avatar
- `src/assets/paywall-hero.png` — for paywall hero zone

The images will appear immediately without any code changes.

## Next Phase Readiness

- All onboarding and paywall screens use Image components ready to display real art
- imageManifest.ts is the single drop-in point for all asset swaps
- TypeScript compiles cleanly; no further wiring needed for images

---
*Phase: 15-image-wiring*
*Completed: 2026-03-10*
