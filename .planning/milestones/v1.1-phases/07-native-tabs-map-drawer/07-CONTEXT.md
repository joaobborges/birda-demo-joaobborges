# Phase 7: Native Tabs & Map Drawer - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

The home screen uses a native iOS tab bar for app-level navigation and bird details appear in a full-width swipeable drawer above all content. Tapping the bird image in the drawer pushes a full detail screen. Debug panel is hidden behind a triple-tap gesture accessible from any screen. Requirements: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05.

</domain>

<decisions>
## Implementation Decisions

### Tab bar approach
- Use Expo Router's `unstable-native-tabs` for true native iOS UITabBarController
- 4 tabs in order: Map, Community, Capture, Logbook
- SF Symbols for tab icons (map.fill, person.2.fill, camera.fill, book.fill) — requires expo-symbols or similar
- Active state: dark navy (#2D3142), inactive: muted gray
- Map is the default/home tab
- Community tab shows the existing community social feed screen (moved from floating top bar icon to tab bar)

### Map bird drawer
- Full-width bottom sheet using @gorhom/bottom-sheet (already installed from Phase 5)
- Replaces current BirdInfoCard component
- Opens to ~50% screen height showing bird image + key details
- Two snap points: half-screen and dismissed (swipe down to dismiss)
- No backdrop overlay — map stays fully visible and interactive above the drawer
- Touches left, right, and bottom edges (NAV-03)
- Renders above all other content (NAV-04)
- Tapping a different bird marker swaps drawer content in-place (no close/reopen animation)
- Drawer content: bird image, name, species (italic), description, rarity badge — same data as existing BirdInfoCard

### Bird detail screen
- Tapping the bird image in the drawer pushes a full BirdDetail screen (standard iOS push from right)
- Drawer closes when detail screen pushes; returning to map shows clean map with no drawer
- Scrollable screen with sections:
  1. Hero bird image at top (large)
  2. Name, species, rarity badge, description (from bird data)
  3. Habitat & behavior section (placeholder text)
  4. Small static map showing observation location pin (reuses bird coordinate data)
  5. "Log sighting" CTA button at bottom (disabled placeholder — ties into future Capture feature)
- All content beyond basic bird data is placeholder for demo purposes

### Debug panel
- Remove visible floating debug button entirely
- Triple-tap gesture anywhere in the app triggers the dev panel
- Accessible from any screen (map, onboarding, paywall, etc.) — not just the map
- Panel presentation style is Claude's discretion (formSheet modal or bottom sheet)
- Key requirement: easy access to reset onboarding flows and debug state from anywhere

### Floating top bar
- Remove community icon from floating top bar (moved to tab bar)
- Keep Profile (left) and Notification (right) as floating icons on the map tab
- Profile stays as a floating icon, not a tab — quick-access overlay

### Tab content screens (Capture & Logbook)
- Minimal placeholder screens: centered icon + "Coming soon" teaser text
- Lightweight — communicates intent without pretending functionality exists
- Uses design system tokens for consistency

### Claude's Discretion
- Exact drawer snap point percentages and animation curves
- SF Symbol names for tab icons (closest matches)
- Bird detail screen spacing, typography hierarchy, and parallax effect
- Triple-tap gesture implementation approach (GestureHandler wrapper vs custom)
- Debug panel presentation style (formSheet vs bottom sheet)
- Placeholder text content for habitat/behavior section
- Static map size and styling on detail screen
- Tab bar label visibility (icons-only vs icons+labels)

</decisions>

<specifics>
## Specific Ideas

- Drawer should feel like Apple Maps POI drawer — slides up from bottom, no backdrop, map stays interactive
- Bird detail push from drawer image tap — clean two-step flow (drawer -> detail)
- Debug panel should be discoverable only by developers (triple-tap hidden trigger)
- Community tab reuses the existing community.tsx screen with LegendList social feed

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@gorhom/bottom-sheet v5.2.8`: Already installed — use for map bird drawer
- `src/components/map/BirdInfoCard.tsx`: Current card component — content template for new drawer (will be replaced)
- `src/components/map/BirdMarker.tsx`: Bird markers on map — onPress handler needs to open drawer instead of card
- `src/components/dev/DevPanel.tsx`: Current debug panel with formSheet modal — needs gesture trigger refactor
- `app/(main)/community.tsx`: Existing community screen with LegendList — moves to tab
- `app/(main)/profile.tsx`: Profile push screen — stays as Stack push from floating icon
- `src/data/birds.ts`: Bird data with coordinates, images, descriptions — used for drawer and detail screen
- `src/theme/`: Full design token system enforced in Phase 4

### Established Patterns
- Reanimated 4 for all animations (native/UI thread)
- `borderCurve: 'continuous'` on all rounded corners (STYL-01)
- Stack push navigation for profile/community screens
- Standalone layout pattern (welcome, paywall) for screens that don't use OnboardingLayout
- `@/` path alias for imports, `StyleSheet.create()` for styles

### Integration Points
- `app/(main)/_layout.tsx`: Currently Stack navigator — needs conversion to native tabs layout with Stack nested inside Map tab
- `app/(main)/index.tsx`: Map screen — remove floating bottom bar, add bottom sheet drawer, wire bird markers to drawer
- `app/(main)/community.tsx`: Move from Stack push to tab screen
- New files needed: `app/(main)/capture.tsx`, `app/(main)/logbook.tsx` (placeholder tabs), `app/(main)/bird-detail.tsx` (full detail screen)
- Root `_layout.tsx` or provider: Add triple-tap gesture wrapper for dev panel access from any screen

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-native-tabs-map-drawer*
*Context gathered: 2026-03-10*
