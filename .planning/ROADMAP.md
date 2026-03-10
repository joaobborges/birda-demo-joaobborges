# Roadmap: Birda

## Milestones

- ✅ **v1.0 MVP** -- Phases 1-3 (shipped 2026-03-09)
- :construction: **v1.1 Polish & Refinement** -- Phases 4-8 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-3) -- SHIPPED 2026-03-09</summary>

- [x] Phase 1: Foundation (2/2 plans) -- completed 2026-03-09
- [x] Phase 2: Onboarding and Paywall (5/5 plans) -- completed 2026-03-09
- [x] Phase 3: Map and Screens (3/3 plans) -- completed 2026-03-09

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

### v1.1 Polish & Refinement (In Progress)

**Milestone Goal:** Refine the prototype with design system enforcement, layout fixes, a redesigned paywall, and native-feeling navigation to make it feel production-ready.

- [ ] **Phase 4: Design System & Onboarding Polish** - Rubik font loading, splash screen, token enforcement across all screens, and onboarding layout fixes
- [x] **Phase 5: Welcome Screen & Auth Drawer** - Auto-scrolling bird mosaic animation and bottom sheet auth drawer with sign-in options (completed 2026-03-10)
- [x] **Phase 6: Paywall Redesign** - New single paywall with hero image, pricing, bullet points, and dismiss-to-home navigation (completed 2026-03-10)
- [x] **Phase 7: Native Tabs & Map Drawer** - Native iOS tab bar, debug button repositioning, and full-width swipeable map bird detail drawer (completed 2026-03-10)
- [ ] **Phase 8: Auth Fix & UI Polish** - Gate login drawer email button, add paywall social proof content, ensure drawer full-width rendering

## Phase Details

