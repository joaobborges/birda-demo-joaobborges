---
phase: 2
slug: onboarding-and-paywall
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (automated testing out of scope per REQUIREMENTS.md) |
| **Config file** | none |
| **Quick run command** | Manual visual verification |
| **Full suite command** | N/A |
| **Estimated runtime** | ~120 seconds (full 11-screen walkthrough) |

---

## Sampling Rate

- **After every task commit:** Visual walkthrough of affected screens
- **After every plan wave:** Full 11-screen flow walkthrough + Nature Day variant check
- **Before `/gsd:verify-work`:** Complete flow + borderCurve grep audit
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ONBR-02 | manual | Visual: OnboardingLayout renders correctly | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | ONBR-01 | manual | Visual: fade animation on screen transitions | N/A | ⬜ pending |
| 02-01-03 | 01 | 1 | ONBR-03 | manual | Visual: name input doesn't re-render on keystroke | N/A | ⬜ pending |
| 02-02-01 | 02 | 2 | PAYW-01 | manual | Visual: toggle adapts to content width | N/A | ⬜ pending |
| 02-02-02 | 02 | 2 | PAYW-02 | manual | Visual: paywall shows user's name | N/A | ⬜ pending |
| 02-02-03 | 02 | 2 | PAYW-03 | manual | Visual: Nature Day via debug panel shows 20% off | N/A | ⬜ pending |
| 02-XX-XX | XX | X | STYL-01 | semi-auto | `grep -rn 'borderRadius' src/ app/ \| grep -v borderCurve` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework needed per project scope.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fade animations on screen transitions | ONBR-01 | Visual/perceptual quality | Navigate through all 11 screens, verify smooth fade crossfades |
| OnboardingLayout shared across screens | ONBR-02 | Structural pattern | Verify no `useSafeAreaInsets` imports in screen files |
| Uncontrolled TextInput on name screen | ONBR-03 | Performance/re-render check | Type in name field, use React DevTools to verify no re-renders |
| Adaptive toggle width animation | PAYW-01 | Animation smoothness | Toggle between Monthly/Annual, verify indicator resizes smoothly |
| Personalized paywall headline | PAYW-02 | Content personalization | Enter name during onboarding, verify it appears on paywall |
| Nature Day variant | PAYW-03 | Full variant path | Open DevPanel, trigger Nature Day, verify 20% discount pricing |
| borderCurve: 'continuous' sweep | STYL-01 | Codebase-wide audit | Run grep to verify every borderRadius has adjacent borderCurve |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions or Wave 0 dependencies
- [ ] Sampling continuity: visual walkthrough after every task commit
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
