# Phase 6: Paywall Redesign - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

The paywall presents a polished, conversion-oriented layout with hero image, pricing, feature highlights, and social proof. Dismissing it navigates directly to the home map screen with no onboarding screens in the back stack. Requirements: PAYW-04 through PAYW-10.

</domain>

<decisions>
## Implementation Decisions

### Hero image
- Full-bleed edge-to-edge image stretching to left, right, and top edges — no margins
- ~35% of screen height
- Static asset bundled in `src/assets/` — user will provide later; build with a placeholder (colored rectangle matching current paywall)
- Close (x) button overlaid top-right in a semi-transparent circular container
- Close button uses simple opacity press feedback (0.7 on press), no spring animation

### Layout structure
- Standalone full-screen layout — does NOT use OnboardingLayout
- Fixed single-screen layout — all content visible at once, no scrolling
- No progress dots, no shared onboarding chrome
- No pricing toggle — removed entirely in favor of static pricing display

### Content sections (top to bottom)
1. **Hero image** — full-bleed bird photo with close (x) button overlay
2. **Headline** — "Unlock the full experience" centered
3. **Feature bullets** — 3 items, each with a crown icon (primary blue #1F87FE):
   - Offline maps and field guides
   - Rare bird alerts in your area
   - AI sighting reports
4. **Social proof row** — two image assets side by side:
   - Left: "400+" with "Happy birders" text (exported as image asset, user will provide)
   - Right: "4.7" with star rating (exported as image asset, user will provide)
   - Decorative feather/leaf elements between them (part of the image assets)
5. **Unlock pill** — badge/pill reading "Unlock all features" with a lock-opening icon
6. **Pricing** — "€3,33 /month" displayed large (hero pricing)
7. **Annual line** — "€39,99 billed annually after trial" in smaller text
8. **Trust line** — green checkmark icon + "No payment required · Cancel anytime"
9. **CTA button** — blue pill button: "Redeem your FREE Week" (FREE in all-caps bold)
10. **Footer links** — "Terms of Use · Restore Purchase · Privacy Policy" as tappable text links

### Feature bullet icons
- Crown icon for all three bullets — references SF Symbols crown
- App uses Ionicons — planner/researcher should find closest Ionicon match or alternative icon approach
- Icon color: primary blue (#1F87FE)

### Dismiss navigation
- Close (x) button: `router.replace('/(main)')` — replaces entire onboarding stack, lands on map screen
- CTA button: same navigation as close — goes to home map screen (paywall is visual demo only)
- Back gesture does NOT return to onboarding after dismiss
- Both actions mark onboarding as complete in the store

### Image assets (user-provided later)
- Hero image — bird photo for top section
- Social proof "400+ Happy birders" illustration
- Social proof "4.7 star rating" badge
- Build all three with placeholder rectangles initially

### Claude's Discretion
- Exact spacing between content sections
- Close button circle size and opacity level
- Font sizes for pricing display (large vs small)
- Feather/leaf decorative elements approach if user doesn't provide assets
- Placeholder styling for image slots

</decisions>

<specifics>
## Specific Ideas

- Reference image provided showing exact layout hierarchy and visual treatment
- "FREE" in CTA button is all-caps and bold — emphasize within the button label
- Social proof section uses decorative feather/leaf elements as visual embellishment between the two stats
- Unlock pill has a lock-opening icon (not a standard lock) — subtle "unlocking" metaphor
- Trust line uses a green verification-style checkmark (not a standard check)
- Overall feel is clean, conversion-focused, with generous white space between sections

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx`: Reanimated press animation + haptic — used for CTA button
- `src/theme/`: Full design token system (colors, typography, spacing, components) — enforced in Phase 4
- `src/theme/components.ts`: `fixedBottomCTA` container style for bottom section padding
- `app/(onboarding)/paywall.tsx`: Existing paywall screen to be completely rewritten
- `src/stores/onboarding.ts`: Zustand store — needs `completeOnboarding` or similar action for dismiss

### Established Patterns
- Reanimated 4 for all animations (native/UI thread)
- `borderCurve: 'continuous'` on all rounded corners (STYL-01 convention)
- `StyleSheet.create()` for styles, `@/` path alias for imports
- Ternary with `null` for conditional rendering (never `&&`)
- Screen components export `default function`
- Standalone layout pattern established by welcome screen (Phase 5)

### Integration Points
- `app/(onboarding)/paywall.tsx`: Complete rewrite of existing screen
- `app/(onboarding)/_layout.tsx`: Stack navigator — paywall is last onboarding screen
- `router.replace('/(main)')`: Navigation to home map screen on dismiss
- `src/stores/onboarding.ts`: Mark onboarding complete on dismiss
- `src/assets/`: New image assets directory for hero and social proof images

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-paywall-redesign*
*Context gathered: 2026-03-10*