### Phase 4: Design System & Onboarding Polish
**Goal**: Every screen renders with the Birda design system -- Rubik font, color tokens, spacing tokens -- and the onboarding flow has no visual bugs
**Depends on**: Phase 3 (v1.0 complete)
**Requirements**: FOUN-05, FOUN-06, FOUN-07, FOUN-08, FOUN-09, ONBR-04, ONBR-05, ONBR-06, ONBR-07, ONBR-08, ONBR-09, ONBR-10
**Success Criteria** (what must be TRUE):
  1. App launches with Birda logo splash screen that fades into the first screen with no white flash
  2. All visible text across every screen renders in Rubik typeface (no system font fallback anywhere)
  3. All primary CTA buttons use the design system blue (#1F87FE) with pill shape, and all spacing between elements matches theme tokens
  4. All fixed bottom CTA containers sit at consistent 24px bottom / 16px horizontal padding across onboarding, paywall, and any future screens
  5. Progress dots display white-at-50%-opacity (inactive) and blue (active), hold fixed position across screens, name input disables CTA until text is entered, and no content overflows on Stay in the Loop or Mailing List screens
**Plans:** 4 plans

Plans:
- [ ] 04-01-PLAN.md -- Font loading, splash screen, and theme infrastructure (fixedBottomCTA, typography rewrite)
- [ ] 04-02-PLAN.md -- Component fixes: Button (color + disabled), ProgressDots, OnboardingLayout, name.tsx
- [ ] 04-03-PLAN.md -- Token enforcement sweep across all 14 screen/component files + overflow fixes
- [ ] 04-04-PLAN.md -- UAT gap closure: runtime font loading, splash screen config, layout safe area fix

### Phase 5: Welcome Screen & Auth Drawer
**Goal**: Users see an eye-catching animated welcome screen and can choose how to sign in via a bottom sheet drawer
**Depends on**: Phase 4
**Requirements**: WELC-01, WELC-02, AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. Welcome screen displays a continuously auto-scrolling mosaic of bird images in 3 columns at different speeds, with no scroll interaction allowed
  2. Tapping "Login" opens a bottom drawer presenting Apple and Google sign-in options
  3. Tapping "Create account" opens a bottom drawer presenting Apple, Google, and Email sign-in options
  4. Selecting any auth option in either drawer dismisses the drawer and advances to the next onboarding screen
**Plans:** 2/2 plans complete

Plans:
- [ ] 05-01-PLAN.md -- Install @gorhom/bottom-sheet, create BirdMosaic, AuthDrawer, and AuthOptionButton components
- [ ] 05-02-PLAN.md -- Rewrite welcome screen with standalone layout, mosaic, and auth drawer integration

### Phase 6: Paywall Redesign
**Goal**: The paywall presents a polished, conversion-oriented layout and dismissing it navigates directly to the home screen
**Depends on**: Phase 5
**Requirements**: PAYW-04, PAYW-05, PAYW-06, PAYW-07, PAYW-08, PAYW-09, PAYW-10
**Success Criteria** (what must be TRUE):
  1. Paywall displays a hero image at the top with a close (x) button in the top-right corner
  2. Paywall shows "Unlock the full experience" headline, 3 feature bullet points, social proof (400+ happy birders, 4.7 stars), and pricing (large monthly rate, small annual line)
  3. CTA reads "Redeem your FREE Week" and footer shows Terms of Use, Restore Purchase, and Privacy Policy links
  4. Tapping the close button dismisses the paywall and lands the user on the home map screen (no onboarding screens in back stack)
**Plans:** 1/1 plans complete

Plans:
- [ ] 06-01-PLAN.md -- Complete paywall rewrite: standalone layout with hero, bullets, social proof, pricing, CTA, and dismiss navigation

### Phase 7: Native Tabs & Map Drawer
**Goal**: The home screen uses a native iOS tab bar and bird details appear in a full-width swipeable drawer above all content
**Depends on**: Phase 6
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05
**Success Criteria** (what must be TRUE):
  1. Home screen shows a native iOS tab bar with Map, Capture, and Logbook tabs (SF Symbol icons, proper active/inactive states)
  2. Debug button is positioned at the top of the screen with styling consistent with the rest of the app
  3. Tapping a bird marker opens a full-width drawer (touching left, right, and bottom edges) that renders above all other content including the debug button
  4. Map drawer supports swipe-to-dismiss gesture and the map remains interactive when the drawer is collapsed
**Plans:** 3/3 plans complete

Plans:
- [ ] 07-01-PLAN.md -- Native iOS tab bar with 4 tabs, placeholder Capture/Logbook screens, map cleanup
- [ ] 07-02-PLAN.md -- Triple-tap dev panel gesture replacing floating debug button
- [ ] 07-03-PLAN.md -- Full-width bird drawer with BottomSheet, bird detail push screen, and visual verification

### Phase 8: Auth Fix & UI Polish
**Goal**: Close all audit gaps — fix auth drawer login mode, add social proof content, and ensure drawer renders full-width above all content
**Depends on**: Phase 7
**Requirements**: AUTH-01, PAYW-06, NAV-03, NAV-04
**Gap Closure:** Closes gaps from v1.1 audit
**Success Criteria** (what must be TRUE):
  1. Login drawer shows only Apple and Google options (no Email button)
  2. Paywall social proof boxes display "400+ happy birders" and "4.7 stars" content
  3. Bird info drawer touches left, right, and bottom edges with explicit marginHorizontal: 0
  4. Bird info drawer renders above tab bar and all other content

Plans: TBD

## Progress

**Execution Order:** Phase 4 -> 5 -> 6 -> 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-09 |
| 2. Onboarding and Paywall | v1.0 | 5/5 | Complete | 2026-03-09 |
| 3. Map and Screens | v1.0 | 3/3 | Complete | 2026-03-09 |
| 4. Design System & Onboarding Polish | v1.1 | 3/4 | Executing | - |
| 5. Welcome Screen & Auth Drawer | 2/2 | Complete   | 2026-03-10 | - |
| 6. Paywall Redesign | 1/1 | Complete   | 2026-03-10 | - |
| 7. Native Tabs & Map Drawer | 3/3 | Complete   | 2026-03-10 | - |
| 8. Auth Fix & UI Polish | v1.1 | 0/0 | Pending | - |
