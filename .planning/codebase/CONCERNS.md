# Codebase Concerns

**Analysis Date:** 2026-03-06

## Tech Debt

**Hardcoded color values throughout every screen file:**
- Issue: Colors like `#1B4332`, `#6B7280`, `#FAFAF8`, `#E5E7EB`, `#2D6A4F`, `#F0F7F4` are repeated as raw hex strings across all files. There is no theme, design tokens, or shared color constants.
- Files: `app/(onboarding)/welcome.tsx`, `app/(onboarding)/name.tsx`, `app/(onboarding)/location.tsx`, `app/(onboarding)/interests.tsx`, `app/(onboarding)/skill-level.tsx`, `app/(onboarding)/notifications.tsx`, `app/(onboarding)/paywall.tsx`, `app/(onboarding)/summary.tsx`, `app/(main)/index.tsx`, `app/(main)/community.tsx`, `app/(main)/profile.tsx`, `src/components/ui/Button.tsx`, `src/components/onboarding/ProgressDots.tsx`
- Impact: Changing the brand color requires manual find-and-replace across 13+ files. High risk of inconsistency and missed occurrences.
- Fix approach: Create a `src/theme/colors.ts` (and optionally `spacing.ts`, `typography.ts`) exporting named constants. Replace all raw hex values with imports.

**Duplicated StyleSheet patterns across onboarding screens:**
- Issue: Every onboarding screen re-declares nearly identical `container`, `content`, `title`, `actions` styles with the same values. This is copy-paste duplication.
- Files: `app/(onboarding)/welcome.tsx`, `app/(onboarding)/name.tsx`, `app/(onboarding)/location.tsx`, `app/(onboarding)/interests.tsx`, `app/(onboarding)/skill-level.tsx`, `app/(onboarding)/notifications.tsx`, `app/(onboarding)/summary.tsx`
- Impact: Style changes to the onboarding layout require updating 7 files. Bugs from inconsistency are likely (e.g., `content.gap` varies: 24, 16, 32 across screens with no clear reason).
- Fix approach: Extract a shared `OnboardingLayout` component or shared stylesheet in `src/components/onboarding/` that provides the common container, safe area padding, progress dots, and action button area.

**Hardcoded data with no backend/API layer:**
- Issue: All data (birds, community sightings, profile stats, achievements) is hardcoded as constants in component files or `src/data/birds.ts`. There is no API client, no data fetching layer, no loading/error states for data (only an ErrorBoundary on the map screen).
- Files: `src/data/birds.ts`, `app/(main)/community.tsx` (lines 16-23, `SIGHTINGS` constant), `app/(main)/profile.tsx` (lines 6-11, `ACHIEVEMENTS` constant; lines 37-49, hardcoded stats `47`, `12`, `5`)
- Impact: When a backend is introduced, nearly every main screen will need significant refactoring. No data fetching abstractions exist to build upon.
- Fix approach: Create a `src/services/` or `src/api/` layer with async data-fetching functions (even if they return mock data initially). Introduce loading and error states in screens that will fetch data.

**No input validation on onboarding forms:**
- Issue: The name and location fields accept any input including empty strings. The "Continue" button on the name screen calls `setName(nameRef.current)` without checking if the value is empty or whitespace-only. The "Skip" button navigates forward without setting any value, which is correct behavior, but "Continue" should validate.
- Files: `app/(onboarding)/name.tsx` (line 15-17), `app/(onboarding)/location.tsx` (line 15-17)
- Impact: Users can "continue" with empty or whitespace-only values, making the name/location indistinguishable from a skip. The summary screen shows "Not set" only if the value is falsy, but an empty string `""` is falsy so it happens to work -- this is fragile.
- Fix approach: Add validation in `handleContinue` (trim and check length). Disable the Continue button when input is empty.

**Paywall has no actual payment integration:**
- Issue: Both `handleSubscribe` and `handleFree` do exactly the same thing: call `completeOnboarding()` and `replace('/(main)')`. There is no RevenueCat, Stripe, or App Store payment integration.
- Files: `app/(onboarding)/paywall.tsx` (lines 35-41)
- Impact: This is a demo/stub, but if shipped as-is, subscription buttons do nothing monetizable. When payment integration is added, this screen will need significant rework.
- Fix approach: Integrate RevenueCat or expo-in-app-purchases before shipping. Add a subscription status to the Zustand store.

**Notification preferences are not persisted:**
- Issue: The notifications screen uses local `useState` for toggle values. The preferences are never saved to the onboarding store or any persistent storage. Navigating away and back resets them to defaults.
- Files: `app/(onboarding)/notifications.tsx` (lines 18-22)
- Impact: User notification preferences are silently discarded. The screen gives the illusion of collecting preferences but does nothing with them.
- Fix approach: Add notification preferences to `useOnboardingStore` in `src/stores/onboarding.ts` and persist them via the existing Zustand/AsyncStorage middleware.

## Known Bugs

