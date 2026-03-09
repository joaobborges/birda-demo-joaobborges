---
status: complete
phase: 02-onboarding-and-paywall
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md
started: 2026-03-09T12:00:00Z
updated: 2026-03-09T12:22:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Welcome Screen & T&C Gating
expected: Welcome screen shows a hero image placeholder, a Terms & Conditions checkbox, and two buttons (Create Account / Log in). Both buttons are disabled until the T&C checkbox is checked. Checking the box enables the buttons.
result: issue
reported: "Login button should have exact same height and width as Create Account button (ghost button pattern - same dimensions, no background). Spacing between elements doesn't use design system tokens: need ~4px gap between Create Account and Login buttons. Checkbox component is touching the buttons with no spacing - needs proper box model with margin between checkbox component and Create Account button. Illustration placeholder is way too big - should be reduced to roughly half the current size."
severity: major

### 2. Feature Tour Screens (4 screens)
expected: Tapping Continue on Welcome navigates through 4 feature tour screens in order: AI Bird ID, Green Time, Discover, Community. Each screen has a progress indicator (dots showing position out of 4), an image placeholder, heading, description, and Continue button. Transitions use a fade animation (not slide).
result: issue
reported: "Image/illustration container is not full-bleed - it should take the full width and bleed to the edges and the top of the screen. The image area should sit behind the status bar (clock, etc.) and the progress dots, so those native elements overlay on top of the image. The image should occupy roughly the top half of the screen at full width. Text, description, and Continue button sit below. This same issue applies to the Welcome screen as well."
severity: major

### 3. Name Input Screen
expected: After the feature tour, the Name screen appears with a text input field. Typing a name and tapping Continue proceeds to the next screen. The entered name is preserved if you navigate back.
result: pass

### 4. Birding Journey Selection
expected: Single-select screen with 4 birding experience levels displayed as chips/cards. Tapping one highlights it (visual feedback with border/background color change). Only one can be selected at a time. Progress dots show position 2 of 3.
result: issue
reported: "Structure is good but the avatar/image at the top should change dynamically based on the selected chip. New = small egg, Garden = small bird, Intermediate = bigger bird, Advanced = even larger bird. Need logic to swap the image placeholder when user selects a different chip."
severity: minor

### 5. Goals Multi-Select
expected: Screen with 5 goal options as chips. Multiple goals can be selected simultaneously (each toggles independently). Continue button is always enabled (goals are optional). Progress dots show position 3 of 3.
result: issue
reported: "Circular avatar at top is wrong layout. Should be a full-bleed image taking edge to edge on the top half of the screen, with native status bar elements and progress dots overlaid on top of the image. Same full-bleed pattern as all other onboarding screens."
severity: major

### 6. Paywall Screen
expected: Paywall shows a full-bleed hero image at the top, a personalized headline (using the entered name), and a toggle to switch between Monthly and Annual plans with pricing. The toggle indicator animates smoothly between options and adapts to the width of the text labels.
result: issue
reported: "Toggle animation spring is too fast/aggressive - needs a subtle, smooth transition between monthly and annual. The top section with status bar (clock, phone elements) has a white background that blocks the hero image - needs to be transparent so image shows through. Buttons across all onboarding screens need to be in a fixed section pinned to the bottom of the screen, so they stay visible above any scrollable content."
severity: major

### 7. Post-Paywall Flow
expected: After paywall, a Reminders screen appears with "Remind me" and "Maybe later" options. Then a Mailing List screen with a toggle switch (off by default). Completing the mailing list screen navigates to the main home screen, ending onboarding.
result: pass

### 8. Continuous Corners (borderCurve)
expected: All rounded elements across the app (buttons, badges, cards, avatars) use smooth continuous corners (iOS squircle style) rather than standard circular border radius. Compare any pill-shaped button — edges should look subtly smoother than a standard border-radius.
result: pass

## Summary

total: 8
passed: 3
issues: 5
pending: 0
skipped: 0

## Gaps

- truth: "Welcome screen buttons properly sized and spaced using design system tokens"
  status: failed
  reason: "User reported: Login button should have exact same height/width as Create Account (ghost button). No spacing between elements - need 4px gap between buttons, proper margin between checkbox and buttons. Illustration placeholder too large - reduce to half size."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Illustration/image area is full-bleed, extending to screen edges and behind status bar and progress dots"
  status: failed
  reason: "User reported: Image container not full-bleed. Should take full width, bleed to edges and top of screen, sit behind status bar and progress dots. Applies to Welcome screen, all 4 feature tour screens, and quiz screens (birding journey, goals). This is a systemic layout issue across all onboarding screens."
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Birding journey avatar/image changes dynamically based on selected experience level chip"
  status: failed
  reason: "User reported: Avatar/image at top should change based on selected chip. New = small egg, Garden = small bird, Intermediate = bigger bird, Advanced = even larger bird. Need logic to swap image when selection changes."
  severity: minor
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Paywall toggle animates smoothly between monthly/annual options"
  status: failed
  reason: "User reported: Toggle spring animation too fast/aggressive. Needs subtle, smooth transition."
  severity: minor
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Status bar area is transparent so hero image shows through on paywall"
  status: failed
  reason: "User reported: Top section with status bar has white background blocking the hero image. Needs to be transparent."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Onboarding buttons are fixed to the bottom of the screen in their own section, always visible above scrollable content"
  status: failed
  reason: "User reported: Buttons across all onboarding screens need to be in a fixed section pinned to the bottom, staying visible above any scrollable content."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
