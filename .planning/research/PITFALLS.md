# Domain Pitfalls

**Domain:** Map-heavy bird watching mobile app (Expo SDK 55 / React Native 0.83 / New Architecture)
**Researched:** 2026-03-09
**Confidence:** MEDIUM-HIGH (based on training data, codebase analysis, and known RN ecosystem patterns; no live web verification available)

## Critical Pitfalls

Mistakes that cause rewrites, production crashes, or major performance regressions.

### Pitfall 1: react-native-map-clustering Wrapping MapView Incorrectly
**What goes wrong:** `react-native-map-clustering` provides a `ClusteredMapView` that replaces the standard `MapView`. Developers often try to add clustering by wrapping existing `<MapView>` with clustering logic or rendering `<Marker>` components outside the `ClusteredMapView` children. The clustering library expects markers as direct children and uses internal cloning to manage them. Mixing custom marker rendering patterns (like the current `visibleBirds.map()`) with clustering's own marker management causes markers to either not cluster or to render duplicates.

**Why it happens:** The current codebase renders markers via `visibleBirds.map()` inside a plain `<MapView>`. Swapping to `ClusteredMapView` requires changing how markers are provided -- they must be direct `<Marker>` children, not wrapped in fragments or conditional containers.

**Consequences:** Markers don't cluster, appear duplicated, or clustering calculations run on every render causing severe frame drops during pan/zoom. On 50+ markers this becomes a visible stutter.

**Prevention:**
- Replace `<MapView>` with `<ClusteredMapView>` from `react-native-map-clustering` and render `<Marker>` components as direct children (no wrapping Views)
- Remove the manual `getVisibleBirds()` zoom-filtering logic -- clustering handles density management. Keep rarity-based filtering as a separate concern if needed, but don't mix it with clustering's own visibility logic
- Set `clusterColor`, `clusterTextColor`, and `clusterFontFamily` for consistent styling
- Use `superClusterRef` to access cluster data if custom cluster rendering is needed

**Detection:** Markers visually overlap instead of forming cluster bubbles. FPS drops below 30 during map pan with 20+ markers.

**Phase relevance:** Map Enhancement phase -- when adding clustering to the existing map screen.

---

### Pitfall 2: Reanimated Shared Values Updated from JS Thread Instead of UI Thread
**What goes wrong:** Animations stutter or skip frames because shared value updates are triggered from React state changes (JS thread) rather than from worklets (UI thread). The current paywall toggle animation uses `togglePosition.set()` inside a regular function (`selectPlan`), which works but creates a JS-to-UI bridge hop. For complex animations (entering animations, gesture-driven animations), this pattern causes visible jank.

**Why it happens:** Reanimated 4.x (the version in this project) still supports `.set()` from JS thread for convenience, but the animation only runs at 60fps when driven entirely from the UI thread. Developers mix `useState` for logic and shared values for animation without realizing the state update triggers a full re-render that competes with the animation.

**Consequences:** Toggle animations, button press effects, and entering animations visually hitch. On lower-end Android devices, animations can drop to 20-30fps.

**Prevention:**
- For gesture-driven animations: use `Gesture.Tap()` with `.onBegin`/`.onEnd` worklets that directly update shared values -- never go through `setState`
- For toggle/switch animations: update the shared value directly in a worklet, defer the React state update with `runOnJS` only for non-visual state (like which plan is selected)
- Only animate `transform` and `opacity` (GPU-composited properties). Never animate `width`, `height`, `padding`, `margin`, `borderRadius`, or `backgroundColor` directly
- Use `useAnimatedStyle` for all animated properties, never inline `style={{ transform: [...] }}`
- The existing `Button` component pattern (GestureDetector + Gesture.Tap) is correct -- replicate this pattern for all interactive animations

**Detection:** Use the planned FPS monitor (Reanimated `useFrameCallback`) to profile animations. Any animation consistently below 55fps on iOS or 50fps on Android indicates a JS thread bottleneck.

**Phase relevance:** Onboarding Polish and Paywall phases -- when adding spring animations and gesture-driven effects.

---

