# Roadmap: Birda

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-03-09)
- ✅ **v1.1 Polish & Refinement** — Phases 4-8 (shipped 2026-03-10)
- 🚧 **v1.2 UI Polish & Image Wiring** — Phases 14-15 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-03-09</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed 2026-03-09
- [x] Phase 2: Onboarding and Paywall (5/5 plans) — completed 2026-03-09
- [x] Phase 3: Map and Screens (3/3 plans) — completed 2026-03-09

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

<details>
<summary>✅ v1.1 Polish & Refinement (Phases 4-8) — SHIPPED 2026-03-10</summary>

- [x] Phase 4: Design System & Onboarding Polish (4/4 plans) — completed 2026-03-09
- [x] Phase 5: Welcome Screen & Auth Drawer (2/2 plans) — completed 2026-03-10
- [x] Phase 6: Paywall Redesign (1/1 plans) — completed 2026-03-10
- [x] Phase 7: Native Tabs & Map Drawer (3/3 plans) — completed 2026-03-10
- [x] Phase 8: Auth Fix & UI Polish (3/3 plans) — completed 2026-03-10

See: `.planning/milestones/v1.1-ROADMAP.md` for full details.

</details>

### v1.2 UI Polish & Image Wiring (In Progress)

**Milestone Goal:** Fix remaining UI issues and wire all placeholder elements to named image assets so real photos can be dropped in.

- [x] **Phase 14: UI Fixes** - Fix auth backdrop, stepper dot colors, and replace Capture tab with floating action button (completed 2026-03-10)
- [x] **Phase 15: Image Wiring** - Wire all placeholder surfaces to named image assets and deliver image manifest (completed 2026-03-10)

## Phase Details

### Phase 14: UI Fixes
**Goal**: All identified visual defects and missing interactions are corrected and the capture FAB replaces the Capture tab
**Depends on**: Phase 8 (v1.1 complete)
**Requirements**: UFIX-01, UFIX-02, UFIX-03, UFIX-04
**Success Criteria** (what must be TRUE):
  1. Opening the auth drawer on the welcome screen shows a full-screen dark backdrop covering the bird mosaic behind it
  2. Inactive progress dots on all onboarding screens render as blue at 50% opacity (not white)
  3. The Capture tab is gone from the tab bar and a floating action button appears on the Map/Explore tab
  4. Tapping the FAB opens an animated option menu showing camera, microphone, and other capture options (no functional integration required)
**Plans:** 2/2 plans complete
Plans:
- [ ] 14-01-PLAN.md — Fix auth backdrop, stepper dots, and remove Capture tab
- [ ] 14-02-PLAN.md — Create FAB with animated capture menu on Map screen

### Phase 15: Image Wiring
**Goal**: Every placeholder surface across the app is wired to a named local image asset via require(), and a complete image manifest is delivered
**Depends on**: Phase 14
**Requirements**: IMG-01, IMG-02, IMG-03, IMG-04, IMG-05, IMG-06, IMG-07
**Success Criteria** (what must be TRUE):
  1. Welcome screen mosaic cells display bird photos loaded from named local assets (not placeholder views or emoji)
  2. Each onboarding screen displays its hero/cover image at the top, loaded from a named local asset
  3. The onboarding name screen displays the user avatar image loaded from a named local asset
  4. Map bird markers and bird detail drawer display the species thumbnail image loaded from a named local asset
  5. Bird detail screen displays the species hero image loaded from a named local asset, and an image manifest file exists listing every asset filename, dimensions, and location
**Plans:** 3 plans (2 complete + 1 gap closure)
Plans:
- [x] 15-01-PLAN.md — Download bird images and wire all bird-image-consuming components
- [x] 15-02-PLAN.md — Wire onboarding/paywall placeholders and create image manifest
- [ ] 15-03-PLAN.md — Fix bird image cropping, map pin tappability, and name screen heading (gap closure)

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-09 |
| 2. Onboarding and Paywall | v1.0 | 5/5 | Complete | 2026-03-09 |
| 3. Map and Screens | v1.0 | 3/3 | Complete | 2026-03-09 |
| 4. Design System & Onboarding Polish | v1.1 | 4/4 | Complete | 2026-03-09 |
| 5. Welcome Screen & Auth Drawer | v1.1 | 2/2 | Complete | 2026-03-10 |
| 6. Paywall Redesign | v1.1 | 1/1 | Complete | 2026-03-10 |
| 7. Native Tabs & Map Drawer | v1.1 | 3/3 | Complete | 2026-03-10 |
| 8. Auth Fix & UI Polish | v1.1 | 3/3 | Complete | 2026-03-10 |
| 14. UI Fixes | v1.2 | 2/2 | Complete | 2026-03-10 |
| 15. Image Wiring | v1.2 | 2/3 | In Progress | - |
