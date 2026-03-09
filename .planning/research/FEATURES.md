# Feature Research

**Domain:** Mobile bird watching app -- polish and refinement milestone (v1.1)
**Researched:** 2026-03-09
**Confidence:** HIGH (verified against official Expo/RN docs, library repos, and production patterns)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in a polished production app. Missing these = prototype feeling.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Splash screen with branded logo | Every shipped iOS app has one; the current splash is default Expo placeholder. Users see it on every cold launch. | LOW | Expo SDK 55 `expo-splash-screen` handles this natively. Configure in `app.json` splash field with logo asset. Use `SplashScreen.setOptions({ duration: 400, fade: true })` for smooth fade transition. Already using `preventAutoHideAsync()` / `hideAsync()` pattern in `_layout.tsx` -- just needs the asset and fade config. |
| Design system enforcement (Rubik font, color tokens) | Inconsistent fonts/colors signal "unfinished." Every text element should use Rubik; every CTA should use the primary blue. | LOW | Theme tokens exist in `src/theme/`. Enforcement is a systematic sweep, not new architecture. `expo-font` already in plugins. Load Rubik via `useFonts` or asset linking, apply via `fontFamily` across all `Text` styles. |
| Fixed bottom CTA padding (safe area + consistent insets) | Bottom-pinned buttons that overlap the home indicator or sit at inconsistent positions break perceived quality on notched iPhones. | LOW | Standardize to 24px bottom padding + safe area inset on all footer CTAs. The `OnboardingLayout` already handles safe area internally -- verify the footer slot respects it consistently. |
| Auth options (Apple, Google, Email) | Users expect social sign-in on iOS. Apple Sign-In is required by App Store guidelines if you offer any third-party login. | MEDIUM | For a prototype: visual-only bottom drawer with branded buttons (no actual auth). Use `react-native-true-sheet` (v3.9.9) for the native bottom sheet -- it is built for Fabric/New Architecture and works with Expo SDK 54+. Do NOT use `@gorhom/bottom-sheet` -- it has known Fabric compatibility issues (laggy behavior, `unstable_getBoundingClientRect` crashes on RN 0.82+). |
| Paywall with clear pricing and value | Users encountering a paywall expect to immediately understand what they get and what it costs. Current toggle-based dual-plan layout is being replaced. | MEDIUM | Single redesigned paywall: hero image at top, benefit bullets, clear pricing section, primary CTA ("Start Free Trial"), secondary dismiss ("Continue with free plan"). Dismiss navigates to home, not next onboarding step. See detailed pattern notes in Differentiators section. |
| Onboarding layout consistency (dots, spacing, overflow) | Visible bugs in spacing/overflow undermine the "production-grade" claim. Progress dots should be styled per the design system. | LOW | Systematic fix pass on `OnboardingLayout` and individual screens. Audit padding, gap values against `spacing` tokens. Fix any content overflow on smaller screens (iPhone SE). |

### Differentiators (Competitive Advantage)

