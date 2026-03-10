# Phase 5: Welcome Screen & Auth Drawer - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Users see an eye-catching animated welcome screen with auto-scrolling bird mosaic and can choose how to sign in via a bottom sheet drawer. Requirements: WELC-01, WELC-02, AUTH-01, AUTH-02, AUTH-03.

</domain>

<decisions>
## Implementation Decisions

### Bird mosaic animation
- Pinterest-style mixed heights — images have varying heights across 3 columns for a dynamic, organic feel
- Columns scroll in alternating directions: left up, center down, right up — each at slightly different speeds
- Hard crop at top and bottom edges (no gradient fade)
- Each image tile has rounded corners (~12px) with small gaps (~4px) between tiles
- Use bird image URLs from `src/data/birds.ts` (20 entries available)
- Mosaic is purely decorative — no scroll interaction allowed (WELC-01)
- Animation loops continuously

### Welcome screen layout
- Split layout: mosaic covers top ~55% of screen, white content card fills bottom ~45%
- No Birda logo on welcome screen (logo already shown on splash screen)
- Content card contains: "Welcome to Birda" heading, description text, two buttons (Create Account + Log in), terms checkbox
- Terms checkbox stays on welcome screen below buttons — buttons disabled until terms accepted (same pattern as current)
- Standalone full-screen layout — does NOT use OnboardingLayout (too different from other onboarding screens)
- Welcome screen remains the onboarding entry point (index.tsx already redirects to welcome.tsx)

### Auth drawer
- Single BottomSheet component with dynamic content — title and options change based on which button was tapped
- Login drawer: Apple + Google sign-in options
- Create Account drawer: Apple + Google + Email sign-in options
- Brand-colored icon buttons: Apple button is black, Google is white with border, Email uses primary blue (#1F87FE)
- Each button has brand icon on left + label text
- Compact drawer height — snaps to fit content (~30-35% of screen)
- Semi-transparent backdrop overlay that dims the mosaic — tapping backdrop dismisses drawer
- Drawer supports swipe-to-dismiss gesture

### Auth flow behavior
- Tapping an auth option: drawer dismisses first, then navigates to next onboarding screen (ai-bird-id)
- No fake loading state or spinner — clean two-step exit
- Drawer can be freely dismissed (backdrop tap or swipe down) without choosing an option
- No auth method stored in onboarding store — just navigate forward
- Auth is visual demo only (no real authentication)

### Claude's Discretion
- Exact mosaic column speeds and animation timing
- Image height variation algorithm (how mixed the heights are)
- Drawer animation curve and timing
- Exact spacing within the content card
- Gap between mosaic section and content card (overlap vs clean break)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/birds.ts`: 20 bird entries with Wikipedia image URLs — source for mosaic images
- `src/components/ui/Button.tsx`: Reanimated press animation + haptic — used for Create Account / Log in buttons
- `src/theme/`: Full design token system (colors, typography, spacing, components) — enforced in Phase 4
- `src/stores/onboarding.ts`: Zustand store with `termsAccepted` state and `setTermsAccepted` action

### Established Patterns
- Reanimated 4 for all animations (native/UI thread) — mosaic scrolling should use Reanimated
- `borderCurve: 'continuous'` on all rounded corners (STYL-01 convention)
- `StyleSheet.create()` for styles, `@/` path alias for imports
- Ternary with `null` for conditional rendering (never `&&`)
- Screen components export `default function`, reusable components use named exports

### Integration Points
- `app/(onboarding)/welcome.tsx`: Existing welcome screen to be completely rewritten
- `app/(onboarding)/_layout.tsx`: Stack navigator with slide_from_right animation
- `@gorhom/bottom-sheet v5.2.8`: Decided for v1.1 but NOT yet installed — needs `npm install`
- Navigation target after auth: `/(onboarding)/ai-bird-id`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-welcome-screen-auth-drawer*
*Context gathered: 2026-03-10*
