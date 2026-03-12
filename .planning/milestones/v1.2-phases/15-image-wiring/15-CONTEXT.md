# Phase 15: Image Wiring - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire every placeholder surface across the app to named local image assets via require(), and deliver a complete image manifest. Surfaces include: welcome mosaic grid, onboarding hero images, avatar, map markers, bird detail drawer, and bird detail screen. A download script fetches bird species photos from Wikipedia. User-provided assets (onboarding illustrations, avatars, paywall hero) get placeholder-ready wiring.

</domain>

<decisions>
## Implementation Decisions

### Image Source Strategy
- Download the 20 bird species images from Wikipedia URLs already in birds.ts
- Script saves them locally as JPEG files in src/assets/birds/
- Single image per species — expo-image handles resizing at render time (no thumbnail variants)
- Keep the download script in the project at scripts/download-images.js for re-running
- Add a package.json script entry for convenience

### Asset Organization & Naming
- Bird species photos: src/assets/birds/ (flat, one file per species)
- Onboarding hero illustrations: src/assets/onboarding/ (one per screen)
- Avatar assets: src/assets/ (per skill level)
- Paywall hero: src/assets/
- File naming: species kebab-case (e.g., european-robin.jpg, common-blackbird.jpg)
- Onboarding heroes named by screen (e.g., welcome.png, location.png, skill-level.png)

### Data Model Changes
- Change bird.image in birds.ts from URL string to require() import
- Each bird entry has its require() call inline (e.g., `image: require('@/assets/birds/european-robin.jpg')`)
- Bird interface type updates from string to ImageSource (expo-image compatible)

### Onboarding & Paywall Visuals
- Onboarding hero images: user provides custom illustrations per screen
- Code wires require() paths to expected filenames — screens show placeholder until files are dropped in
- Avatar images: user provides assets per skill level (replaces current emoji placeholders)
- Paywall hero: user provides a hero image — code wires require() to expected filename

### Image Manifest
- Central TypeScript registry at src/data/imageManifest.ts
- All require() references exported from this single file
- Components and data files import from manifest (single source of truth)
- Metadata per image: filename & path, dimensions (width x height), location in app, asset status (exists vs placeholder-awaiting)

### Claude's Discretion
- Exact download script implementation details
- Placeholder behavior when user-provided assets don't exist yet (fallback color, missing image handling)
- TypeScript types for manifest entries
- Whether birds.ts require() calls go through manifest or stay inline

</decisions>

<specifics>
## Specific Ideas

- Download script reads Wikipedia URLs from birds.ts so it stays in sync with the data
- Species kebab-case naming makes it easy to visually browse the assets folder
- Central manifest serves double duty: code registry + asset tracking doc for what's still needed
- Asset status field in manifest tracks which images exist vs which are placeholder-ready (awaiting user files)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `expo-image` (Image component): Already used in BirdMosaic, BirdInfoCard, BirdDrawerContent — supports both require() and { uri } sources
- `src/data/birds.ts`: 20 bird entries with Wikipedia image URLs — will become require() imports
- `src/assets/bird-logo.png`: Only existing local asset in src/assets/

### Established Patterns
- All images rendered via `expo-image` Image component (not React Native Image)
- Image sources currently use `{ uri: bird.image }` pattern — will change to direct require() references
- StyleSheet.create() for all styles including image dimensions
- No barrel imports except theme — imageManifest.ts would be a new central import point

### Integration Points
- `src/data/birds.ts` — Bird.image type changes from string to ImageSource, values change to require()
- `src/components/welcome/BirdMosaic.tsx` — source={{ uri: bird.image }} → source={bird.image}
- `src/components/map/BirdInfoCard.tsx` — same pattern change
- `src/components/map/BirdDrawerContent.tsx` — same pattern change
- `app/(onboarding)/birding-journey.tsx` — emoji avatar → require() image
- `app/(onboarding)/paywall.tsx` — blue placeholder → require() hero image
- `app/(onboarding)/*.tsx` — each screen gets hero image wiring
- `app/bird-detail.tsx` or equivalent — hero image wiring

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-image-wiring*
*Context gathered: 2026-03-10*