Features that elevate the prototype from "functional" to "impressive demo."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Auto-scrolling mosaic/ticker on welcome screen | Creates immediate visual impact -- the "wow" moment when the app launches. The welcome screen currently shows a blank colored rectangle (`semantic.bgTinted`). A mosaic of bird images auto-scrolling in columns (3-4 columns, alternating up/down directions, different speeds) creates depth and movement without user interaction. | MEDIUM | **Pattern:** 3-4 vertical columns of bird images, each column auto-scrolling vertically at different speeds (20-40px/sec). Alternate direction per column (col 1 up, col 2 down, col 3 up). Use Reanimated `withRepeat(withTiming(...))` on `translateY` for each column. Duplicate the image list to create seamless loop. All transforms are GPU-only (translateY + opacity) so 60fps is guaranteed. No external library needed -- pure Reanimated `useSharedValue` + `useAnimatedStyle`. Slight rotation (1-2deg) per column adds parallax depth. |
| Native bottom sheet for auth drawer | Using a truly native sheet (not a JS-animated view) signals platform-native quality. The sheet feels like iOS, not like a web modal painted to look like iOS. | MEDIUM | `react-native-true-sheet` (v3.9.9, MIT license) is the correct choice. It requires New Architecture (which this project uses), has first-class Reanimated integration, native accessibility, built-in keyboard handling. Snap points at ~40% screen height for the auth options list. Swipe-to-dismiss is built in. Grabber handle visible. Sheet content: "Log In or Create Account" heading, Apple button (black, full-width), Google button (white with border), Email button (outline), Terms link at bottom. |
| Redesigned single paywall (hero + bullets + pricing) | The current dual-plan toggle paywall is functional but visually underwhelming. A hero-image-driven single paywall with social proof converts better and demonstrates design craft. | MEDIUM | **Production paywall anatomy:** (1) Hero image or illustration, edge-to-edge, ~35% screen height. (2) Headline with personalization (existing: uses `name` from store). (3) 3-4 benefit bullets with checkmark icons. (4) Pricing card: show annual plan prominently with per-month breakdown ("$3.33/month, billed $39.99/year"), optional "Save 33%" badge. (5) Primary CTA at bottom with safe-area padding. (6) Subtle "Restore Purchases" and "Continue free" links below CTA. (7) X/close button top-right that dismisses to home. **Key change from current:** paywall dismiss goes to `/(main)` not to next onboarding step. |
| Full-width swipeable map drawer | When tapping a bird marker, a full-width bottom drawer sliding up (instead of the current floating card) feels more native and allows richer content (larger image, more details, action buttons). | HIGH | Use `react-native-true-sheet` for this too -- same library as auth drawer, consistent API. Sheet renders above all content (native z-index, no `position: absolute` hacks). Snap points at ~45% and ~85% for peek/full states. Content: large bird image, name, species, rarity badge, description, "Log Sighting" button. Swipe down to dismiss. This replaces the current `BirdInfoCard` component which uses `position: absolute` with `bottom: 100` and `SlideInDown`. The sheet approach handles edge-to-edge width, safe area, and gesture conflicts with the map automatically. |
| Restyled bottom bar (native-feeling) | The current floating bottom bar (two pill buttons) works but doesn't feel like standard iOS navigation. A restyled bar with icon-above-label layout and active states would feel more polished. | MEDIUM | **Recommendation: Do NOT use Expo Router Native Tabs.** It is alpha status (API subject to change), has known layout issues, max 5 tabs on Android, and would require restructuring the entire `(main)` route group -- a significant refactor for minimal gain. **Instead:** Restyle the existing floating bottom bar: icon-above-label layout, active state color using `actionPrimary`, subtle top border or shadow, consistent safe-area bottom padding. This preserves the full-bleed map design decision (PROJECT.md explicitly chose floating UI over tab bar). |
| Debug button repositioned | Moving the debug button from its current position to the top of the screen prevents it from overlapping with bottom CTAs and sheets. | LOW | Reposition `DevPanel` mount point. Trivial layout change, no architectural impact. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| `@gorhom/bottom-sheet` for drawers | Most popular RN bottom sheet library; many tutorials reference it | Known Fabric/New Architecture incompatibility: `unstable_getBoundingClientRect` TypeError on RN 0.82+, laggy behavior with Fabric, modal conflicts. The Fabric support issue was closed due to inactivity. This project uses New Arch + RN 0.83. | Use `@lodev09/react-native-true-sheet` (v3.9.9) -- built from ground up for Fabric, native C++ bridge, zero JS hacks. |
| Expo Router Native Tabs (`NativeTabs`) | Official Expo component, platform-native tab bar | Alpha status, API subject to change, max 5 tabs on Android, known layout size bugs with `formSheet`, requires restructuring route groups. PROJECT.md explicitly decided against tab nav for the map screen. | Keep custom floating bottom bar, restyle to feel more polished. Add icon-above-label layout, active color states, safe-area padding. |
| Expo Router `formSheet` for bottom sheets | Built into Expo Router, no extra dependency | Known bug: content doesn't layout at correct size when using detents (GitHub issue #35616). Not reliable for production-quality sheets. | Use `react-native-true-sheet` for reliable native sheets with proper snap points. |
| Lottie/Rive animated splash screen | Looks impressive, branded animations | Adds a native dependency for a single use case, increases cold launch time, complicates the splash-to-app transition. Expo docs recommend hiding splash ASAP. | Use Expo's built-in `SplashScreen.setOptions({ fade: true, duration: 400 })` for a clean fade. Put the "wow" animation on the welcome screen mosaic instead. |
| Actual auth integration (Firebase/Supabase) | "Real" sign-in flow | Out of scope per PROJECT.md ("Real authentication or backend -- prototype uses local data only"). Adding auth adds complexity, requires backend, and is irrelevant for an interview demo. | Visual-only auth buttons in bottom sheet. Tapping any option navigates to onboarding. The pattern demonstrates the UX without the backend. |
| Multiple paywall variants (A/B testing) | Optimize conversion | Premature for a prototype. The existing Nature Day variant mechanism already demonstrates the pattern. Multiple paywalls multiply design/testing surface. | Single polished paywall. The discount variant mechanism can be showcased via the debug panel if needed. |

## Feature Dependencies

