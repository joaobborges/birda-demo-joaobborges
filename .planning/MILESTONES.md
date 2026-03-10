# Milestones

## v1.1 Polish & Refinement (Shipped: 2026-03-10)

**Phases completed:** 5 phases, 13 plans
**Timeline:** 2 days (2026-03-09 → 2026-03-10)
**LOC:** 3,671 TypeScript/TSX | 34 files changed (+1,634 / -587)

**Key accomplishments:**
- Design system enforcement — Rubik font build-time loading, splash screen, color/spacing tokens across all screens
- Auto-scrolling bird mosaic welcome screen with bottom-sheet auth drawer (Apple, Google, Email)
- Conversion-optimized standalone paywall with hero, pricing, social proof, bullet points, and dismiss-to-home
- Native tab bar with 4 tabs, full-width swipeable bird detail drawer, and scrollable detail screen
- Auth drawer backdrop fix, onboarding top-alignment, keyboard avoidance, profile achievements vertical list

**Tech debt (non-blocking):**
- `profile.tsx`: Non-standard spacing values with `// no exact token` comments (6 instances)
- Paywall hero and social proof images are placeholder Views (awaiting design assets)
- `bird-detail.tsx` "Log Sighting" CTA has no onPress handler (intentional placeholder)
- `profile.tsx` has hardcoded stat numbers (prototype data)

---

## v1.0 MVP (Shipped: 2026-03-09)

**Phases completed:** 3 phases, 10 plans
**Timeline:** 4 days (2026-03-06 → 2026-03-09)
**LOC:** 2,649 TypeScript/TSX | 81 files modified

**Key accomplishments:**
- Centralized design system with theme tokens, hydration guard, React Compiler, and ESLint rules
- Polished 12-screen onboarding wizard with animated transitions and shared layout component
- Adaptive paywall with personalized headline, spring toggle, and Nature Day discount variant
- Full-bleed illustration layout, ghost button variant, and translucent status bar
- Supercluster map clustering with shape-coded markers and Ionicons floating nav UI
- Profile and community push screens with social-feed card layout

**Tech debt (non-blocking):**
- `src/theme/index.ts` re-exports non-existent `widgetSpacing`
- `src/theme/components.ts` buttons preset and borderRadius map are dead code
- SUMMARY.md files missing `requirements_completed` frontmatter

---

