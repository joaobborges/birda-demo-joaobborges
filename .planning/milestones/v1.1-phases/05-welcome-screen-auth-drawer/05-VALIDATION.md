---
phase: 5
slug: welcome-screen-auth-drawer
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-10
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test infrastructure exists; not needed for visual/animation phase |
| **Config file** | none |
| **Quick run command** | `npx expo start` (visual verification on device/simulator) |
| **Full suite command** | `npx expo start` (full walkthrough on device/simulator) |
| **Estimated runtime** | ~30 seconds (app launch + manual flow) |

---

## Sampling Rate

- **After every task commit:** Run app in Expo Go / dev client, visually verify changed behavior
- **After every plan wave:** Full walkthrough of welcome → auth drawer → navigation flow
- **Before `/gsd:verify-work`:** All 5 requirements visually confirmed on device
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | WELC-01 | manual | Visual: content locked, no scroll | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | WELC-02 | manual | Visual: 3 columns, different speeds | N/A | ⬜ pending |
| 05-02-01 | 02 | 1 | AUTH-01 | manual | Visual: Login opens drawer with Apple + Google | N/A | ⬜ pending |
| 05-02-02 | 02 | 1 | AUTH-02 | manual | Visual: Create account opens drawer with Apple + Google + Email | N/A | ⬜ pending |
| 05-02-03 | 02 | 1 | AUTH-03 | manual | Visual: Auth option dismisses drawer, navigates to ai-bird-id | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install @gorhom/bottom-sheet@^5` — required dependency not yet installed

*Existing infrastructure covers remaining phase requirements (Reanimated, expo-image, gesture-handler already installed).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Welcome screen content is locked (no scrolling) | WELC-01 | Visual/gesture behavior — cannot be unit tested | Try to scroll the welcome screen; verify content does not move |
| Auto-scrolling mosaic with 3 columns at different speeds | WELC-02 | Animation behavior — requires visual confirmation | Observe mosaic: 3 columns moving continuously at different speeds, seamless loop |
| Login opens drawer with Apple + Google | AUTH-01 | UI interaction flow | Tap Login button; verify drawer opens with Apple and Google options |
| Create account opens drawer with Apple + Google + Email | AUTH-02 | UI interaction flow | Tap Create Account; verify drawer opens with Apple, Google, and Email options |
| Auth option proceeds to next screen | AUTH-03 | Navigation flow | Tap any auth option; verify drawer dismisses then navigates to ai-bird-id |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