```
[Splash Screen]
    (no dependencies -- standalone config change)

[Design System Enforcement]
    (no dependencies -- sweep existing code)

[Welcome Screen Mosaic]
    └──requires──> [Design System Enforcement] (needs Rubik font loaded, color tokens applied)
    └──requires──> [Bird Image Assets] (needs images for the mosaic columns)

[Auth Bottom Drawer]
    └──requires──> [react-native-true-sheet installed]
    └──requires──> [Welcome Screen Redesign] (drawer opens from welcome screen buttons)

[Paywall Redesign]
    └──requires──> [Design System Enforcement] (consistent typography/colors)

[Bottom Bar Restyle]
    └──requires──> [Design System Enforcement] (active states use token colors)

[Map Drawer (Bird Detail Sheet)]
    └──requires──> [react-native-true-sheet installed]
    └──enhances──> [Map Screen] (replaces BirdInfoCard)

[Onboarding Layout Fixes]
    └──requires──> [Design System Enforcement] (spacing tokens, dots styling)

[Paywall Dismiss] ──conflicts──> [Current Onboarding Flow]
    (paywall must dismiss to /(main), not push to /reminders)
```

### Dependency Notes

- **Auth Drawer and Map Drawer both require `react-native-true-sheet`:** Install once, use for both. This is a single `npx expo install @lodev09/react-native-true-sheet` command. The library is Expo-compatible out of the box with SDK 54+.
- **Welcome Screen Mosaic requires bird images:** The mosaic needs ~12-20 bird photos. These can be the same images from `src/data/birds` (already referenced via URLs). Consider bundling a subset as local assets for guaranteed offline loading during onboarding.
- **Design System Enforcement is a prerequisite for most visual features:** Do this first. It establishes the Rubik font and verified color tokens that every subsequent feature builds on.
- **Paywall dismiss-to-home changes navigation flow:** Currently the paywall pushes to `/(onboarding)/reminders`. The redesign should navigate to `/(main)` instead (via `router.replace`), which changes the onboarding completion logic in the Zustand store. The `setCompleted(true)` call must happen before navigation.

## MVP Definition

### Launch With (v1.1 Core)

Features that must ship to call v1.1 "done."

- [ ] Splash screen with Birda logo and fade transition -- first impression, takes 30 minutes
- [ ] Design system enforcement (Rubik font, color tokens on all CTAs) -- foundational, unblocks everything else
- [ ] Onboarding layout fixes (dots, spacing, overflow) -- removes visible bugs
- [ ] Welcome screen mosaic animation -- the "hero" feature of this milestone, biggest visual impact
- [ ] Auth bottom drawer on welcome screen -- demonstrates native-feeling interaction pattern
- [ ] Redesigned single paywall -- replaces the current toggle-based layout
- [ ] Fixed bottom CTA padding standardized -- consistency across all screens

### Add After Core (v1.1 Polish)

Features to add once core is stable.

- [ ] Full-width map drawer (bird detail sheet) -- replaces `BirdInfoCard`, highest complexity
- [ ] Bottom bar restyle (icon-above-label, active states) -- visual refinement
- [ ] Debug button repositioned to top -- minor layout tweak

### Future Consideration (v2+)

Features to defer.

- [ ] Actual auth integration -- requires backend, out of scope for prototype
- [ ] Payment processing -- paywall is visual demo only
- [ ] Tab navigator refactor -- only if the app grows beyond map + capture + logbook

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Splash screen (logo + fade) | HIGH | LOW | P1 |
| Design system enforcement | HIGH | LOW | P1 |
| Onboarding layout fixes | HIGH | LOW | P1 |
| Welcome screen mosaic | HIGH | MEDIUM | P1 |
| Auth bottom drawer | HIGH | MEDIUM | P1 |
| Paywall redesign | HIGH | MEDIUM | P1 |
| Bottom CTA padding | MEDIUM | LOW | P1 |
| Map bird detail sheet | HIGH | HIGH | P2 |
| Bottom bar restyle | MEDIUM | LOW | P2 |
| Debug button reposition | LOW | LOW | P2 |

