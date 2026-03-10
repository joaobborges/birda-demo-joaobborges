# Phase 14: UI Fixes - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix identified visual defects (auth backdrop coverage, stepper dot colors) and replace the Capture tab with a floating action button on the Map tab. All changes are visual/interaction fixes — no new features or backend integration.

</domain>

<decisions>
## Implementation Decisions

### FAB Design & Placement
- 56px solid primary blue (#1F87FE) circle with white plus (+) icon
- Positioned bottom-right corner of Map screen, above the tab bar
- Plus icon rotates to × when menu is open
- FAB appears only on the Map tab — not visible on Community or Logbook

### FAB Menu Options & Animation
- Three options: Camera, Microphone, Notes
- Menu fans upward vertically from the FAB with staggered spring animation
- Each option is a small circle (40-44px) with Ionicon + text label beside it, right-aligned with FAB
- Semi-transparent dark overlay dims the map when menu is open; tap overlay to dismiss
- All animation via Reanimated (native thread)

### Auth Backdrop Behavior
- Full-screen dark overlay covering the entire welcome screen including the mosaic grid
- Opacity 0.5 (current value is fine — issue is coverage, not opacity)
- Backdrop fades in/out synchronized with the bottom sheet slide animation
- Uses existing @gorhom/bottom-sheet BottomSheetBackdrop — fix to ensure full coverage

### Stepper Dot Colors
- Inactive progress dots change from white at 50% opacity to blue (#1F87FE) at 50% opacity
- Single line change in ProgressDots.tsx inactive style

### Tab Bar Changes
- Remove Capture tab entirely — tab bar becomes 3 tabs: Map | Community | Logbook
- Delete capture.tsx file (no dead code)
- Tab order: Map, Community, Logbook (existing order minus Capture)

### Claude's Discretion
- Exact spring animation parameters for FAB menu
- FAB shadow/elevation styling
- Menu item spacing and exact positioning offsets
- Backdrop overlay opacity level for FAB menu (separate from auth backdrop)

</decisions>

<specifics>
## Specific Ideas

- FAB follows classic Material Design FAB pattern (bottom-right, circular, prominent)
- Menu items fan out like a speed-dial FAB — similar to many map/capture apps
- The + to × rotation on the FAB gives clear open/close state feedback

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@/theme/colors` — `semantic.actionPrimary` (#1F87FE) for FAB background
- `@/components/ui/Button.tsx` — Reanimated + GestureHandler press animation pattern to replicate for FAB
- `Ionicons` — Already used throughout; has `camera`, `mic`, `document-text`, `add`, `close` icons
- `@gorhom/bottom-sheet` — BottomSheetBackdrop already in AuthDrawer.tsx

### Established Patterns
- All animations use Reanimated (useSharedValue, useAnimatedStyle, withSpring, withTiming)
- `borderCurve: 'continuous'` on all rounded corners
- `StyleSheet.create()` for all styles, no inline objects
- Conditional rendering with ternary, never &&

### Integration Points
- `app/(main)/_layout.tsx` — Remove Capture tab, keep Map/Community/Logbook
- `app/(main)/capture.tsx` — Delete this file
- `app/(main)/index.tsx` — Map screen where FAB component will be added
- `src/components/welcome/AuthDrawer.tsx` — Fix backdrop to cover full screen
- `src/components/onboarding/ProgressDots.tsx` — Change inactive dot color

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-ui-fixes*
*Context gathered: 2026-03-10*