**ProgressDots numbering is inconsistent with flow order:**
- Symptoms: The onboarding flow is: welcome (no dots) -> name (1) -> location (2) -> skill-level (3) -> interests (4) -> notifications (5) -> summary (6) -> paywall (no dots). Total is set to 7 but only 6 screens show dots, meaning step 7 (index 6) is never shown as active. The `current` prop uses the index of the active dot, so step numbers are 0-indexed but the values passed are 1-6, meaning dot index 0 is never active.
- Files: `src/components/onboarding/ProgressDots.tsx` (line 13: `i === current`), `app/(onboarding)/name.tsx` (line 22: `current={1}`), through `app/(onboarding)/summary.tsx` (line 23: `current={6}`)
- Trigger: Navigate through the onboarding flow and observe that the first dot is never highlighted (it would require `current={0}`).
- Workaround: Not user-facing critical, but visually the first dot always appears inactive.

**Paywall toggle indicator has hardcoded width:**
- Symptoms: The animated toggle indicator between Monthly/Annual has `width: 148` hardcoded. On screens with different widths, the indicator does not align properly with the toggle options since `toggleOption` uses `flex: 1`.
- Files: `app/(onboarding)/paywall.tsx` (lines 172-180, `toggleIndicator` style; line 27, `togglePosition.get() * 148`)
- Trigger: View paywall screen on devices with different screen widths (e.g., iPad, small iPhones).
- Workaround: None. The toggle will appear misaligned on non-standard widths.

**Map recalculates visible birds on every region change:**
- Symptoms: `getVisibleBirds(region)` is called on every render, filtering through the entire birds array. The function is invoked via `onRegionChangeComplete` which triggers a state update and re-render of the entire `MapScreen`.
- Files: `app/(main)/index.tsx` (lines 17-25, 84)
- Trigger: Pan or zoom the map -- each region change triggers re-render and re-filter.
- Workaround: Currently only 20 birds, so not noticeable. Will degrade with larger datasets.

## Security Considerations

**`.env` file present:**
- Risk: An `.env` file exists in the project root. Its contents should never be committed to version control or exposed.
- Files: `.env`
- Current mitigation: Unknown if `.gitignore` includes `.env`.
- Recommendations: Verify `.env` is in `.gitignore`. Use `expo-constants` for runtime config. Never import `.env` values directly in client code -- all values in a React Native app are bundled and visible.

**External image URLs loaded without validation:**
- Risk: Bird images are loaded from `upload.wikimedia.org` and the avatar from `api.dicebear.com`. These are third-party URLs that could be changed, become unavailable, or serve unexpected content.
- Files: `src/data/birds.ts`, `app/(main)/community.tsx` (sightings data), `app/(main)/profile.tsx` (line 22, dicebear avatar)
- Current mitigation: `expo-image` handles loading failures gracefully (shows nothing).
- Recommendations: Bundle critical images locally or use a CDN under your control. Add fallback/placeholder images for failed loads.

**No authentication or user identity:**
- Risk: There is no authentication system. The "profile" is based entirely on locally stored onboarding data. There is no user account, no server-side identity.
- Files: `src/stores/onboarding.ts`, `app/(main)/profile.tsx`
- Current mitigation: None needed for demo phase.
- Recommendations: Implement authentication before any server-side features (community, sightings, etc.) are real.

## Performance Bottlenecks

**Map marker re-rendering:**
- Problem: All visible bird markers re-render when `selectedBird` state changes because `visibleBirds.map()` creates new JSX on each render. While `BirdMarker` is memoized with `memo()`, the `onPress` callback `setSelectedBird` is stable (useState setter), so this is partially mitigated.
- Files: `app/(main)/index.tsx` (lines 95-97)
- Cause: `getVisibleBirds` returns a new array on each call (no memoization). The `BirdMarker` `memo` helps but the parent still iterates and reconciles.
- Improvement path: Memoize `visibleBirds` with `useMemo` keyed on `region`. Consider clustering markers for large datasets.

**No image caching strategy:**
- Problem: Bird images are loaded from Wikipedia URLs on every mount. No prefetching or cache warming.
- Files: `src/data/birds.ts`, `app/(main)/index.tsx`, `app/(main)/community.tsx`
- Cause: `expo-image` has built-in disk caching, but there is no prefetch strategy for images that will likely be viewed (e.g., visible markers).
- Improvement path: Use `Image.prefetch()` for birds visible on the current map region.

## Fragile Areas

**Onboarding flow navigation order:**
- Files: `app/(onboarding)/welcome.tsx`, `app/(onboarding)/name.tsx`, `app/(onboarding)/location.tsx`, `app/(onboarding)/skill-level.tsx`, `app/(onboarding)/interests.tsx`, `app/(onboarding)/notifications.tsx`, `app/(onboarding)/summary.tsx`, `app/(onboarding)/paywall.tsx`
- Why fragile: The flow order is defined by hardcoded `push('/(onboarding)/next-screen')` calls in each screen file. There is no centralized flow definition. Adding, removing, or reordering steps requires editing multiple files and updating every `push()` call and every `ProgressDots current` value.
- Safe modification: When changing flow order, update: (1) the `push()` destination in the previous screen, (2) the `ProgressDots current` value in the modified screen, (3) the `ProgressDots current` value in all subsequent screens.
- Test coverage: No tests exist.

