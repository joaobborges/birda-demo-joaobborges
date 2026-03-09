# Phase 4: Design System & Onboarding Polish - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Every screen renders with the Birda design system — Rubik font, color tokens, spacing tokens — and the onboarding flow has no visual bugs. Requirements: FOUN-05 through FOUN-09, ONBR-04 through ONBR-10.

</domain>

<decisions>
## Implementation Decisions

### Splash screen
- White (#FFFFFF) background with user-provided Birda logo image
- Splash stays visible until Rubik fonts are fully loaded (minimum ~500ms)
- Fade-out transition (~300ms) to first screen — no white flash
- Logo asset will be provided by user and placed in src/assets/

### Disabled button state
- Same blue (#1F87FE) color at 40% opacity when disabled, white text in both states
- Smooth Reanimated spring fade (~200ms) when transitioning between disabled/enabled
- Completely inert when disabled — no press animation, no haptic feedback
- Applies to name input screen CTA (ONBR-07)

### Token enforcement scope
- Sweep ALL screens (onboarding, map, profile, community) — not just onboarding
- Replace all hardcoded hex values and font references with theme tokens
- When a color isn't in the token system, map to closest existing token (don't add new tokens)
- Add `fixedBottomCTA` reusable container style to components.ts — single source of truth for 24px bottom / 16px horizontal padding

### Skip button handling
- Remove skip button entirely on name input screen (no replacement text)
- Audit all other onboarding screens for skip buttons — decide per-screen which keep/remove

### Font loading
- Load Rubik weights 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) — full range for future flexibility
- No italic variants — not used anywhere
- Load via expo-font at build time (already in dependencies)

### Claude's Discretion
- Exact splash screen fade animation curve and timing fine-tuning
- Progress dots transition animation between screens (colors/position are locked by ONBR-04/05)
- Overflow fix approach for Stay in the Loop and Mailing List screens (ONBR-08/09)
- How to handle the skip button audit results for non-name screens

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/colors.ts`: Full color token system with semantic layer — enforcement target
- `src/theme/typography.ts`: Rubik font family + 14 type scales — all reference `fontFamily` constant
- `src/theme/spacing.ts`: 4px base grid with 11 spacing tokens
- `src/theme/components.ts`: Button variants (default, cta, small, ghost) with borderRadius: full
- `src/components/ui/Button.tsx`: Reanimated press animation + haptic — needs disabled prop support
- `src/components/onboarding/OnboardingLayout.tsx`: Handles safe area, shared layout — fix target for overflow bugs
- `src/components/onboarding/ProgressDots.tsx`: Needs color/position updates per ONBR-04/05

### Established Patterns
- Reanimated for all animations (native/UI thread) — disabled state fade should use same approach
- `borderCurve: 'continuous'` on all rounded corners (STYL-01 convention)
- No barrel imports except theme barrel (ESLint enforced)
- `expo-font` already in package.json and app.json plugins

### Integration Points
- `app.json` — splash screen config (expo-splash-screen plugin)
- Root `_layout.tsx` — font loading gate (splash stays until fonts ready)
- All screen files — token enforcement sweep targets
- `components.ts` — add fixedBottomCTA container style

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-design-system-onboarding-polish*
*Context gathered: 2026-03-09*
