---
phase: 6
slug: paywall-redesign
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-10
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test infrastructure in project |
| **Config file** | none |
| **Quick run command** | `npx expo start` (visual inspection in Expo Go) |
| **Full suite command** | `npx expo start` (visual inspection in Expo Go) |
| **Estimated runtime** | ~30 seconds (app reload + navigate to paywall) |

---

## Sampling Rate

- **After every task commit:** Visual inspection in Expo Go
- **After every plan wave:** Full visual walkthrough of paywall screen
- **Before `/gsd:verify-work`:** All manual verifications must pass
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | PAYW-04 | manual | visual inspection — hero image placeholder + close button | N/A | ⬜ pending |
| 06-01-02 | 01 | 1 | PAYW-05 | manual | visual inspection — headline + 3 feature bullets with icons | N/A | ⬜ pending |
| 06-01-03 | 01 | 1 | PAYW-06 | manual | visual inspection — social proof placeholders side by side | N/A | ⬜ pending |
| 06-01-04 | 01 | 1 | PAYW-07 | manual | visual inspection — pricing + annual line | N/A | ⬜ pending |
| 06-01-05 | 01 | 1 | PAYW-08 | manual | visual inspection — CTA reads "Redeem your FREE Week" with FREE bolded | N/A | ⬜ pending |
| 06-01-06 | 01 | 1 | PAYW-09 | manual | visual inspection — footer links tappable | N/A | ⬜ pending |
| 06-01-07 | 01 | 1 | PAYW-10 | manual | navigate in Expo Go — dismiss goes to /(main), back gesture blocked | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework setup needed — all requirements are visual/navigational and verified via manual inspection in Expo Go.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero image renders with close button top-right | PAYW-04 | Visual layout — no test infra | Open paywall in Expo Go, verify hero fills top ~35% with X button |
| Headline + 3 feature bullets with icons | PAYW-05 | Visual layout | Verify "Unlock the full experience" + 3 bulleted items with ribbon icons |
| Social proof placeholders side by side | PAYW-06 | Visual layout | Verify two placeholder boxes render horizontally |
| Pricing display correct | PAYW-07 | Visual layout | Verify "€3,33 /month" large + "€39,99 billed annually" smaller |
| CTA text with bold FREE | PAYW-08 | Rich text rendering | Verify "Redeem your FREE Week" with FREE visually bolder |
| Footer links tappable | PAYW-09 | Touch interaction | Tap each of 3 footer links, verify press feedback |
| Dismiss navigation correct | PAYW-10 | Navigation stack behavior | Tap X, verify lands on map; swipe back, verify no onboarding return |

---

## Validation Sign-Off

- [x] All tasks have manual verify instructions
- [x] Sampling continuity: manual check after each task
- [x] Wave 0 covers all MISSING references (none needed)
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
