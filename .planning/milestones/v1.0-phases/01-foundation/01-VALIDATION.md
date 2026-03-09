---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test framework installed (this phase uses grep + eslint) |
| **Config file** | none — Wave 0 installs ESLint |
| **Quick run command** | `grep -rn '#[0-9a-fA-F]\{3,8\}' app/ src/components/ --include='*.tsx'` |
| **Full suite command** | `npx eslint app/ src/` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `grep -rn '#[0-9a-fA-F]\{3,8\}' app/ src/components/ --include='*.tsx'` (zero results = pass)
- **After every plan wave:** Run `npx eslint app/ src/` (zero errors = pass)
- **Before `/gsd:verify-work`:** All four checks green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | FOUN-04 | lint | `npx eslint app/ src/` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUN-01 | grep | `grep -rn '#[0-9a-fA-F]\{3,8\}' app/ src/components/ --include='*.tsx'` | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUN-02 | manual-only | Visual verification on device/simulator | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUN-03 | manual-only | Check Metro bundler output or React DevTools Memo badge | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `eslint.config.mjs` — ESLint flat config for FOUN-04
- [ ] Install eslint and plugins: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-no-barrel-files`
- [ ] Install expo-splash-screen: `npx expo install expo-splash-screen`
- [ ] Add `"lint": "eslint app/ src/"` script to package.json

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No flash of onboarding for returning user | FOUN-02 | Requires visual verification of splash → map transition | 1. Set onboarding complete in AsyncStorage 2. Cold-start app 3. Verify splash holds until map appears |
| React Compiler active | FOUN-03 | Requires Metro output or DevTools inspection | 1. Run `npx expo start` 2. Check Metro output for "React Compiler" 3. Verify Memo badge in React DevTools |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