**Zustand store hydration race condition:**
- Files: `app/index.tsx`, `src/stores/onboarding.ts`
- Why fragile: The root `app/index.tsx` reads `completed` from the persisted Zustand store to decide routing. If AsyncStorage hydration has not completed when the component mounts, `completed` defaults to `false` and the user is incorrectly sent to onboarding even if they have completed it before. The Zustand persist middleware hydrates asynchronously.
- Safe modification: Use Zustand's `onRehydrateStorage` callback or check `useOnboardingStore.persist.hasHydrated()` before making routing decisions. Show a splash/loading screen until hydration completes.
- Test coverage: No tests exist.

**DevPanel uses `__DEV__` conditional require:**
- Files: `app/_layout.tsx` (line 5)
- Why fragile: `const DevPanel = __DEV__ ? require('@/components/dev/DevPanel').default : null` uses a runtime conditional require. While this works in Metro bundler, it relies on tree-shaking behavior that varies between bundlers. If the production build does not strip this, the DevPanel code ships to production.
- Safe modification: Verify that Metro correctly tree-shakes the `require` in production builds. Alternatively, use a more explicit dev-only plugin or lazy import pattern.
- Test coverage: No tests exist.

## Scaling Limits

**Static bird data array:**
- Current capacity: 20 birds in `src/data/birds.ts`
- Limit: As the array grows, `getVisibleBirds()` linear scan and marker rendering will degrade. At ~1000+ markers, map performance will significantly suffer.
- Scaling path: Move bird data to a backend API with geospatial queries. Implement marker clustering on the client (e.g., `react-native-map-clustering`).

**Single Zustand store for all app state:**
- Current capacity: Only onboarding state (5 fields).
- Limit: As features grow (user preferences, cached data, UI state), a single store will become a monolith with frequent unnecessary re-renders.
- Scaling path: Create separate stores per domain: `src/stores/user.ts`, `src/stores/settings.ts`, `src/stores/sightings.ts`. Zustand handles multiple stores well.

## Dependencies at Risk

**`@legendapp/list` (v2.0.19):**
- Risk: Relatively niche library used only in the community screen. Small community, less battle-tested than `FlashList`.
- Impact: If unmaintained, the community list component breaks with React Native updates.
- Migration plan: Replace with `@shopify/flash-list` which has stronger community support and similar API.

**`react-native-maps` (v1.26.20):**
- Risk: Known to have complex native setup requirements and occasional breaking changes with new React Native versions. The new architecture (`newArchEnabled: true` in `app.json`) may introduce compatibility issues.
- Impact: Map screen is the core feature. Breakage blocks the entire main experience.
- Migration plan: No direct alternative. Pin version carefully and test thoroughly on RN upgrades.

## Missing Critical Features

**No back navigation in onboarding:**
- Problem: `gestureEnabled: false` is set on the onboarding Stack layout, and no back button is provided. Users cannot return to a previous step to correct information.
- Blocks: Users who make a mistake on name/location/skill-level must complete the entire flow and reset via DevPanel.

**No logout or account reset in production UI:**
- Problem: The only way to reset onboarding state is via the DevPanel (dev-only). In production, once `completed: true` is persisted, there is no UI to reset or sign out.
- Blocks: Users cannot restart onboarding or clear their profile data.

**No deep linking configuration:**
- Problem: While `scheme: "birda"` is defined in `app.json`, no actual deep link routes are configured beyond expo-router defaults.
- Blocks: Cannot link users directly to specific screens or handle notification taps.

## Test Coverage Gaps

**Zero test files exist in the project:**
- What's not tested: Every component, every screen, every store, every utility function.
- Files: Entire `src/` and `app/` directories.
- Risk: Any refactoring (especially the duplicated onboarding patterns, flow reordering, or store changes) could introduce regressions with no safety net.
- Priority: High. At minimum, add tests for: (1) `useOnboardingStore` state transitions, (2) onboarding flow navigation, (3) `getVisibleBirds` filtering logic in `app/(main)/index.tsx`.

**No linting or formatting tools configured:**
- What's not tested: Code style consistency is not enforced. No ESLint, no Prettier, no Biome config files exist.
- Files: Project root (missing `.eslintrc`, `.prettierrc`, or equivalent)
- Risk: As contributors increase, style drift will accumulate. No automated checks for common bugs (unused imports, missing keys, etc.).
- Priority: Medium. Add ESLint with `@expo/eslint-config` and Prettier.

---

*Concerns audit: 2026-03-06*
