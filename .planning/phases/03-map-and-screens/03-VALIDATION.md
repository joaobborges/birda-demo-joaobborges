---
phase: 3
slug: map-and-screens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — testing out of scope per REQUIREMENTS.md |
| **Config file** | None |
| **Quick run command** | `npx expo lint` |
| **Full suite command** | `npx expo lint && ls src/components/map/BirdMarker.tsx src/components/map/BirdInfoCard.tsx` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx expo lint`
- **After every plan wave:** Visual manual check of all 5 success criteria on simulator
- **Before `/gsd:verify-work`:** Full visual walkthrough must pass
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | MAP-01 | manual-only | Visual: zoom out, verify clusters form | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | MAP-02 | manual-only | Visual: verify floating UI icons | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | MAP-03 | smoke | `ls src/components/map/BirdMarker.tsx src/components/map/BirdInfoCard.tsx` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | SCRN-01 | manual-only | Visual: tap profile icon, verify sheet | N/A | ⬜ pending |
| 03-02-02 | 02 | 2 | SCRN-02 | manual-only | Visual: tap community icon, verify feed | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework needed — testing explicitly out of scope per REQUIREMENTS.md
- [ ] File existence check for MAP-03 is the only automatable verification

*Existing lint infrastructure covers automated checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Markers cluster at lower zoom levels | MAP-01 | Visual/spatial behavior | Zoom out on map, verify markers merge into clusters with count badge |
| Floating UI overlay renders correctly | MAP-02 | Visual layout verification | Check profile icon (top-left), community/notification (top-right), capture/logbook (bottom) |
| Profile screen opens with correct content | SCRN-01 | Interactive UI flow | Tap profile icon, verify avatar, username, skill badge, achievement badges |
| Community screen opens with sighting feed | SCRN-02 | Interactive UI flow | Tap community icon, verify scrollable feed of mock bird sightings |

---

## Validation Sign-Off

- [ ] All tasks have manual verify or Wave 0 dependencies
- [ ] Sampling continuity: lint runs after every commit
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
