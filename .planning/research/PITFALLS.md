# Pitfalls Research

**Domain:** Polish & refinement features for existing Expo/React Native app (Birda v1.1)
**Researched:** 2026-03-09
**Confidence:** HIGH (codebase analysis + official docs + verified community reports)

## Critical Pitfalls

### Pitfall 1: Splash Screen White Flash from Font Loading Race Condition

**What goes wrong:**
A white frame flashes between native splash dismissal and the first JS render. The current `_layout.tsx` gates `SplashScreen.hideAsync()` on Zustand hydration only. Adding Rubik font loading via `useFonts` introduces a second async dependency. If `hideAsync()` fires after hydration but before fonts load, users see system font text for 100-200ms before Rubik renders (Flash of Unstyled Text). Additionally, the splash `backgroundColor` in `app.json` is `#ffffff` while the welcome screen background may differ, creating a visible color seam even without FOUT.

**Why it happens:**
The root layout currently has one async gate (Zustand hydration). Adding font loading creates two independent async operations. Developers typically add `useFonts` and check `fontsLoaded` separately, but forget to unify the readiness check with the existing hydration gate. The splash hides when the first condition resolves, not when both resolve.

**How to avoid:**
1. Embed Rubik at build time via the `expo-font` config plugin: `["expo-font", { "fonts": ["./assets/fonts/Rubik-Light.ttf", "./assets/fonts/Rubik-Regular.ttf", "./assets/fonts/Rubik-Medium.ttf", "./assets/fonts/Rubik-SemiBold.ttf"] }]` in `app.json` plugins. This eliminates runtime font loading entirely -- fonts available synchronously from launch. Requires EAS rebuild.
2. If using runtime loading instead, gate `hideAsync()` on `isHydrated && fontsLoaded` in a single check.
3. Match `splash.backgroundColor` in `app.json` to the welcome screen's actual background color.
4. All Rubik weights used in `typography.ts` (300, 400, 500, 600) must have corresponding font files. Missing a weight causes silent fallback to system font for that weight only -- no error thrown.

**Warning signs:**
- System font visible for a split second on cold launch (test by force-quitting and reopening, NOT fast refresh)
- Different background color flash between splash and first screen
- `useFonts` hook returning `false` after `hideAsync` already fired
- One weight (e.g., Rubik-Light/300) renders in system font while others render correctly

**Phase to address:**
Foundation phase -- must be the very first change. All subsequent screens depend on fonts and splash being correct.

---

### Pitfall 2: Bottom Sheet Gesture Conflicts with MapView Pan and Zoom

**What goes wrong:**
A swipeable bottom sheet (e.g., `@gorhom/bottom-sheet`) and `react-native-maps` MapView both consume pan/swipe gestures. Dragging to dismiss the sheet simultaneously pans the map underneath. Pinch-to-zoom on the map near the sheet edge can trigger the sheet. On Android specifically, the sheet can "stick" at partial positions because gesture arbitration differs from iOS. The existing `GestureHandlerRootView` in `_layout.tsx` makes gesture arbitration global, compounding the problem.

