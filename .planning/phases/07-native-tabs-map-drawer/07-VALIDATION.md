---
phase: 7
slug: native-tabs-map-drawer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — all verification is manual (gesture/visual/layout behaviors) |
| **Config file** | N/A |
| **Quick run command** | Manual smoke test on iOS Simulator |
| **Full suite command** | Full manual test of all NAV-01 through NAV-05 on device |
| **Estimated runtime** | ~60 seconds (manual) |

---

## Sampling Rate

- **After every task commit:** Manual smoke test on iOS Simulator
- **After every plan wave:** Full manual test of all NAV-01 through NAV-05 behaviors on device
- **Before `/gsd:verify-work`:** All 5 NAV requirements visually verified
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | NAV-01 | manual-only | N/A — native tab bar requires device | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | NAV-02 | manual-only | N/A — gesture testing requires device | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | NAV-03 | manual-only | N/A — visual/layout verification | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 1 | NAV-04 | manual-only | N/A — z-order requires visual check | ❌ W0 | ⬜ pending |
| 07-02-03 | 02 | 1 | NAV-05 | manual-only | N/A — gesture testing requires device | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — all verification is manual for this phase (gesture/visual/layout behaviors on iOS Simulator/device).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Native tab bar renders with 4 tabs | NAV-01 | UIKit native component, requires device | Launch app → verify Map/Capture/Logbook tabs with SF Symbol icons, check active/inactive states |
| Debug panel via triple-tap | NAV-02 | Gesture testing requires device | Triple-tap anywhere → verify DevPanel appears, styled consistently |
| Drawer full-width edges | NAV-03 | Visual/layout verification | Tap bird marker → verify drawer touches left, right, bottom edges |
| Drawer above all content | NAV-04 | Z-order requires visual check | Open drawer → verify it renders above tab bar and debug button |
| Swipe-to-dismiss | NAV-05 | Gesture testing requires device | Swipe drawer down → verify it dismisses, map remains interactive |

---

## Validation Sign-Off

- [ ] All tasks have manual verify instructions
- [ ] Sampling continuity: manual smoke test after each task commit
- [ ] Wave 0: N/A — all manual verification
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