### Pitfall 3: Form Sheet Presentation Not Using Native Modal on iOS
**What goes wrong:** Developers build "form sheet" modals using React Native's `<Modal>` component or custom animated Views instead of using `react-native-screens`' native `formSheet` presentation. The result looks close but misses native behaviors: the pull-to-dismiss gesture, the dimming of the parent screen, proper keyboard avoidance, and the elastic bounce at the top of the sheet.

**Why it happens:** React Native's built-in `<Modal>` doesn't support iOS form sheet presentation natively. Expo Router with `react-native-screens` v4.23+ (which this project has) supports `presentation: 'formSheet'` on Stack screens, but it requires specific configuration that isn't obvious from documentation.

**Consequences:** Profile and Community screens feel non-native. Pull-to-dismiss doesn't work. The sheet doesn't respect safe areas correctly. Keyboard pushes content incorrectly on form inputs.

**Prevention:**
- Use Expo Router's Stack screen options: `presentation: 'formSheet'` in the `(main)` layout for profile and community routes
- Set `sheetCornerRadius`, `sheetExpandsWhenScrolledToEdge`, and `sheetGrabberVisible` for native feel
- For the `(main)` layout, define profile and community as screens with `presentation: 'formSheet'`:
  ```tsx
  <Stack.Screen name="profile" options={{ presentation: 'formSheet', sheetCornerRadius: 20, sheetGrabberVisible: true }} />
  ```
- Do NOT wrap form sheet content in `SafeAreaView` -- the sheet handles its own safe areas
- Test on physical iOS device; iOS Simulator form sheet behavior differs subtly from real hardware

**Detection:** Sheet appears as a full-screen push instead of a floating card. No grabber bar visible at top. No pull-to-dismiss gesture.

**Phase relevance:** Form Sheet / Profile & Community phase.

---

### Pitfall 4: Zustand Store Hydration Race Causing Flash of Onboarding
**What goes wrong:** The app shows the onboarding flow for a split second before redirecting to the main screen for returning users. This happens because `useOnboardingStore.completed` defaults to `false` until AsyncStorage hydration completes, and the root `app/index.tsx` makes a routing decision before hydration finishes.

**Why it happens:** Zustand's `persist` middleware hydrates asynchronously. The component mounts, reads `completed === false` (the default), navigates to onboarding, then hydration completes with `completed === true`, but the user has already seen the onboarding flash.

**Consequences:** Returning users see a flicker of the welcome screen. On slow devices or cold starts, this can last 200-500ms -- enough to be noticeable and feel buggy. This is a known issue flagged in the CONCERNS.md.

**Prevention:**
- Gate routing on `useOnboardingStore.persist.hasHydrated()`:
  ```tsx
  const hasHydrated = useOnboardingStore.persist.hasHydrated()
  if (!hasHydrated) return <SplashScreen /> // or null
  ```
- Use the `onRehydrateStorage` callback to set a loading flag
- Show the splash screen / app icon until hydration completes
- This is a one-line fix but critical for demo polish

**Detection:** Open app after completing onboarding. If the welcome screen flashes briefly before the map appears, hydration is racing.

**Phase relevance:** Should be fixed in the very first phase (Foundation/Polish), before any demo.

---

### Pitfall 5: Production Build Missing Hermes Bytecode Precompilation
**What goes wrong:** The production build ships raw JavaScript instead of Hermes bytecode (`.hbc`). App startup is 2-4x slower because Hermes must parse and compile JS at runtime instead of loading precompiled bytecode.

**Why it happens:** Hermes is enabled by default in Expo SDK 55, but certain Metro configurations or build misconfigurations can prevent bytecode precompilation. The project has `metro.config.js` with experimental imports support -- custom Metro configs are the #1 cause of accidentally bypassing Hermes compilation.

**Consequences:** Cold start time increases from ~800ms to 2-3 seconds. App Store reviewers and demo viewers notice slow launches immediately.

