---
status: diagnosed
trigger: "Diagnose why the reminders onboarding screen has layout issues - title clipped at top, large empty space"
created: 2026-03-09T00:00:00Z
updated: 2026-03-09T00:00:00Z
---

## Current Focus

hypothesis: Reminders screen lacks SafeArea top padding and has ScrollView flexGrow:1 stretching content
test: Compare reminders.tsx with working screens (community.tsx, discover.tsx)
expecting: Missing illustration prop causes no top inset, ScrollView flexGrow spreads content
next_action: Return diagnosis

## Symptoms

expected: Title "Stay in the loop" visible below status bar, content centered nicely
actual: Title clipped behind status bar/notch, large empty space between circle and buttons
errors: none (visual layout bug)
reproduction: Navigate to reminders screen in onboarding flow
started: After Phase 04 changes (flexShrink additions)

## Eliminated

(none needed - root cause identified on first pass)

## Evidence

- timestamp: 2026-03-09
  checked: OnboardingLayout.tsx lines 29-33
  found: When no `illustration` prop AND no `header` prop, NO paddingTop is applied at all. The safe area inset `top` is only used inside the illustration/header branches.
  implication: Content starts at y=0, behind status bar/notch. Title gets clipped.

- timestamp: 2026-03-09
  checked: OnboardingLayout.tsx lines 35-41, scrollContent style line 69-72
  found: ScrollView has `flex:1` and contentContainerStyle has `flexGrow:1`. With no illustration taking up ~50% of screen height, the ScrollView expands to fill the entire screen. Content inside is not vertically centered - it starts at the top of the ScrollView.
  implication: Small content (title + description + 200px circle) sits at top of a very tall scroll area, with all remaining space below the circle and above the footer. This creates the "large empty space in the middle" effect.

- timestamp: 2026-03-09
  checked: reminders.tsx vs community.tsx/discover.tsx
  found: Working screens pass `illustration` prop (a View with height=screenHeight*0.5) which provides visual fill AND triggers the header branch with safe area insets. Reminders screen passes NEITHER illustration NOR header.
  implication: Reminders screen hits the implicit else branch where nothing renders above the ScrollView - no safe area padding, no visual fill.

- timestamp: 2026-03-09
  checked: reminders.tsx line 65
  found: imagePlaceholder has marginVertical: spacing['6'] (24px) which adds space but is small compared to the screen-filling flexGrow. The flexShrink:1 on content (line 45) and imagePlaceholder (line 66) were Phase 04 additions but don't help here because the problem is flexGrow on the ScrollView content, not overflow.
  implication: Phase 04 fixes addressed a different symptom (overflow) but didn't address the missing top padding or the layout distribution.

## Resolution

root_cause: Two compounding issues in OnboardingLayout.tsx and reminders.tsx:
  1. NO SAFE AREA TOP PADDING: OnboardingLayout only applies `paddingTop: top + spacing['5']` when `header` prop is provided (line 30). Reminders passes neither `illustration` nor `header`, so the content starts at y=0 behind the status bar/notch, clipping the title.
  2. UNBALANCED VERTICAL DISTRIBUTION: ScrollView contentContainerStyle has `flexGrow:1` (line 70), which stretches the scroll content to fill all available space. Since reminders has no illustration taking 50% of screen, the ScrollView gets the entire screen minus footer. The small content (title + desc + 200px circle) sits at top, leaving massive empty space below.

fix: (not applied - diagnosis only)
verification: (not applied)
files_changed: []