**Why it happens:**
Both MapView and bottom sheets register native gesture recognizers. The gesture handler system cannot disambiguate "user is dragging the sheet" from "user is panning the map" without explicit configuration. This is documented as a known issue (gorhom/react-native-bottom-sheet#1828). The `pointerEvents` configuration on overlay containers and `simultaneousHandlers` setup are almost always missed on first implementation.

**How to avoid:**
1. Set `pointerEvents="box-none"` on the container wrapping the bottom sheet so map touches pass through when not hitting the sheet directly.
2. Wrap scrollable content inside the sheet with `<NativeViewGestureHandler>` from `react-native-gesture-handler`.
3. When the sheet is expanded beyond a threshold, disable map interaction via `scrollEnabled={false}` and `zoomEnabled={false}` on MapView. Re-enable when sheet collapses.
4. Use `enablePanDownToClose` and configure `activeOffsetY={[- 10, 10]}` on the sheet to require a deliberate vertical swipe before capturing the gesture.
5. Test pinch-to-zoom near the sheet edge specifically -- this is a different failure mode than pan conflicts.

**Warning signs:**
- Map scrolls when dragging the sheet handle
- Sheet cannot be dismissed by swiping down while positioned over the map
- Ghost touches on map markers through the sheet backdrop
- Sheet "bounces" between snap points unpredictably on Android

**Phase to address:**
Map drawer phase -- the single hardest integration point in this milestone. Build before other features that depend on overlay positioning.

---

### Pitfall 3: Mosaic Auto-Scroll Animation Memory Pressure and Frame Drops

**What goes wrong:**
A mosaic grid of bird images with continuous auto-scrolling animation causes memory to climb steadily and frame drops to appear within 30 seconds. Each `expo-image` instance decodes and caches a bitmap in memory. With 30-50 tiles rendered simultaneously, decoded bitmaps can consume 300-500MB. Combined with Reanimated `withRepeat(withTiming(...), -1)` for continuous scroll, the UI thread never idles. There is a documented performance regression with Reanimated 4.x on New Architecture (Fabric) for many simultaneous animated components (GitHub issue #8250).

**Why it happens:**
Developers render all mosaic tiles as individual `<Image>` components at full resolution. The animation never pauses, so the GPU composites every frame. On New Architecture, Reanimated's animation driver has known overhead compared to legacy architecture. iOS will kill the app if image memory exceeds ~1GB. Even without a kill, thermal throttling on the device makes subsequent screens feel sluggish.

**How to avoid:**
1. Limit visible tiles to 12-16 images maximum -- enough to fill the screen with the mosaic look without excessive memory.
2. Use `expo-image` (already in deps) with explicit `style={{ width: tileSize, height: tileSize }}` to force decode at display size, not source resolution. Set `contentFit="cover"`.
3. Animate a SINGLE `Animated.View` wrapper with `transform: [{ translateY }]` that moves the entire grid. Do NOT animate individual tiles.
4. Only animate `transform` and `opacity` -- never width, height, or layout properties.
5. Cancel the animation when the screen loses focus: use `useFocusEffect` to call `cancelAnimation(scrollY)` on blur and restart on focus.
6. Set `recyclingKey` on each `expo-image` to enable native image recycling.
7. Consider pre-compositing the mosaic into a single image at build time for the smoothest result with zero runtime cost.

**Warning signs:**
- Memory usage climbing steadily while on welcome screen (check Xcode Memory Gauge)
- Frame rate below 55fps in Perf Monitor
- App killed by iOS after sitting on welcome screen for 60+ seconds
- Device becomes warm on a static screen

**Phase to address:**
Welcome screen phase -- implement with performance testing from the start. Profile with Xcode Instruments before merging.

---

### Pitfall 4: Paywall Dismiss Navigation Stack Corruption

**What goes wrong:**
When the user dismisses the redesigned paywall to go home, the navigation stack retains the paywall and onboarding screens in history. The iOS back swipe gesture returns the user to the paywall instead of staying on the home screen. Alternatively, `router.replace` from within a nested stack only replaces within that stack, not at the root level -- so the `(onboarding)` group remains mounted with its entire screen stack.

**Why it happens:**
Birda uses Expo Router route groups: `(onboarding)` and `(main)`. The root `index.tsx` uses `<Redirect>` based on `completed` state. If paywall dismiss uses `router.push('/(main)')`, the onboarding group stays in the stack. If it uses `router.replace`, it only replaces within the current group context. The `router.dismissAll()` method dismisses screens in the closest stack but does not cross group boundaries. This is a documented limitation (expo/router#495).

**How to avoid:**
1. Set `completed: true` in the Zustand store FIRST, then use `router.replace('/')`. The root `index.tsx` redirect will naturally route to `/(main)` based on the updated state. This leverages the existing redirect pattern.
2. Ensure `completed: true` is persisted to AsyncStorage BEFORE navigation. Since Zustand persist is async, add a small delay or use `onFinishHydration` to confirm persistence.
3. Never use `router.push('/(main)')` from within `(onboarding)` -- this creates a stack where back gesture returns to onboarding.
4. Test the edge case: user force-quits while on the paywall before `completed` persists. On reopen, they should see the paywall again (not a corrupted state).

**Warning signs:**
- Back swipe from home screen shows the paywall
- `useNavigationState` shows onboarding routes still in the stack after dismissal
- Memory stays elevated after leaving onboarding (screens still mounted)
- App reopens to a blank screen after force-quit during paywall transition

**Phase to address:**
Paywall phase -- must be verified as part of implementation. Cannot be deferred.

---

### Pitfall 5: Tab Bar Conflicting with Existing Floating Bottom UI

**What goes wrong:**
The map screen currently has a floating bottom bar with Capture and Logbook buttons (absolute positioned at `bottom: bottom + 20` in `(main)/index.tsx` lines 155-168). Adding an iOS native tab bar via Expo Router `Tabs` layout creates a second bottom navigation layer. The tab bar renders below the safe area while the floating UI renders above it, causing overlap, double tap targets, or the floating UI being hidden behind the tab bar.

**Why it happens:**
The floating bottom bar is `position: absolute` rendered inside the map screen component. A tab bar from Expo Router `Tabs` layout lives outside the screen component in the layout wrapper. These are two completely separate positioning systems. The floating UI uses `useSafeAreaInsets().bottom` for offset but has no awareness of the tab bar height. There is no React hook to get tab bar height from inside a screen rendered by the Tabs layout (the `useBottomTabBarHeight` hook requires `@react-navigation/bottom-tabs` as a direct dependency).

**How to avoid:**
1. This is an architectural decision, not a code fix. Choose ONE approach:
   - **Option A (recommended):** Convert `(main)/_layout.tsx` from `Stack` to `Tabs` layout. Map becomes the default tab. Capture and Logbook become tab screens. Remove the floating bottom bar entirely. The tab bar IS the navigation.
   - **Option B:** Keep the floating bottom bar and do NOT add a native tab bar. Style the floating buttons to look tab-like.
2. If using Option A, the `profile` and `community` screens need to become stack screens nested inside a tab, not siblings of the tab layout.
3. Do NOT try to have both a native tab bar and floating buttons -- it creates cognitive overload and tap target ambiguity.

**Warning signs:**
- Two sets of Capture/Logbook controls visible simultaneously
- Tapping in the bottom area triggers unexpected navigation
- Safe area padding appears doubled on notchless devices

**Phase to address:**
Navigation/tab bar phase -- requires architectural decision before any implementation begins.

---

### Pitfall 6: Design System Token Migration Breaking Existing Screens

**What goes wrong:**
The codebase has screens with hardcoded styles (fontSize, fontWeight, color hex values) that bypass existing `semantic` and `typography` tokens. When token values are adjusted during enforcement, screens using tokens change appearance while screens with hardcoded values stay the same -- creating visual inconsistency across the flow. If token names are renamed, TypeScript errors block the build for every consumer.

**Why it happens:**
The theme system exists (`src/theme/`) with semantic color tokens and typography presets. The map screen uses `semantic.*` extensively, but onboarding screens and paywall likely have inline hex values and raw font sizes. Migration is piecemeal -- some screens get updated, others don't.

**How to avoid:**
1. Audit first: `grep -r '#[0-9A-Fa-f]\{6\}' src/ --include='*.tsx'` to find every hardcoded hex value outside theme files.
2. Never rename existing tokens -- add new ones and create aliases if needed. `textPrimary` keeps working even if a more specific token is introduced.
3. Migrate one route group at a time: all `(onboarding)` screens first, then `(main)`. Verify visually after each group.
4. Separate value changes from migration: change token values in one commit, migrate hardcoded values in a subsequent commit. Never both at once.
5. Replace inline `fontWeight`/`fontSize` pairs with `typography.*` presets. The typography tokens already define all the combinations used in the app.

**Warning signs:**
- Some screens look slightly different after a token value change while others stay the same
- Adjacent screens in the same flow have subtly different heading sizes or colors
- TypeScript errors on imported token names after refactoring theme files

**Phase to address:**
Foundation phase -- before any visual feature work so all subsequent screens build on enforced tokens.

---

### Pitfall 7: Z-Index Layer Wars Between Drawer, Floating UI, and BirdInfoCard

**What goes wrong:**
The map screen already has three overlay layers: floating top bar, floating bottom bar, and `BirdInfoCard`. Adding a full-width swipeable map drawer creates a fourth layer. The drawer appears behind the floating UI, or the BirdInfoCard renders on top of the drawer backdrop, or tap events pass through layers incorrectly.

**Why it happens:**
React Native `zIndex` behaves inconsistently across platforms. On iOS, sibling order in the component tree determines layering by default. On Android, `elevation` affects rendering order independently of tree position. A bottom sheet from `@gorhom/bottom-sheet` may portal its content to a different position in the tree than expected, especially with Expo Router's layout nesting.

**How to avoid:**
1. Render the bottom sheet as the LAST child in the screen component -- after all floating UI elements. Component tree order = visual order on iOS.
2. Use the sheet's `backdropComponent` to create a scrim that covers the floating UI when the sheet is open.
3. Auto-dismiss `BirdInfoCard` when the drawer opens -- they serve overlapping information purposes.
4. On Android, set explicit `elevation` values: map=0, floating UI=2, BirdInfoCard=3, drawer backdrop=4, drawer=5.
5. Test on both platforms -- the layering WILL differ without platform-specific adjustments.

**Warning signs:**
- Floating buttons visible on top of the sheet backdrop
- BirdInfoCard renders above the open drawer
- Tapping through the drawer backdrop triggers map marker selection
- Drawer shadow renders incorrectly on Android

**Phase to address:**
Map drawer phase -- solve together with gesture conflicts (Pitfall 2). These are intertwined problems.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded hex colors in StyleSheet | Faster initial screen creation | Every design tweak requires grep-and-replace across multiple files | Never -- theme tokens exist and are ready to use |
| Inline `fontWeight`/`fontSize` instead of typography tokens | Skip learning token names | Typography changes miss screens, visual drift between flows | Never -- `typography.*` presets already cover all use cases |
| Runtime font loading via `useFonts` instead of build-time embedding | No native rebuild required | Race condition with splash screen, FOUT risk on cold launch | Only during rapid iteration; switch to build-time before demo |
| Animating layout properties (width, height, padding) | Simpler animation code | Frame drops on every frame; layout recalculation blocks UI thread | Never for continuous/repeating animations; acceptable for rare one-shot transitions |
| Single `Animated.View` per mosaic tile | More flexible per-tile animation control | 50 simultaneous animated nodes tank performance on New Arch | Never -- wrap all tiles in one animated container |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `@gorhom/bottom-sheet` + MapView | Mounting sheet as sibling to map without gesture isolation | `pointerEvents="box-none"` on container; `NativeViewGestureHandler` for scrollable content; disable map interaction when sheet expanded |
| `expo-font` + `expo-splash-screen` | Loading fonts with `useFonts` hook but hiding splash before fonts ready | Embed fonts at build time via config plugin (preferred) or gate `hideAsync()` on `fontsLoaded && isHydrated` |
| Expo Router `Tabs` + existing `Stack` in `(main)` | Adding `Tabs` inside existing `Stack`, creating double navigation chrome | Replace `(main)/_layout.tsx` from `Stack` to `Tabs`; do not nest Tabs inside Stack |
| `expo-image` in animated mosaic grid | Decoding images at full source resolution in a dense grid | Set explicit width/height matching display tile size; use `contentFit="cover"` and `recyclingKey` |
| Paywall dismiss + Zustand persist | Navigating to home without setting `completed: true` first | Set `completed: true` in store BEFORE calling `router.replace('/')`, let redirect handle routing |
| Reanimated `withRepeat` on New Architecture | Assuming identical performance to legacy architecture | Profile early; Reanimated 4.x has documented perf regressions on Fabric with many animated nodes |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 30-50 `expo-image` tiles in mosaic at full resolution | Memory climbs past 400MB, app killed on 3GB RAM devices | Limit to 12-16 tiles, decode at display size | Immediately on iPhone SE / older devices |
| `withRepeat(withTiming(...), -1)` continuous mosaic scroll | UI thread never idles, battery drain, thermal throttling within 30s | Cancel animation on screen blur; use `useFocusEffect` cleanup | After ~30 seconds of continuous animation |
| Bottom sheet spring animation + map `animateToRegion` simultaneously | Both fight for gesture control, janky competing animations | Disable map animation while sheet is animating; use `onAnimate` callback | When user interacts with both in quick succession |
| Re-entering map screen replays `FadeIn` entering animations on floating UI | Floating bars fade in again after every push/pop navigation | Use `useSharedValue` + `useEffect` mount-once pattern instead of `entering` prop | Every time user navigates to profile/community and back |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| White flash between splash and welcome screen | App feels unpolished, breaks premium impression on first interaction | Match splash backgroundColor to welcome screen background; gate on all async loads |
| System font visible before Rubik loads (FOUT) | Jarring text reflow as metrics change when font swaps | Embed Rubik at build time via expo-font config plugin -- zero FOUT |
| Paywall back-swipeable from home screen | User accidentally returns to paywall, confusion about where they are | Use state-driven redirect pattern + `router.replace('/')` |
| Bottom sheet overlapping BirdInfoCard | Two information panels fight for attention, unclear what to dismiss | Auto-dismiss BirdInfoCard when drawer opens |
| Tab bar AND floating buttons both visible | Duplicated navigation controls, cognitive overload | Choose one approach: native tab bar OR floating buttons, never both |
| Mosaic animation continues when off-screen | Battery drain, performance degradation on subsequent screens | Cancel animation with `cancelAnimation()` on screen blur |
| Contrast failure on muted text | Text unreadable for users with low vision (`neutral400` on white = 3.0:1, below WCAG AA 4.5:1) | Use `neutral500` minimum for any readable text; reserve `neutral400` for decorative elements only |

## "Looks Done But Isn't" Checklist

- [ ] **Splash screen:** Test on COLD launch (force quit + reopen), not fast refresh. Hot reload completely masks the white flash.
- [ ] **Font weights:** Verify ALL four Rubik weights render correctly (Light 300, Regular 400, Medium 500, SemiBold 600). Missing one weight file causes silent fallback for that weight only.
- [ ] **Bottom sheet gestures:** Test pinch-to-zoom on the map near the sheet edge, not just panning. Pinch conflicts are a different failure mode than pan conflicts.
- [ ] **Mosaic memory:** Leave welcome screen open for 60+ seconds and check memory in Xcode Instruments. Short tests miss the climbing memory pattern.
- [ ] **Paywall dismiss persistence:** Kill the app WHILE on the paywall, before `completed` persists to AsyncStorage. Reopen -- does it resume correctly or show a blank/corrupted screen?
- [ ] **Tab bar on multiple devices:** Test with and without Dynamic Island/notch. Tab bar height differs between device generations; floating UI offset math may only work on one.
- [ ] **Token migration completeness:** Run `grep -r '#[0-9A-Fa-f]\{6\}' src/ --include='*.tsx' | grep -v theme/` -- any results mean hardcoded values still exist.
- [ ] **Map drawer + cluster animation:** Open the drawer while a cluster expansion `animateToRegion` is running. Two competing map animations can deadlock.
- [ ] **Entering animation replay:** Navigate to profile, come back to map. If floating bars fade in again, the entering animation is replaying (current code at lines 139 and 155 of `(main)/index.tsx` uses `FadeIn` which WILL replay).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| White flash on splash | LOW | Update `app.json` splash backgroundColor + gate `hideAsync` on all async loads. Single file change + rebuild. |
| FOUT from runtime font loading | LOW | Switch to build-time font embedding via config plugin. Requires EAS rebuild but minimal code changes. |
| Gesture conflict sheet + map | MEDIUM | Add gesture exclusion zones, restructure component tree, test both platforms. ~2 hours of iteration. |
| Token migration breaks screens | LOW | Revert token value changes, add new tokens as aliases, migrate incrementally per route group. |
| Mosaic memory leak | MEDIUM | Reduce tile count to 12-16, add explicit image sizing. May need to switch to pre-composited snapshot if still leaking. |
| Navigation stack corruption | LOW | Switch from `push` to state-driven `replace('/')`. Single function change + store update ordering. |
| Tab bar + floating UI conflict | MEDIUM | Architectural decision required. Remove one navigation mechanism. ~1 hour to restructure layout. |
| Z-index layer ordering | MEDIUM | Restructure component render order, add platform-specific elevation values. Requires testing on both platforms. |
| Entering animation replay | LOW | Replace `entering={FadeIn}` with mount-once shared value pattern. ~15 minutes per component. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Splash white flash (P1) | Foundation (splash + font setup) | Cold launch on physical device shows zero white frames |
| Font loading FOUT (P1) | Foundation (splash + font setup) | All text renders in Rubik on first visible frame; all 4 weights correct |
| Design token migration (P6) | Foundation (design system enforcement) | `grep -r '#[0-9A-Fa-f]\{6\}' src/ --include='*.tsx' | grep -v theme/` returns zero results |
| Mosaic memory/perf (P3) | Welcome screen phase | Xcode Instruments shows stable memory < 200MB after 60s on welcome screen |
| Bottom sheet + map gestures (P2) | Map drawer phase | Can drag sheet without moving map; can pan/pinch map without triggering sheet |
| Z-index layer ordering (P7) | Map drawer phase | Drawer covers floating UI; backdrop blocks all map interaction |
| Tab bar + floating UI (P5) | Navigation phase | Only one bottom navigation mechanism visible per screen state |
| Paywall dismiss stack (P4) | Paywall phase | Back gesture from home does NOT return to paywall; cold restart after paywall goes to correct screen |
| Entering animation replay | Foundation or Map phase | Navigate to profile and back -- floating bars do NOT animate in again |

## Sources

- [Expo SplashScreen docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [Expo Fonts docs (build-time embedding)](https://docs.expo.dev/develop/user-interface/fonts/)
- [Reanimated Performance guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- [Reanimated New Arch perf regression -- Issue #8250](https://github.com/software-mansion/react-native-reanimated/issues/8250)
- [gorhom/bottom-sheet + react-native-maps -- Issue #1828](https://github.com/gorhom/react-native-bottom-sheet/issues/1828)
- [gorhom/bottom-sheet troubleshooting](https://gorhom.dev/react-native-bottom-sheet/troubleshooting)
- [Expo Router navigation and reset -- Discussion #495](https://github.com/expo/router/discussions/495)
- [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [expo-font useFonts race condition -- Issue #21885](https://github.com/expo/expo/issues/21885)
- [expo-image documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native Performance overview](https://reactnative.dev/docs/performance)
- Codebase analysis: `app/_layout.tsx`, `app/(main)/index.tsx`, `app/index.tsx`, `app/(main)/_layout.tsx`, `src/theme/colors.ts`, `src/theme/typography.ts`, `app.json`, `package.json`

---
*Pitfalls research for: Birda v1.1 Polish & Refinement*
*Researched: 2026-03-09*
