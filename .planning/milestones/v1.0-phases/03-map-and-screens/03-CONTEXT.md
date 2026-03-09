# Phase 3: Map and Screens - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

The map screen becomes the polished home experience. Clustered markers with shape-coded rarity, a clean stripped-down map, floating navigation UI with proper icons, and full-screen push screens for profile and community. BirdMarker and BirdInfoCard are extracted to standalone components.

</domain>

<decisions>
## Implementation Decisions

### Marker clustering
- Use Supercluster directly (skip react-native-map-clustering — New Architecture compatibility risk)
- Cluster markers: solid Birda blue (#1F87FE) circle with white count number
- Fixed size circle (not scaled by count) — clean and consistent
- Tap a cluster: animate map zoom to the level where cluster breaks apart into individual markers

### Individual bird markers
- Shape + color encodes rarity (double-encoding for accessibility):
  - Common: green circle
  - Uncommon: orange diamond
  - Rare: red star
- Small markers (16-20px), solid fill, subtle white border for contrast against map
- Custom SVG rendering via react-native-maps custom marker views
- Existing rarity color tokens from `src/theme/colors.ts` (rarityCommonBg, rarityUncommonBg, rarityRareBg) — may need solid variants

### Map base style
- Apple Maps `mutedStandard` mode (muted standard) with POIs filtered out
- Hide all points of interest (restaurants, monuments, shops, etc.)
- Keep: terrain, roads, street names, parks/green areas
- Result: clean base map where only bird markers stand out

### Floating UI icons
- Replace all emoji with SF Symbols via `@expo/vector-icons` (Ionicons — already available in Expo, no new dependency)
- Profile icon (top-left): user avatar thumbnail in circular 44px button (same avatar source as profile screen)
- Community icon (top-right): people/group SF Symbol
- Notification icon (top-right): bell SF Symbol with red dot badge (current behavior, no count)
- Bottom buttons: proper icon + text label (replace emoji, keep labels "Capture" and "Logbook")
- All floating buttons keep current white background + shadow styling

### Navigation pattern change
- Both profile and community switch from `formSheet` presentation to **standard full-screen stack push**
- Reason: enables internal form sheets for drill-down (achievements detail, sighting detail) without stacking modals
- Back navigation: native iOS back arrow (standard Stack header with back chevron)
- Update `app/(main)/_layout.tsx`: remove `presentation: 'formSheet'` and `sheetAllowedDetents` from both screens

### Profile screen polish
- Avatar: SF Symbol person icon on colored circular background (replace DiceBear URL — no external dependency)
- Keep existing sections: avatar, name, skill badge, stats row, achievements
- Achievement badges: replace emoji with SF Symbol icons on soft-colored circular backgrounds using Birda palette
  - Early Bird → sunrise icon
  - Sharp Eye → binoculars/eye icon
  - Photographer → camera icon
  - Explorer → map/compass icon
- Enable native grab handle via `sheetGrabberVisible` (if applicable to stack screen headers)
- Refine typography hierarchy and spacing using existing theme tokens

### Community feed polish
- Keep horizontal card layout (photo left, text right)
- Add visual-only like count to each card (heart icon + mock number, e.g., "12") — static decoration, not interactive
- Refine card spacing, typography hierarchy
- Title: "Community Sightings" at top with consistent header styling
- Native iOS back arrow for navigation back to map

### Component extraction (MAP-03)
- Extract `BirdMarker` from `app/(main)/index.tsx` to `src/components/map/BirdMarker.tsx`
- Extract `BirdInfoCard` from `app/(main)/index.tsx` to `src/components/map/BirdInfoCard.tsx`
- Both become named exports (not default exports) following project conventions
- Create `src/components/map/` directory

### Claude's Discretion
- Supercluster configuration (radius, minZoom, maxZoom)
- Exact SF Symbol icon names for each use case
- Map zoom animation duration and easing for cluster tap
- POI filter configuration specifics
- Exact marker SVG shapes and dimensions
- Like count mock data values on community cards
- Stack header styling (title, back button label text)

</decisions>

<specifics>
## Specific Ideas

- Map should feel stripped-down and clean — bird markers are the only visual points of interest on the map
- Shape-coded markers (circle/diamond/star) are a demo-impressive detail that shows attention to accessibility and information design
- The navigation change from form sheets to full-screen push is driven by the need for future drill-down (achievement detail, sighting detail) without stacking modals
- Profile and community should feel like proper screens, not quick overlays

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/colors.ts`: Rarity color tokens (rarityCommonBg, rarityUncommonBg, rarityRareBg) — use for marker colors, may need solid/opaque variants
- `src/components/ui/Button.tsx`: Reusable button with haptics — used in bottom bar and profile actions
- `src/data/birds.ts`: Bird catalog with rarity field and geolocation — drives marker rendering and clustering
- `@legendapp/list` (LegendList): Already installed and used in community screen
- `expo-image`: Already used for bird photos in info card and community feed

### Established Patterns
- `StyleSheet.create()` at bottom of every file
- `borderCurve: 'continuous'` on all borderRadius (STYL-01)
- `boxShadow` string format for shadows
- `semantic` color tokens from `@/theme/colors`
- Conditional rendering with ternary (never &&)
- `memo()` for list item renderers (BirdMarker already uses this pattern)

### Integration Points
- `app/(main)/_layout.tsx`: Stack navigator — change profile/community from formSheet to standard presentation, enable headers
- `app/(main)/index.tsx`: Map screen — add Supercluster, replace inline BirdMarker/BirdInfoCard with imports, add map style config
- `app/(main)/profile.tsx`: Refactor avatar, achievements, add stack header
- `app/(main)/community.tsx`: Add like counts, refine cards, add stack header
- `src/stores/onboarding.ts`: Read user name and birdingJourney for profile display (already connected)

</code_context>

<deferred>
## Deferred Ideas

- Sighting detail view (tap a community card to see full sighting) — future phase drill-down
- Achievement detail form sheet (tap an achievement for more info) — future phase
- Notification screen/list — notifications are visual-only indicator for now

</deferred>

---

*Phase: 03-map-and-screens*
*Context gathered: 2026-03-09*
