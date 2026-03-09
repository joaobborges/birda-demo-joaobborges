# Feature Landscape

**Domain:** Bird watching mobile app -- interview demo prototype
**Researched:** 2026-03-09
**Confidence:** MEDIUM (based on training data knowledge of birding apps like eBird, Merlin, Birda, BirdNET, iNaturalist, and mobile engineering interview patterns; no web search verification available)

## Context: Two Audiences, Two Feature Lenses

This prototype serves two audiences simultaneously:

1. **Interview evaluators** -- senior mobile engineers and hiring managers who will assess engineering craft, architecture decisions, and attention to detail
2. **Simulated end users** -- the app must feel like a real product someone would download

Features are categorized through both lenses. A feature is "table stakes" if omitting it makes either the demo feel unfinished OR the engineering unimpressive.

---

## Table Stakes

Features the app must have or it feels like a rough prototype rather than a polished demo.

| Feature | Why Expected | Complexity | Status | Notes |
|---------|--------------|------------|--------|-------|
| Multi-step onboarding with progress indication | Every modern app has onboarding; shows state management craft | Med | Exists (needs polish) | 7 screens already built. Polish animations, fix ProgressDots off-by-one bug |
| Paywall screen with plan toggle | Standard monetization pattern; shows animation skill | Med | Exists (needs polish) | Add spring animation to toggle, fix hardcoded 148px width |
| Full-bleed map with bird markers | Core value prop of a birding app; shows native module integration | High | Exists | Zoom-based filtering already works |
| Bird info card on marker tap | Without it, markers are meaningless; shows modal/card interaction patterns | Low | Exists | Slide-up card with bird details |
| Marker clustering | Expected when map has multiple pins; shows awareness of map perf | Med | Not built | Use react-native-map-clustering (already in deps) |
| Profile screen | Personalizes the experience; shows form sheet / modal presentation | Low | Not built | Mock data from onboarding store (name, skill level, achievements) |
| Community feed | Social proof is expected in modern apps; shows list virtualization | Med | Not built | LegendList with mock sighting data |
| Haptic feedback on CTAs | iOS users expect tactile responses; shows platform awareness | Low | Exists | expo-haptics on Button component |
| Safe area handling | Broken layout on notched devices looks amateur | Low | Exists | useSafeAreaInsets throughout |
| Error boundary on map | Maps crash on Android; unhandled crash in demo is fatal | Low | Exists | ErrorBoundary on map screen |
| Smooth 60fps animations | Janky animations signal "not production ready" | Med | Partially done | Reanimated in place, need consistent application |
| Theme/color consistency | Hardcoded hex values scattered everywhere looks unpolished | Low | Not done | Create src/theme/colors.ts, apply consistently |
| Loading/splash state for store hydration | Flash of onboarding on returning users is a visible bug | Low | Not done | Guard routing on Zustand hydration state |

## Differentiators

Features that make interviewers say "this person thinks like a senior engineer" -- not expected but impressive.

| Feature | Value Proposition | Complexity | Status | Notes |
|---------|-------------------|------------|--------|-------|
| Nature Day paywall variant (A/B) | Shows understanding of experimentation, feature flags, product thinking | Low | Partially built | Trigger via debug panel. Demonstrates variant architecture |
| Custom debug panel (DEV-only, tree-shaken) | Shows production awareness -- dev tools that never ship to users | Med | Exists | FPS monitor, state dump, reset, navigation shortcuts |
| FPS monitor via Reanimated useFrameCallback | Shows deep understanding of RN performance measurement (UI thread, not JS thread) | Med | Not built | More accurate than built-in Perf Monitor |
| React Compiler integration | Cutting-edge -- shows awareness of React ecosystem direction | Low | Not done | babel-plugin-react-compiler for auto-memoization |
| Uncontrolled TextInput pattern | Shows performance awareness -- avoids re-render per keystroke | Low | Exists | Ref-based input, commit on Continue |
| GestureDetector for button press | Shows understanding of threading model -- press animation on UI thread, no JS bridge | Low | Exists | Gesture.Tap() + Reanimated |
| Production bundle optimizations | Tree shaking, R8 shrinking, Hermes mmap, iOS asset catalog -- shows deployment maturity | Med | Config exists, not verified | Demonstrates production readiness beyond prototype |
| Custom floating UI (no tab navigator) | Shows ability to break from defaults when UX demands it; full-bleed map is better without tabs | Med | Partially done | Floating icons + bottom bar over map |
| Zoom-dependent species rarity | Creative interaction pattern -- rewards exploration, shows data filtering logic | Low | Exists | Common species at low zoom, rare at high zoom |
| Shared onboarding layout extraction | Shows DRY principles and component architecture thinking | Med | Not done | 7 screens with duplicated styles is a code smell interviewers will notice |
| ESLint crash prevention rules | jsx-no-leaked-render, no-barrel-files -- shows awareness of RN-specific crash vectors | Low | Not done | Demonstrates defensive engineering |
| borderCurve: 'continuous' throughout | Subtle iOS polish that native developers notice immediately | Low | Not done | Smooth corners vs. circular arcs |
| Image prefetching for map markers | Shows awareness of perceived performance beyond raw FPS | Low | Not done | expo-image prefetch for visible region birds |

## Anti-Features

