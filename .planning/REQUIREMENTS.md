# Requirements: Birda

**Defined:** 2026-03-09
**Core Value:** A polished, production-grade mobile prototype that demonstrates real-world mobile engineering craft

## v1.1 Requirements

Requirements for polish & refinement milestone. Each maps to roadmap phases.

### Foundation

- [x] **FOUN-05**: App displays splash screen with Birda logo on launch
- [x] **FOUN-06**: All text renders in Rubik typeface (font loaded at build time)
- [x] **FOUN-07**: All primary CTA buttons use design system color tokens
- [x] **FOUN-08**: All screens use spacing tokens from theme for consistent gaps
- [x] **FOUN-09**: All fixed bottom CTA containers use 24px bottom / 16px horizontal padding

### Welcome Screen

- [x] **WELC-01**: Welcome screen content is locked (no scrolling)
- [x] **WELC-02**: Welcome screen displays auto-scrolling mosaic with bird images in 3 columns moving at different speeds

### Authentication

- [x] **AUTH-01**: Login button opens bottom drawer with Apple and Google sign-in options
- [x] **AUTH-02**: Create account button opens bottom drawer with Apple, Google, and Email options
- [x] **AUTH-03**: Selecting any auth option proceeds to next onboarding screen

### Onboarding

- [x] **ONBR-04**: Progress dots show white at 50% opacity (inactive) and blue (active)
- [x] **ONBR-05**: Progress dots maintain fixed position across all onboarding screens
- [x] **ONBR-06**: "How should we call you" screen has increased spacing below avatar
- [x] **ONBR-07**: Name input screen has no skip button; CTA is disabled until text is entered
- [x] **ONBR-08**: Stay in the Loop screen content stays within view (overflow bug fix)
- [x] **ONBR-09**: Mailing List screen content stays within view (overflow bug fix)
- [x] **ONBR-10**: All onboarding CTA buttons use primary color with pill shape

### Paywall

- [x] **PAYW-04**: Paywall displays hero image with close (x) button top-right
- [x] **PAYW-05**: Paywall shows "Unlock the full experience" with 3 feature bullet points
- [x] **PAYW-06**: Paywall shows social proof (400+ happy birders, 4.7 stars)
- [x] **PAYW-07**: Paywall shows pricing (3,33/month large, annual line small)
- [x] **PAYW-08**: Paywall CTA reads "Redeem your FREE Week"
- [x] **PAYW-09**: Paywall footer shows Terms of Use / Restore Purchase / Privacy Policy
- [x] **PAYW-10**: Close button dismisses paywall and navigates to home screen

### Home & Navigation

- [x] **NAV-01**: Home screen uses native iOS tab bar for Capture and Logbook
- [ ] **NAV-02**: Debug button is positioned at top of screen with app-consistent styling
- [ ] **NAV-03**: Map bird info drawer is full-width (left, right, bottom edges)
- [ ] **NAV-04**: Map drawer renders above all other content (including debug)
- [ ] **NAV-05**: Map drawer supports swipe-to-dismiss gesture

## Future Requirements

### Deferred from v1.0

- **NOTF-01**: User receives in-app notifications
- **MODR-01**: User can report content
- **CAPT-01**: Capture flow with actual functionality
- **LOG-01**: Logbook with observation history

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real authentication backend | Prototype uses local data only -- auth drawer is visual demo |
| Payment processing | Paywall is visual demo only |
| Dark mode | Doubles design surface, single theme for prototype |
| Bird identification (ML/AI) | Separate project scope |
| Push notifications | Requires backend, APNs/FCM |
| Web platform | Mobile-only prototype |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-05 | Phase 4 | Complete |
| FOUN-06 | Phase 4 | Complete |
| FOUN-07 | Phase 4 | Complete |
| FOUN-08 | Phase 4 | Complete |
| FOUN-09 | Phase 4 | Complete |
| WELC-01 | Phase 5 | Complete |
| WELC-02 | Phase 5 | Complete |
| AUTH-01 | Phase 5 | Complete |
| AUTH-02 | Phase 5 | Complete |
| AUTH-03 | Phase 5 | Complete |
| ONBR-04 | Phase 4 | Complete |
| ONBR-05 | Phase 4 | Complete |
| ONBR-06 | Phase 4 | Complete |
| ONBR-07 | Phase 4 | Complete |
| ONBR-08 | Phase 4 | Complete |
| ONBR-09 | Phase 4 | Complete |
| ONBR-10 | Phase 4 | Complete |
| PAYW-04 | Phase 6 | Complete |
| PAYW-05 | Phase 6 | Complete |
| PAYW-06 | Phase 6 | Complete |
| PAYW-07 | Phase 6 | Complete |
| PAYW-08 | Phase 6 | Complete |
| PAYW-09 | Phase 6 | Complete |
| PAYW-10 | Phase 6 | Complete |
| NAV-01 | Phase 7 | Complete |
| NAV-02 | Phase 7 | Pending |
| NAV-03 | Phase 7 | Pending |
| NAV-04 | Phase 7 | Pending |
| NAV-05 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