**Priority key:**
- P1: Must have for v1.1 launch -- these define "polish and refinement"
- P2: Should have, add when P1 is stable
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Birda (birda.org) | Merlin (Cornell Lab) | eBird | Our Approach |
|---------|-------------------|----------------------|-------|--------------|
| Splash screen | Branded logo, clean fade | Bird illustration, branded | Cornell Lab logo | Logo on white, 400ms fade -- matches Birda's clean aesthetic |
| Welcome/onboarding | Photo grid background, Create Account / Log In | Bird ID wizard upfront | Minimal, straight to map | Auto-scrolling mosaic (inspired by Birda's photo grid) + auth drawer |
| Auth presentation | Full-screen with social options | Apple/Google at bottom | Email-focused | Bottom sheet drawer -- more native-feeling than full-screen |
| Paywall | Inline in onboarding, benefit-focused | Free app (no paywall) | Free with premium features | Hero image + bullets + pricing card -- standard subscription pattern |
| Map detail view | Bottom sheet with photo + details | Card overlay | Minimal marker info | Full-width native sheet with snap points -- matches Apple Maps pattern |
| Bottom navigation | Tab bar (Explore, Log, ID, Feed, More) | Bottom tabs | Bottom tabs | Restyled floating bar -- honors full-bleed map decision |

## Implementation Notes

### react-native-true-sheet Integration

```bash
npx expo install @lodev09/react-native-true-sheet
```

No config plugin needed. Works with Expo SDK 54+ and New Architecture out of the box. Key API:

```typescript
import { TrueSheet } from "@lodev09/react-native-true-sheet"

// In component:
<TrueSheet
  ref={sheetRef}
  sizes={["auto", "large"]}  // snap points
  grabber={true}              // iOS grabber handle
  cornerRadius={24}
>
  {/* Sheet content */}
</TrueSheet>

// Imperative control:
sheetRef.current?.present()
sheetRef.current?.dismiss()
```

### Mosaic Animation Pattern

The welcome screen mosaic uses 3-4 `Animated.View` columns, each containing a duplicated list of bird images. Each column uses `withRepeat(withTiming(translateY, { duration: 20000-40000 }), -1, false)` for continuous upward or downward scrolling. Different durations per column create the parallax/depth effect. No external library needed -- pure Reanimated `useSharedValue` + `useAnimatedStyle`.

Key performance considerations:
- Only animate `transform` (translateY) -- GPU-composited, no layout recalculation
- Use `expo-image` with `contentFit="cover"` for the bird photos
- Set `pointerEvents="none"` on the mosaic container so touches pass through to buttons below
- Wrap in `overflow: "hidden"` container to clip at screen edges
- Duplicate image list so when column scrolls past original set, the duplicate provides seamless continuity

### Splash Screen Configuration

Two changes needed:
1. Replace `assets/splash-icon.png` with proper Birda logo asset (centered, ~200px wide on a white background)
2. Add `SplashScreen.setOptions({ duration: 400, fade: true })` in `_layout.tsx` before the `hideAsync()` call

The `fade: true` option is iOS-only but provides a professional cross-dissolve from splash to app content. Android uses the system default transition. Test on release builds -- dev builds show the Expo dev client icon during splash.

### Paywall Dismiss Flow Change

Current flow: `paywall.tsx` -> `push('/(onboarding)/reminders')` -> ... -> `/(main)`
New flow: "Continue free" -> `router.replace('/(main)')` + `setCompleted(true)` in store
New flow: "Start Free Trial" -> same destination (no actual payment processing)

This means the paywall becomes the final onboarding screen. Subsequent screens (reminders, mailing-list) can be removed from the onboarding flow or moved behind the paywall CTA as post-signup steps.

## Sources

- [Expo SplashScreen API docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/) -- setOptions, fade, duration config
- [Expo Splash Screen guide](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/) -- asset sizing, best practices
- [Expo Router Native Tabs docs](https://docs.expo.dev/router/advanced/native-tabs/) -- alpha status, limitations confirmed
- [Expo Router Modals docs](https://docs.expo.dev/router/advanced/modals/) -- formSheet configuration
- [react-native-true-sheet GitHub](https://github.com/lodev09/react-native-true-sheet) -- v3.9.9, Fabric-native, Expo SDK 54+ confirmed
- [react-native-true-sheet v3.0 release](https://sheet.lodev09.com/blog/release-3-0) -- New Architecture rebuild details
- [gorhom/bottom-sheet Fabric issues](https://github.com/gorhom/react-native-bottom-sheet/issues/1944) -- New Arch compatibility problems
- [gorhom/bottom-sheet RN 0.82 crash](https://github.com/gorhom/react-native-bottom-sheet/issues/2549) -- `unstable_getBoundingClientRect` TypeError
- [formSheet layout bug](https://github.com/expo/expo/issues/35616) -- content sizing issues with detents
- [Apphud paywall design guide](https://apphud.com/blog/design-high-converting-subscription-app-paywalls) -- pricing layout patterns
- [RevenueCat paywall guide](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/) -- social proof, CTA placement
- [Adapty paywall library](https://adapty.io/paywall-library/) -- production paywall examples

---
*Feature research for: Birda v1.1 Polish & Refinement*
*Researched: 2026-03-09*
