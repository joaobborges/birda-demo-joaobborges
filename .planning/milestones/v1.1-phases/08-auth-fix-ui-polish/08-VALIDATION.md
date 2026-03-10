---
phase: 8
slug: auth-fix-ui-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no jest/vitest detected |
| **Config file** | none |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint`
- **Before `/gsd:verify-work`:** Full lint must be green + manual visual checks
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | AUTH-01 | manual | Visual inspection on device | n/a | ⬜ pending |
| 08-02-01 | 02 | 1 | PAYW-06 | manual | Visual inspection on device | n/a | ⬜ pending |
| 08-03-01 | 03 | 1 | NAV-03 | manual | Visual inspection on device | n/a | ⬜ pending |
| 08-03-02 | 03 | 1 | NAV-04 | manual | Visual inspection on device | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework needed — this phase is purely styling, layout, and config changes validated by lint + manual visual inspection.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Auth drawer shows Apple, Google, Email for both modes | AUTH-01 | Visual UI behavior | Open welcome screen, tap Login, verify options. Tap Signup, verify same options. |
| Backdrop covers full screen including mosaic | AUTH-01 | Visual overlay rendering | Open auth drawer, verify dark overlay covers bird mosaic at top |
| Social proof boxes show text content | PAYW-06 | Visual text rendering | Navigate to paywall, verify "400+ happy birders" and "4.7 stars" text visible |
| Bird info drawer full-width | NAV-03 | Visual layout measurement | Tap map marker, verify drawer touches left/right/bottom edges |
| Bird info drawer above tab bar | NAV-04 | Visual z-order | Tap map marker, verify drawer renders above tab bar |
| Onboarding text matches welcome positioning | N/A | Visual alignment | Navigate through onboarding screens, compare text Y position with welcome |
| Map markers tappable with 44px hit area | NAV-03 | Touch interaction | Tap near (not on) small markers, verify they respond |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [x] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
