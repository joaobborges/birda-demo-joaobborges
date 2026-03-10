# Requirements: Birda

**Defined:** 2026-03-10
**Core Value:** A polished, production-grade mobile prototype that demonstrates real-world mobile engineering craft

## v1.2 Requirements

Requirements for UI Polish & Image Wiring milestone. Each maps to roadmap phases.

### UI Fixes

- [x] **UFIX-01**: Auth bottom sheet backdrop covers full welcome screen including mosaic grid
- [x] **UFIX-02**: Onboarding inactive progress dots use blue at 50% opacity instead of white
- [x] **UFIX-03**: Capture tab replaced with floating action button on Map/Explore tab
- [x] **UFIX-04**: FAB press opens animated option menu (camera, microphone, etc.) — visual only

### Image Wiring

- [x] **IMG-01**: Welcome screen mosaic cells wired to named bird image assets
- [ ] **IMG-02**: Onboarding screens wired to hero/cover image assets at top of each screen
- [ ] **IMG-03**: Onboarding name screen wired to avatar image asset
- [x] **IMG-04**: Map bird markers wired to species thumbnail image assets
- [x] **IMG-05**: Bird detail drawer wired to species thumbnail image
- [x] **IMG-06**: Bird detail screen wired to species hero image asset
- [ ] **IMG-07**: Complete image manifest delivered (filenames, dimensions, locations)

## Future Requirements

None deferred — all scoped features included in v1.2.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Actual camera/microphone integration | FAB menu is visual interaction only |
| AI-generated placeholder images | User provides all image assets |
| Image optimization/caching pipeline | Prototype uses local require() |
| Dark mode variants of images | Single theme only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UFIX-01 | Phase 14 | Complete |
| UFIX-02 | Phase 14 | Complete |
| UFIX-03 | Phase 14 | Complete |
| UFIX-04 | Phase 14 | Complete |
| IMG-01 | Phase 15 | Complete |
| IMG-02 | Phase 15 | Pending |
| IMG-03 | Phase 15 | Pending |
| IMG-04 | Phase 15 | Complete |
| IMG-05 | Phase 15 | Complete |
| IMG-06 | Phase 15 | Complete |
| IMG-07 | Phase 15 | Pending |

**Coverage:**
- v1.2 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 — traceability added after roadmap creation*