**Prevention:**
- Verify Hermes is producing `.hbc` files by inspecting the build output: `npx react-native-info` in the build
- In `eas.json`, ensure the production profile does NOT set `EXPO_USE_HERMES=0`
- Test with `eas build --platform ios --profile production` and check bundle size -- Hermes bytecode bundles are smaller than raw JS
- After building, verify with: `unzip -l app.ipa | grep -i hbc` (iOS) or inspect the APK for `.hbc` files (Android)
- Do NOT use `eval()`, `new Function()`, or dynamic `require()` with variable paths -- these break Hermes optimization

**Detection:** Production cold start takes >2 seconds. Bundle size is suspiciously large. Hermes doesn't appear in `runtime` in build logs.

**Phase relevance:** Production Optimization phase -- final phase before demo.

## Moderate Pitfalls

### Pitfall 6: Custom Markers with Images Causing Map Jank
**What goes wrong:** Using `<Image>` components inside `<Marker>` custom callouts causes the map to re-render images on every frame during pan/zoom. Each marker with an image creates a native bitmap snapshot -- with 20+ markers, this causes significant frame drops.

**Prevention:**
- Use default map pins or simple View-based markers for the map view (colored dots with initials)
- Show bird images only in the info card (which is already outside the MapView)
- If custom image markers are needed, use `tracksViewChanges={false}` on every `<Marker>` after the initial image load -- this tells the native map to cache the marker bitmap
- Pre-render marker images to a fixed size (32x32 or 44x44) and use local assets, not remote URLs

**Detection:** Map panning feels sluggish with 10+ markers. FPS drops correlate with number of visible markers.

**Phase relevance:** Map Enhancement phase.

---

### Pitfall 7: Entering Animations Replaying on Tab/Route Focus
**What goes wrong:** Reanimated `entering` animations (like `FadeIn`, `FadeInDown`, `SlideInDown`) replay every time a screen regains focus -- not just on first mount. This means navigating from the map to the profile sheet and back causes the floating top bar and bottom bar to fade in again, which looks broken.

**Prevention:**
- Use `entering` animations only for truly one-time elements (onboarding screens that get popped from the stack)
- For persistent UI like the map's floating bars, use `useAnimatedStyle` with a shared value that transitions once on mount and never resets:
  ```tsx
  const mounted = useSharedValue(0)
  useEffect(() => { mounted.value = withTiming(1) }, [])
  ```
- Alternatively, check if the component has already mounted using a ref and skip the entering animation on subsequent focus events
- For the bird info card, `SlideInDown` on mount is correct because it remounts each time a new bird is selected

**Detection:** Navigate away from map and back. If floating buttons animate in again, this pitfall is active. Already present in the current codebase (lines 101, 117 of `index.tsx`).

**Phase relevance:** Map Enhancement and Onboarding Polish phases.

---

### Pitfall 8: react-native-maps New Architecture (Fabric) Compatibility Issues
**What goes wrong:** The project has `newArchEnabled: true` in `app.json`. `react-native-maps` v1.26.x has partial Fabric (New Architecture) support. Some features work, others crash silently or behave differently: custom callouts may not render, `onRegionChangeComplete` may fire with stale data, and clustering libraries that depend on the old architecture's `UIManager` will fail entirely.

