# Requirements: Birda

**Defined:** 2026-03-09
**Core Value:** A polished, production-grade mobile prototype that demonstrates real-world mobile engineering craft

## v1 Requirements

Requirements for the interview demo prototype. Each maps to roadmap phases.

### Foundation

- [x] **FOUN-01**: App uses centralized theme tokens (colors, spacing) instead of hardcoded hex values
- [x] **FOUN-02**: Returning users see map immediately — no flash of onboarding (Zustand hydration guard)
- [x] **FOUN-03**: React Compiler (babel-plugin-react-compiler) is enabled and auto-memoizes components
- [x] **FOUN-04**: ESLint enforces jsx-no-leaked-render and no-barrel-files rules

### Onboarding

- [ ] **ONBR-01**: Each onboarding screen has animated content transitions (FadeIn, spring effects on buttons)
- [x] **ONBR-02**: Onboarding screens share a reusable layout component (no duplicated styles across 7 screens)
- [ ] **ONBR-03**: Name and location inputs use uncontrolled TextInput pattern (ref-based, commit on Continue)

### Map

- [ ] **MAP-01**: Bird markers cluster automatically at lower zoom levels via react-native-map-clustering
- [ ] **MAP-02**: Map has floating UI overlay — profile icon (top-left), community + notification icons (top-right), capture + logbook buttons (bottom)
- [ ] **MAP-03**: BirdMarker and BirdInfoCard are extracted to src/components/map/ as reusable components

### Screens

- [ ] **SCRN-01**: Profile screen opens as native form sheet with avatar, username, skill badge, and mock achievement badges
- [ ] **SCRN-02**: Community screen opens as native form sheet with LegendList feed of mock bird sightings

### Paywall

- [ ] **PAYW-01**: Plan toggle animates with withSpring and adapts to content width (no hardcoded dimensions)
- [ ] **PAYW-02**: Paywall headline references user's name or skill level from onboarding store
- [ ] **PAYW-03**: Nature Day discount variant is accessible via debug panel with 20% off pricing and urgency copy

### Styling

- [ ] **STYL-01**: All rounded corners use borderCurve: 'continuous' for smooth iOS corners throughout the app

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Dev Tooling

- **DEVT-01**: FPS monitor in debug panel using Reanimated useFrameCallback for UI-thread measurement
- **DEVT-02**: Debug panel shows formatted Zustand state dump

### Production

- **PROD-01**: Production build has tree shaking enabled and verified
- **PROD-02**: Android build uses R8 shrinking and Hermes mmap optimization
- **PROD-03**: iOS build uses asset catalog optimization
- **PROD-04**: Production bundle passes 16KB alignment check for Google Play

### Polish

- **POLH-01**: Bird photos use expo-image prefetching for visible region
- **POLH-02**: Back gesture disabled on onboarding stack (enforce linear wizard)
- **POLH-03**: Custom fonts loaded via expo-font config plugin (no runtime loading)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real authentication / backend | Prototype uses local data only — mention "backend-ready" in conversation |
| Working capture flow | Camera integration is huge scope for no demo value — visual button only |
| Working logbook | Full CRUD data layer is a separate app — visual button only |
| Push notification delivery | Requires backend, APNs/FCM — onboarding preferences show the pattern |
| Payment processing | App Store review, sandbox testing — paywall is visual demo only |
| Bird identification (ML/AI) | Separate project scope — map discovery is the core interaction |
| Dark mode | Doubles design surface — single well-executed theme is better |
| Automated test suite | Architecture should be testable — mention testing approach in conversation |
| CI/CD pipeline | EAS config ready — wiring GitHub Actions is deferred |
| Web platform | Mobile-only — iOS primary, Android secondary |
| Expo Go support | Maps require native modules — EAS Dev Client only |
| Internationalization | English only — mention "strings are extractable" if asked |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Complete |
| FOUN-02 | Phase 1 | Complete |
| FOUN-03 | Phase 1 | Complete |
| FOUN-04 | Phase 1 | Complete |
| ONBR-01 | Phase 2 | Pending |
| ONBR-02 | Phase 2 | Complete |
| ONBR-03 | Phase 2 | Pending |
| PAYW-01 | Phase 2 | Pending |
| PAYW-02 | Phase 2 | Pending |
| PAYW-03 | Phase 2 | Pending |
| STYL-01 | Phase 2 | Pending |
| MAP-01 | Phase 3 | Pending |
| MAP-02 | Phase 3 | Pending |
| MAP-03 | Phase 3 | Pending |
| SCRN-01 | Phase 3 | Pending |
| SCRN-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
