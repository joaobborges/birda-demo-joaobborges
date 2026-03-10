# Phase 8: Auth Fix & UI Polish - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Close audit gaps and apply UI polish across all screens. Originally scoped to AUTH-01, PAYW-06, NAV-03, NAV-04 — expanded during discussion to include onboarding alignment, paywall icon tweaks, map marker hit areas, navigation styling, and profile achievements layout.

</domain>

<decisions>
## Implementation Decisions

### Auth drawer (Welcome screen)
- AUTH-01 updated: Login drawer KEEPS Email button — both Login and Signup show identical options (Apple, Google, Email). Only the title text differs ("Log in" vs "Create Account")
- Current code already implements this correctly — AUTH-01 is a no-op (requirement updated, not code)
- Backdrop overlay must cover the FULL screen including the bird mosaic section at the top — currently the overlay stops below the mosaic
- Backdrop stays at 50% opacity black, just needs to render above the mosaic gradient and scrolling columns

### Onboarding screens alignment
- Welcome screen is the golden reference for text positioning
- All onboarding screens (ai-bird-id, name, location, stay-in-the-loop, mailing-list, etc.) must match the welcome screen's title and description X/Y positioning
- Text is center-aligned on both welcome and onboarding screens
- The vertical and horizontal position of the title + description block must match the welcome screen exactly
- This is an OnboardingLayout fix — propagates to all screens using it

### Name input screen
- Avatar, title, and input should align to the TOP (right below progress dots), not vertically centered — only this screen gets top-alignment
- Other onboarding screens keep their current centered vertical layout
- When keyboard opens, the view must push content up to keep the input visible
- If scrollable, auto-scroll to keep input in view

### Paywall tweaks
- Social proof boxes: will use images provided by user later — keep current layout (flex: 1, height: 72) but prepare for Image component swap
- Unlock pill icon: change from `lock-open-outline` to `ribbon` icon (consistent with feature bullet icons)
- Nature Day banner: remove the leaf icon AND the 🌿 emoji — just text: "Nature Day Special — **10% off**"

### Map marker tap target
- Bird info drawer is already working correctly (full-width, above tab bar) — NAV-03 and NAV-04 are already resolved
- Map marker tap area is too small — add a larger invisible hit area (minimum 44x44px) around each marker while keeping the visual marker the same size

### Tab bar & navigation styling
- Active tab color: change from neutral700 to primary blue (#1F87FE / actionPrimary)
- Map header icons (notification, profile): style them consistently with the inactive tab bar items (same color/weight as Community, Capture, Logbook inactive states)
- Back button on Profile and Community screens: remove "(main)" text label — show only the back chevron icon, no text
- Header separator line: remove the border/line between the header bar and content area on both Profile and Community screens

### Profile achievements
- Change from column/grid layout to a vertical list of rows — each achievement is a full-width row item
- Add 2-3 grayed-out/locked dummy achievements to show the user there's more to unlock
- Earned achievements display in full color, locked ones appear dimmed/grayed

### Claude's Discretion
- Exact backdrop z-index implementation for auth drawer (portal vs z-order approach)
- Keyboard avoidance implementation details for name screen (KeyboardAvoidingView vs ScrollView)
- Social proof box image component setup (expo-image configuration)
- Locked achievement visual treatment (opacity level, lock icon vs just dimmed)

</decisions>

<specifics>
## Specific Ideas

- "The welcome screen positioning is perfect — onboarding screens should match it exactly"
- "Social proof will be images I'll share with you later"
- "Just the chevron pointing back — no text, no labels"
- "I really want to remove that line [header separator] — I really don't like it"
- Achievements should show locked items so users understand there are more things to be done

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/welcome/AuthDrawer.tsx`: BottomSheet with backdrop — needs backdrop z-order fix
- `src/components/welcome/AuthOptionButton.tsx`: Auth button component — no changes needed
- `app/(onboarding)/paywall.tsx`: Social proof boxes at lines 73-78, unlock pill at line 81, Nature Day banner at line 49
- `app/(onboarding)/name.tsx`: Name input screen — needs top-alignment + keyboard avoidance
- `src/components/map/BirdMarker.tsx`: Map marker component — needs larger hit area
- `src/components/map/BirdDrawerContent.tsx`: Drawer content — no changes needed (already working)

### Established Patterns
- `@gorhom/bottom-sheet` v5.2.8 with BottomSheetModalProvider portal rendering
- Reanimated 4 for all animations
- `borderCurve: 'continuous'` on all rounded corners
- `expo-image` for image rendering (already used in BirdDrawerContent)
- Design tokens from `src/theme/` for all spacing, colors, typography

### Integration Points
- OnboardingLayout component: central fix point for all onboarding screen alignment
- Tab bar configuration: likely in `app/(main)/_layout.tsx` for active color change
- Stack navigator configuration: for back button text removal on Profile/Community
- Profile screen: achievement section layout restructure

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope (all items are UI polish within existing screens)

</deferred>

---

*Phase: 08-auth-fix-ui-polish*
*Context gathered: 2026-03-10*