Features to explicitly NOT build. Building these would waste time, add complexity, or signal wrong priorities for an interview demo.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real authentication / backend | Massively increases scope, adds infra complexity, not what interviewers evaluate | Keep all data local. Mention "backend-ready architecture" in conversation |
| Working capture flow (camera integration) | Camera permissions, image processing, storage -- huge scope for no demo value | Keep capture button visual-only. Architecture shows where it would plug in |
| Working logbook with CRUD | Full data management layer is a separate app's worth of work | Visual button only. Mention "would use React Query + optimistic updates" |
| Push notification delivery | Requires backend, APNs/FCM setup, server infrastructure | Notification preferences in onboarding are sufficient to show the pattern |
| Real payment processing (RevenueCat/IAP) | App Store review, sandbox testing, edge cases -- enormous scope | Paywall is visual demo. Mention RevenueCat integration path |
| Bird identification (ML/AI) | Computer vision model integration is a separate project (Merlin-level feature) | Out of scope. Map discovery is the core interaction |
| Offline map tiles | MapKit/Google Maps handle caching natively; custom tile management is complex | Rely on default map caching behavior |
| Social features (follows, likes, comments) | Backend-dependent, multiplayer complexity, not core to the demo | Mock community feed is sufficient |
| Web platform support | React Native web has different perf characteristics, layout issues; dilutes mobile focus | Mobile-only (iOS primary, Android secondary) |
| Automated test suite | Tests are valuable but writing them for a demo prototype trades off against polish time | Architecture should be testable. Mention testing approach in conversation |
| CI/CD pipeline | EAS config is ready; wiring GitHub Actions is DevOps, not mobile craft | Show EAS profiles, mention "CI-ready" |
| Accessibility audit (full) | Important for production but time-intensive; won't be evaluated in most interviews | Add basic accessibilityLabel on key elements; mention VoiceOver plan |
| Dark mode | Doubles design surface area; interviewers won't toggle it | Single theme, well-executed. Mention "theme system supports it" |
| Internationalization (i18n) | String extraction and RTL support is scope creep for a demo | English only. Mention "strings are extractable" if asked |
| Expo Go compatibility | Maps require native modules; Expo Go limitation is well-understood | EAS Dev Client only. This is the correct production pattern anyway |

## Feature Dependencies

```
Onboarding polish ──→ Paywall polish (paywall is final onboarding step)
    │
    ├──→ Theme/colors extraction (apply consistent colors across onboarding first)
    │
    └──→ Shared onboarding layout (reduce duplication before adding more polish)

Store hydration fix ──→ Navigation guard (must solve hydration before routing works correctly)

Marker clustering ──→ Map performance (clustering reduces marker count, enables FPS work)
    │
    └──→ Image prefetching (fewer visible markers = smarter prefetch strategy)

Profile screen ──→ Community screen (profile pattern establishes form sheet convention)

React Compiler ──→ Can be added independently (babel plugin, no code changes needed)

ESLint rules ──→ Should be added early (catches bugs as code is written, not after)

Debug panel enhancements ──→ FPS monitor (builds on existing panel infrastructure)
```

## MVP Recommendation

For a demo that maximizes interview impact with available time:

### Priority 1: Fix What's Broken (Foundation)
1. **Theme/colors extraction** -- hardcoded colors across 13 files is the first thing a code reviewer notices
2. **Store hydration guard** -- flash of onboarding on return visits is a visible bug
3. **ProgressDots off-by-one fix** -- small but sloppy if left
4. **Paywall toggle width fix** -- hardcoded 148px breaks on different devices

### Priority 2: Complete Table Stakes (Credibility)
5. **Marker clustering** -- already in dependencies, makes the map feel real
6. **Profile screen** -- form sheet presentation, reads from onboarding store
7. **Community feed** -- LegendList integration, mock sightings data
8. **Shared onboarding layout** -- reduces 7 duplicated StyleSheets to 1

### Priority 3: Add Differentiators (Impression)
9. **React Compiler** -- single config change, massive talking point
10. **ESLint crash prevention** -- shows defensive engineering mindset
11. **FPS monitor in debug panel** -- shows deep perf understanding
12. **Production bundle verification** -- tree shaking, R8, asset catalog working

### Defer
- **Nature Day paywall variant polish** -- partially exists, low marginal value vs. other work
- **Image prefetching** -- nice optimization but invisible to evaluators
- **Capture/logbook flows** -- explicitly out of scope, visual buttons are sufficient

### What Makes This Demo Win an Interview

The differentiators that matter most are not features -- they are **engineering decisions that demonstrate craft**:

- Uncontrolled TextInput (perf awareness)
- GestureDetector for press animation (threading model understanding)
- `__DEV__` tree-shaking for debug tools (production hygiene)
- React Compiler adoption (ecosystem awareness)
- `borderCurve: 'continuous'` (platform-native polish)
- No tab navigator for full-bleed map (breaking from defaults when justified)
- Zoom-based species rarity (creative data interaction)

These are conversation starters. Each one demonstrates a principle that interviewers test for. The features are the vehicle; the engineering reasoning is the product.

## Sources

- Project PRD (PRD-CLAUDE/01-PRD.md) -- primary source for feature scope and architecture decisions
- Codebase analysis (.planning/codebase/) -- current implementation state and known issues
- Training data knowledge of birding apps (eBird, Merlin Bird ID, Birda, BirdNET, iNaturalist) -- LOW confidence, not verified via web search
- Training data knowledge of mobile engineering interview patterns -- LOW confidence, based on general industry knowledge

---

*Feature landscape research: 2026-03-09*