**Prevention:**
- Pin `react-native-maps` to the exact version (1.26.20) -- do not upgrade without testing
- Test `react-native-map-clustering` with New Architecture enabled before integrating -- it may need a version that supports Fabric
- If clustering crashes with New Architecture, the fallback is implementing basic clustering manually using `supercluster` directly (the same library `react-native-map-clustering` uses internally)
- Test on both iOS and Android physical devices -- Fabric issues often manifest on only one platform
- Keep `newArchEnabled: true` (it's the future), but have a plan to disable it if map issues are blocking

**Detection:** Map markers don't appear. `onPress` on markers doesn't fire. App crashes on map interaction with a native stack trace mentioning `Fabric` or `UIManager`.

**Phase relevance:** Map Enhancement phase -- verify immediately when adding clustering.

---

### Pitfall 9: Hardcoded Toggle Width Breaking on Different Screen Sizes
**What goes wrong:** The paywall toggle indicator uses `width: 148` and `translateX: togglePosition.get() * 148` (hardcoded pixel values). On SE-sized screens (320pt width), the toggle overflows. On larger screens, the indicator doesn't fill its option area. This is already flagged as a known bug in CONCERNS.md but the fix approach matters.

**Prevention:**
- Use `onLayout` to measure the toggle container width, then calculate indicator width as `(containerWidth - padding) / 2`
- Store the measured width in a shared value so animation calculations stay on the UI thread:
  ```tsx
  const containerWidth = useSharedValue(0)
  const onLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width
  }
  const indicatorStyle = useAnimatedStyle(() => ({
    width: (containerWidth.value - 8) / 2, // 8 = padding
    transform: [{ translateX: withSpring(togglePosition.value * ((containerWidth.value - 8) / 2)) }]
  }))
  ```
- Never hardcode pixel widths for responsive elements -- use `onLayout` + shared values or percentage-based layouts

**Detection:** View paywall on iPhone SE simulator vs. iPhone 15 Pro Max. Toggle indicator misalignment is immediately visible.

**Phase relevance:** Paywall phase.

---

### Pitfall 10: React Compiler Breaking Reanimated Worklets
**What goes wrong:** The project plans to add `babel-plugin-react-compiler` for auto-memoization. React Compiler can transform functions that Reanimated expects to be worklets, breaking the `'worklet'` directive detection. Compiled output may wrap worklet functions in ways that prevent Reanimated's Babel plugin from processing them.

**Prevention:**
- Add Reanimated's Babel plugin BEFORE React Compiler in the Babel config -- plugin order matters
- Use `react-compiler-healthcheck` to verify compatibility before enabling
- Exclude files with heavy Reanimated usage from React Compiler using the `compilationMode: "annotation"` option, or use `'use no memo'` directive in files with worklets
- Test animations thoroughly after enabling React Compiler -- silent breakage is common (animations just stop working without errors)
- Reanimated 4.x has better React Compiler compatibility than 3.x, but edge cases exist

**Detection:** Animations freeze or don't start after enabling React Compiler. Console warnings about worklet compilation failures.

**Phase relevance:** Production Optimization phase -- when adding React Compiler.

## Minor Pitfalls

### Pitfall 11: expo-font Config Plugin Not Loading Custom Fonts
**What goes wrong:** Using `expo-font` as a config plugin (in `app.json` plugins array) for build-time font embedding requires fonts to be in the correct directory and referenced properly. Fonts load at build time but the font family names used in styles don't match the actual PostScript names embedded in the font files.

**Prevention:**
- Place font files in `assets/fonts/`
- In `app.json`, configure the plugin: `["expo-font", { "fonts": ["./assets/fonts/Inter-Regular.ttf", ...] }]`
- Use the exact PostScript name (not filename) in `fontFamily` styles. Check PostScript name by opening the `.ttf` file on macOS Font Book
- Test on a fresh build (not just a reload) -- config plugin fonts require a native rebuild

**Detection:** Text renders in system font instead of custom font. No error thrown -- it silently falls back.

**Phase relevance:** Foundation/Polish phase.

---

### Pitfall 12: LegendList Missing `estimatedItemSize` Causing Blank Frames
**What goes wrong:** `@legendapp/list` (LegendList) requires `estimatedItemSize` for proper virtualization. Without it, initial render shows blank space where items should be, then items pop in after a frame or two.

**Prevention:**
- Always provide `estimatedItemSize` matching the approximate height of list items
- For the community feed, measure one item's height and use that value
- If items have variable heights, use the average height as the estimate

**Detection:** Community feed shows blank white space that fills in after scrolling. Items "pop in" visually.

**Phase relevance:** Community Form Sheet phase.

---

### Pitfall 13: boxShadow Syntax Not Supported on Android < API 28
**What goes wrong:** The codebase uses the CSS-like `boxShadow` property (e.g., `boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'`). This is a React Native 0.83+ feature but has inconsistent support across Android versions. On older Android devices, shadows simply don't render.

**Prevention:**
- For this demo (iOS primary), this is acceptable since iOS renders shadows correctly
- For Android compatibility, add `elevation` as a fallback alongside `boxShadow`
- Test on Android API 28+ minimum for `boxShadow` support

**Detection:** UI elements appear "flat" on Android devices without visible shadows.

**Phase relevance:** Production Optimization / Android QA phase.

---

### Pitfall 14: Map `showsUserLocation` Without Location Permission Handling
**What goes wrong:** The current `MapView` has `showsUserLocation` enabled but there's no location permission request flow. On iOS 17+, the app will show a system permission dialog the first time the map loads. If denied, the map still works but the blue dot doesn't appear -- no error handling exists for this case.

**Prevention:**
- Add `expo-location` and request permission explicitly before showing `showsUserLocation`
- Handle the "denied" case gracefully (hide user location dot, no error)
- For the demo, consider removing `showsUserLocation` entirely if location isn't part of the core demo flow -- it adds a permission prompt that interrupts the demo experience
- If keeping it, add `NSLocationWhenInUseUsageDescription` to `app.json` under `ios.infoPlist` with a clear message

**Detection:** iOS shows a jarring system permission dialog immediately when entering the map screen, before the user understands why location is needed.

**Phase relevance:** Map Enhancement phase -- decide early whether to keep or remove `showsUserLocation`.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Foundation / Polish | Zustand hydration race (Pitfall 4) | Fix before anything else -- gate routing on `hasHydrated()` |
| Foundation / Polish | Custom font loading (Pitfall 11) | Verify PostScript names match style declarations; rebuild native |
| Onboarding Polish | Entering animations replaying (Pitfall 7) | Use mount-once pattern for persistent UI, `entering` only for push screens |
| Paywall | Hardcoded toggle width (Pitfall 9) | Use `onLayout` + shared values for responsive indicator |
| Paywall | JS thread animation stutters (Pitfall 2) | Drive toggle animation from worklets, defer state with `runOnJS` |
| Map Enhancement | Clustering integration (Pitfall 1) | Replace MapView wholesale; don't mix manual filtering with clustering |
| Map Enhancement | New Architecture + maps (Pitfall 8) | Test clustering lib with Fabric before committing to it |
| Map Enhancement | Custom image markers (Pitfall 6) | Use `tracksViewChanges={false}` or simple markers |
| Map Enhancement | Location permission UX (Pitfall 14) | Decide on `showsUserLocation` before demo |
| Form Sheets | Non-native modal implementation (Pitfall 3) | Use `presentation: 'formSheet'` on Stack screen options |
| Community Feed | LegendList blank frames (Pitfall 12) | Provide `estimatedItemSize` |
| Production Optimization | React Compiler + Reanimated conflict (Pitfall 10) | Babel plugin order; exclude worklet-heavy files |
| Production Optimization | Missing Hermes bytecode (Pitfall 5) | Verify `.hbc` in build output; check Metro config |
| Production Optimization | Android shadow fallback (Pitfall 13) | Add `elevation` alongside `boxShadow` |

## Existing Codebase Issues That Amplify Pitfalls

These are not new pitfalls but existing patterns from CONCERNS.md that interact with the pitfalls above:

1. **No memoization of `visibleBirds`** -- when clustering is added, this unmemoized computation will fight with the clustering library's own calculations, causing double work on every region change
2. **Hardcoded colors everywhere** -- when building the paywall variants and form sheets, the lack of theme tokens means new screens will continue the pattern, making future theming even harder
3. **No centralized onboarding flow definition** -- adding entering animations to each screen means touching every file; a shared layout would let animations be defined once
4. **Zero test coverage** -- every pitfall mitigation is unverifiable without manual testing on physical devices

## Sources

- Codebase analysis: `app/(main)/index.tsx`, `app/(onboarding)/paywall.tsx`, `app.json`, `package.json`, `app/_layout.tsx`
- Known issues: `.planning/codebase/CONCERNS.md` (2026-03-06 audit)
- Project spec: `.planning/PROJECT.md`
- React Native Maps documentation and known issues (training data, MEDIUM confidence)
- Reanimated 4.x worklet/compiler patterns (training data, MEDIUM confidence)
- react-native-screens form sheet presentation (training data, MEDIUM confidence)
- Expo SDK 55 / React Native 0.83 New Architecture compatibility (training data, MEDIUM confidence)

---

*Pitfalls audit: 2026-03-09*
