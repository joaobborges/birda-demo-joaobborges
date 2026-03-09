# Phase 2: Onboarding and Paywall - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish and rebuild the onboarding-to-paywall user journey. The existing 8-screen flow is replaced with a new 11-screen flow: welcome with terms, 4 feature tour screens, 3 quiz screens (name, birding journey, goals), paywall with hero image, and 2 post-paywall screens (reminders, mailing list). All screens use a shared layout component. Animations are simple fade crossfades. The paywall toggle becomes adaptive-width. Nature Day variant gets a different hero image + promo banner.

</domain>

<decisions>
## Implementation Decisions

### Shared layout component
- Create `OnboardingLayout` in `src/components/onboarding/OnboardingLayout.tsx`
- Uses optional slots pattern: `header`, `children` (content), `footer` props
- Layout handles safe area insets internally — screens never touch `useSafeAreaInsets`
- ProgressDots passed as optional `header` prop — screens without dots simply omit it
- Must be flexible enough to support all 3 screen types: tour, quiz, post-paywall

### New onboarding flow (replaces existing)
The full flow in order:

| # | Screen | Type | Dots | Key elements |
|---|--------|------|------|-------------|
| 1 | Welcome | Entry | No | Hero image (top half), "Welcome to Birda" heading, supporting message, T&C checkbox (required), Create Account + Log in buttons |
| 2 | AI Bird ID | Feature tour | 1/4 | Full-bleed illustration, heading, description, Continue button |
| 3 | Green Time | Feature tour | 2/4 | Full-bleed illustration, heading, description, Continue button |
| 4 | Discover Nearby | Feature tour | 3/4 | Full-bleed illustration, heading, description, Continue button |
| 5 | Community | Feature tour | 4/4 | Full-bleed illustration, heading, description, Continue button |
| 6 | Name | Quiz | 1/3 | Small illustration, "What should we call you?", text input, Continue + Skip |
| 7 | Birding Journey | Quiz | 2/3 | Small illustration, 4 experience levels as chip/pills, Continue |
| 8 | Goals | Quiz | 3/3 | Small illustration, multi-select goals, Continue |
| 9 | Paywall | Conversion | No | Full-bleed hero image, personalized headline, features, adaptive toggle, CTA |
| 10 | Reminders | Post-paywall | No | Header + description at top, centered illustration, "Remind me" + "Maybe later" |
| 11 | Mailing list | Post-paywall | No | Header + description at top, centered illustration, switch (off by default) + "Save" + "Maybe later" |
| → | Home/Explore | | | |

- **Two separate dot groups**: feature tour (4 dots) and quiz (3 dots) — NOT one continuous set
- Old screens to remove: location.tsx, interests.tsx, notifications.tsx, summary.tsx (Claude's discretion on delete vs keep)
- Navigation is button-driven only — no swipe/pager behavior
- Back gesture remains disabled on onboarding stack

### Birding journey levels (4)
- New (I'm new to birding)
- Garden (I know a few garden birds)
- Intermediate (I go birding regularly)
- Expert (I'm an experienced birder)
- Selection UI: chip/pill row (horizontal or wrapped)
- Single-select

### Goals options (5, multi-select)
1. Spend more time outside
2. Discover birding locations
3. Identify birds
4. Track my sightings
5. Connect with other birders

### Feature tour copy
1. **AI Bird ID** — "Identify birds with AI photo recognition"
2. **Green Time** — "Turn your screen time into green time"
3. **Discover** — "Discover nearby birds and locations"
4. **Community** — "Join a community of bird watchers"

### Animation choreography
- Screen transitions: fade crossfade (not slide_from_right)
- Content entrance: all elements fade in together with a very subtle delay after the screen transition — no stagger, no slide-down, just simple opacity
- Paywall toggle: keep current withSpring({ damping: 15 }) animation

### Paywall visual polish
- Both standard and Nature Day paywall get full-bleed hero image at top
- Standard paywall: generic Birda/nature hero image
- Nature Day variant: different hero image + small promotional banner (on top of image or above headline)
- Toggle becomes adaptive/content-fit width — indicator width matches the selected option's content, resizes as it slides
- Headline personalization: name only ("João, unlock the full experience"), falls back to generic if no name

### Welcome screen redesign
- Top half: full-bleed hero image (placeholder for now, image provided later)
- "Welcome to Birda" heading + supporting message
- Terms & Privacy checkbox — must be checked before Create Account / Log in buttons work
- Two buttons: "Create Account" (primary) + "Log in" (link style)

### Placeholder images
- All hero images use solid color blocks (Birda palette) as placeholders until real images are provided

### borderCurve sweep (STYL-01)
- Apply `borderCurve: 'continuous'` to all rounded corners throughout the app

### Claude's Discretion
- Whether to delete or keep old screen files (location, interests, notifications, summary)
- Exact placeholder color block values from the Birda palette
- Spring parameters for adaptive toggle width animation
- ProgressDots component updates (if any needed for the two-group pattern)
- Zustand store updates for new fields (birding journey, goals)
- Exact fade timing and delay values for content entrance animations

</decisions>

<specifics>
## Specific Ideas

- Feature tour screens have dots at top navigation → full-bleed illustration → heading → description → Continue button
- Quiz screens have dots at top → small illustration → question → input/selection → Continue button
- Post-paywall screens have header + description at top → centered illustration → action buttons
- The flow must be designed so screens can be added or removed without breaking the user journey
- Create Account / Log in on welcome are visual only — both lead to the same onboarding flow (no real auth)
- Mailing list uses a toggle switch (disabled by default) with Save + Maybe Later
- Reminders uses "Remind me" + "Maybe later" buttons

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx`: Primary button with haptics and Reanimated press animation — used across all screens
- `src/components/onboarding/ProgressDots.tsx`: Step indicator dots — needs to support the two-group pattern
- `src/stores/onboarding.ts`: Zustand store — needs new fields for birding journey, goals, terms acceptance
- `src/theme/colors.ts`: Semantic color tokens — all styling draws from here (Phase 1 established this)

### Established Patterns
- `StyleSheet.create()` at bottom of every file — continue this convention
- `@/` path alias for imports from `src/`
- Conditional rendering uses ternary (never `&&`)
- Reanimated `FadeIn`/`FadeInDown` for entrance animations — will simplify to just `FadeIn` per new decisions
- `useRef` for uncontrolled TextInput (name screen) — keep this pattern

### Integration Points
- `app/(onboarding)/_layout.tsx`: Stack navigator — needs animation changed from `slide_from_right` to fade crossfade
- `app/(onboarding)/index.tsx`: Root redirect — needs to point to welcome
- `src/components/dev/DevPanel.tsx`: Debug panel — already has Nature Day paywall trigger
- `app/index.tsx`: Root redirect — onboarding completion check still works via Zustand

</code_context>

<deferred>
## Deferred Ideas

- Second paywall after reminders/mailing list (before home) — user wants to think about this later
- Location screen — removed from current flow, could return as a future step
- Notification preferences screen — removed from current flow
- Profile summary screen — removed from current flow

</deferred>

---

*Phase: 02-onboarding-and-paywall*
*Context gathered: 2026-03-09*
