---
phase: 4
slug: design-system-onboarding-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual visual verification + expo lint |
| **Config file** | none |
| **Quick run command** | `npx expo start` (visual check in dev build) |
| **Full suite command** | `npx expo run:ios` (production build for splash/font verification) |
| **Estimated runtime** | ~60 seconds (dev), ~180 seconds (production build) |

---

## Sampling Rate

- **After every task commit:** Run `npx expo start` (visual check in simulator)
- **After every plan wave:** Full onboarding flow walkthrough + main screens check
- **Before `/gsd:verify-work`:** Production build with EAS, full visual audit
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | FOUN-06 | manual-only | Visual: all text renders in Rubik | N/A | ⬜ pending |
| 04-01-02 | 01 | 1 | FOUN-05 | manual-only | Visual: splash shows logo, fades without white flash | N/A | ⬜ pending |
| 04-01-03 | 01 | 1 | FOUN-07 | manual-only | Visual: CTA buttons blue pill shape | N/A | ⬜ pending |
| 04-01-04 | 01 | 1 | FOUN-09 | manual-only | Visual: fixed bottom CTA 24px bottom / 16px horizontal | N/A | ⬜ pending |
| 04-02-01 | 02 | 1 | FOUN-08 | smoke | `npx expo lint` (hardcoded values check) | N/A | ⬜ pending |
| 04-02-02 | 02 | 1 | ONBR-04 | manual-only | Visual: progress dots white-50%-opacity inactive, blue active | N/A | ⬜ pending |
| 04-02-03 | 02 | 1 | ONBR-05 | manual-only | Visual: progress dots hold fixed position across screens | N/A | ⬜ pending |
| 04-02-04 | 02 | 1 | ONBR-07 | manual-only | Visual: name input disables CTA, no skip button | N/A | ⬜ pending |
| 04-02-05 | 02 | 1 | ONBR-08 | manual-only | Visual: Stay in the Loop no overflow on small screens | N/A | ⬜ pending |
| 04-02-06 | 02 | 1 | ONBR-09 | manual-only | Visual: Mailing List no overflow on small screens | N/A | ⬜ pending |
| 04-02-07 | 02 | 1 | ONBR-10 | manual-only | Visual: all onboarding CTAs blue pill | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. This phase is primarily visual polish — no automated test framework needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Splash screen shows Birda logo and fades | FOUN-05 | Native splash requires production build | Build with EAS, launch fresh, verify logo + fade transition |
| All text renders in Rubik | FOUN-06 | Font rendering is visual | Check every screen in simulator, compare font names in inspector |
| CTA buttons blue with pill shape | FOUN-07 | Visual styling check | Navigate all screens, verify button color (#1F87FE) and borderRadius |
| Spacing matches theme tokens | FOUN-08 | Requires visual measurement | Spot-check spacing against 4px grid across screens |
| Fixed bottom CTA padding | FOUN-09 | Layout measurement | Verify 24px bottom / 16px horizontal on onboarding + paywall |
| Progress dots colors | ONBR-04 | Color rendering check | Navigate onboarding, verify inactive=white-50%, active=blue |
| Progress dots fixed position | ONBR-05 | Layout stability check | Swipe through onboarding screens, dots must not shift |
| Name input CTA disabled state | ONBR-07 | Interaction + visual | Open name screen, verify CTA disabled (40% opacity), type text, verify enabled |
| Stay in the Loop no overflow | ONBR-08 | Overflow is visual | Check on iPhone SE size, no content clipped |
| Mailing List no overflow | ONBR-09 | Overflow is visual | Check on iPhone SE size, no content clipped |
| Onboarding CTAs blue pill | ONBR-10 | Visual consistency | Navigate all onboarding screens, verify CTA appearance |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
