# Phase 5: Welcome Screen & Auth Drawer - Research

**Researched:** 2026-03-10
**Domain:** React Native animations (Reanimated 4), bottom sheet (gorhom), image loading (expo-image)
**Confidence:** HIGH

## Summary

This phase requires two main UI components: (1) an auto-scrolling bird image mosaic with 3 columns at varying speeds, and (2) a bottom sheet drawer for auth options. The project already has `react-native-reanimated` 4.2.1, `react-native-gesture-handler` ~2.30.0, and `expo-image` ~55.0.6 installed. The missing dependency is `@gorhom/bottom-sheet` which needs v5.1.8+ for Reanimated 4 compatibility (v5.2.8 is latest and was already decided in project planning).

The mosaic animation should use Reanimated's `useSharedValue` + `withRepeat` + `withTiming` to drive continuous vertical translation of 3 columns, each rendered as a tall strip of bird images that translates infinitely. The bottom sheet uses `@gorhom/bottom-sheet` with `enableDynamicSizing` for content-fit height and `enablePanDownToClose` for dismissal.

**Primary recommendation:** Use Reanimated `useAnimatedStyle` with `withRepeat(withTiming(...), -1)` for each mosaic column's translateY, and `@gorhom/bottom-sheet` v5.2.8 with dynamic sizing for the auth drawer.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Pinterest-style mixed heights -- images have varying heights across 3 columns for a dynamic, organic feel
- Columns scroll in alternating directions: left up, center down, right up -- each at slightly different speeds
- Hard crop at top and bottom edges (no gradient fade)
- Each image tile has rounded corners (~12px) with small gaps (~4px) between tiles
- Use bird image URLs from `src/data/birds.ts` (20 entries available)
- Mosaic is purely decorative -- no scroll interaction allowed (WELC-01)
- Animation loops continuously
- Split layout: mosaic covers top ~55% of screen, white content card fills bottom ~45%
- No Birda logo on welcome screen (logo already shown on splash screen)
- Content card contains: "Welcome to Birda" heading, description text, two buttons (Create Account + Log in), terms checkbox
- Terms checkbox stays on welcome screen below buttons -- buttons disabled until terms accepted
- Standalone full-screen layout -- does NOT use OnboardingLayout
- Welcome screen remains the onboarding entry point (index.tsx already redirects to welcome.tsx)
- Single BottomSheet component with dynamic content -- title and options change based on which button was tapped
- Login drawer: Apple + Google sign-in options
- Create Account drawer: Apple + Google + Email sign-in options
- Brand-colored icon buttons: Apple button is black, Google is white with border, Email uses primary blue (#1F87FE)
- Each button has brand icon on left + label text
- Compact drawer height -- snaps to fit content (~30-35% of screen)
- Semi-transparent backdrop overlay that dims the mosaic -- tapping backdrop dismisses drawer
- Drawer supports swipe-to-dismiss gesture
- Tapping an auth option: drawer dismisses first, then navigates to next onboarding screen (ai-bird-id)
- No fake loading state or spinner -- clean two-step exit
- Drawer can be freely dismissed (backdrop tap or swipe down) without choosing an option
- No auth method stored in onboarding store -- just navigate forward
- Auth is visual demo only (no real authentication)

### Claude's Discretion
- Exact mosaic column speeds and animation timing
- Image height variation algorithm (how mixed the heights are)
- Drawer animation curve and timing
- Exact spacing within the content card
- Gap between mosaic section and content card (overlap vs clean break)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WELC-01 | Welcome screen content is locked (no scrolling) | Use `pointerEvents="none"` on mosaic container; standalone layout without ScrollView |
| WELC-02 | Welcome screen displays auto-scrolling mosaic with bird images in 3 columns moving at different speeds | Reanimated `withRepeat(withTiming(...), -1)` driving `translateY` on each column at different durations |
| AUTH-01 | Login button opens bottom drawer with Apple and Google sign-in options | `@gorhom/bottom-sheet` with dynamic content; ref.expand() on Login press |
| AUTH-02 | Create account button opens bottom drawer with Apple, Google, and Email options | Same bottom sheet, different content config passed via state |
| AUTH-03 | Selecting any auth option proceeds to next onboarding screen | Dismiss sheet via ref.close(), then router.push('/(onboarding)/ai-bird-id') |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.2.1 | Mosaic column animations | Already installed; `withRepeat` + `withTiming` for infinite scroll on UI thread |
| @gorhom/bottom-sheet | 5.2.8 | Auth drawer bottom sheet | Project decision; v5.1.8+ required for Reanimated 4 compat |
| expo-image | ~55.0.6 | Bird image loading/caching | Already installed; handles remote Wikipedia URLs with caching |
| react-native-gesture-handler | ~2.30.0 | Gesture support for bottom sheet | Already installed; GestureHandlerRootView already wrapping app |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @expo/vector-icons | (bundled) | Apple/Google/Email icons in auth drawer | Brand icons for auth option buttons |
| zustand | ^5.0.11 | termsAccepted state | Already used in onboarding store |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @gorhom/bottom-sheet | react-native Modal | No swipe-to-dismiss, no gesture-driven animation -- decided against |
| expo-image | react-native Image | No caching, no placeholder -- expo-image is already installed |

**Installation:**
```bash
npm install @gorhom/bottom-sheet@^5
```

No additional peer deps needed -- `react-native-reanimated` and `react-native-gesture-handler` are already installed.

## Architecture Patterns

### Welcome Screen Structure
```
app/(onboarding)/welcome.tsx    # Full rewrite -- standalone layout
src/components/welcome/
  BirdMosaic.tsx                # Animated 3-column mosaic
  AuthDrawer.tsx                # Bottom sheet with dynamic auth options
  AuthOptionButton.tsx          # Individual auth option (Apple/Google/Email)
```

### Pattern 1: Infinite Column Animation with Reanimated
**What:** Each mosaic column is a tall vertical strip of bird images (taller than the viewport). A `useSharedValue` drives `translateY` via `withRepeat(withTiming(totalHeight, { duration, easing: Easing.linear }), -1)`. When the animation completes one cycle, it resets to 0 and repeats. The column content is duplicated (rendered twice stacked) so the transition is seamless.
**When to use:** For any continuously scrolling decorative content.
**Example:**
```typescript
// Source: Reanimated docs - withRepeat
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'

function MosaicColumn({ images, direction, duration }: ColumnProps) {
  const translateY = useSharedValue(0)
  const totalHeight = /* sum of all image heights + gaps */

  useEffect(() => {
    // direction: -1 = up, 1 = down
    const target = direction === -1 ? -totalHeight : totalHeight
    translateY.set(
      withRepeat(
        withTiming(target, { duration, easing: Easing.linear }),
        -1,  // infinite repetitions
        false // no reverse
      )
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }))

  return (
    <View style={{ overflow: 'hidden', height: containerHeight }}>
      <Animated.View style={animatedStyle}>
        {/* Render images twice for seamless loop */}
        {images.map(img => <ImageTile key={img.id} ... />)}
        {images.map(img => <ImageTile key={`dup-${img.id}`} ... />)}
      </Animated.View>
    </View>
  )
}
```

### Pattern 2: Bottom Sheet with Dynamic Content
**What:** Single BottomSheet instance controlled via ref. State determines whether "Login" or "Create Account" content is shown. `enableDynamicSizing` auto-calculates height from content.
**When to use:** When a single sheet serves multiple purposes with different content.
**Example:**
```typescript
// Source: gorhom.dev/react-native-bottom-sheet/props
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

function AuthDrawer({ sheetRef, mode, onSelect }: AuthDrawerProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  )

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}                    // starts closed
      enableDynamicSizing           // auto-fit content
      enablePanDownToClose          // swipe to dismiss
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 24, borderCurve: 'continuous' }}
      handleIndicatorStyle={{ backgroundColor: '#D9D9D9', width: 40 }}
    >
      <BottomSheetView style={{ padding: 24 }}>
        <Text style={titleStyle}>
          {mode === 'login' ? 'Log in' : 'Create Account'}
        </Text>
        <AuthOptionButton icon="apple" label="Continue with Apple" ... />
        <AuthOptionButton icon="google" label="Continue with Google" ... />
        {mode === 'signup' ? (
          <AuthOptionButton icon="email" label="Continue with Email" ... />
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  )
}
```

### Pattern 3: Seamless Loop via Content Duplication
**What:** To create a seamless infinite scroll, render the column content twice (stacked vertically). The animation translates by exactly one content-height, so when it resets, the visual is identical. The container uses `overflow: 'hidden'` to crop.
**When to use:** Any infinite scrolling/ticker effect.

### Anti-Patterns to Avoid
- **Using ScrollView/FlatList for mosaic:** The mosaic is NOT interactive. Using scrollable components adds unnecessary complexity. Use plain `Animated.View` with `translateY`.
- **Using `setInterval` for animation:** JS-thread timers cause jank. Always use Reanimated animations on the UI thread.
- **Multiple BottomSheet instances:** Don't create separate sheets for Login and Create Account. Use one sheet with dynamic content.
- **Using `&&` for conditional rendering:** Project convention is ternary with `null` (e.g., `condition ? <Component /> : null`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom sheet drawer | Custom animated View + PanResponder | `@gorhom/bottom-sheet` | Gesture physics, backdrop, snap points, keyboard handling are complex |
| Image caching | Manual fetch + cache | `expo-image` (already installed) | Memory management, disk cache, placeholder transitions |
| Brand icons | Custom SVG components | `@expo/vector-icons` (Ionicons/MaterialCommunityIcons) | Apple logo, mail icon already available |

**Key insight:** The bottom sheet's gesture dismissal, backdrop dimming, and dynamic sizing involve significant interaction physics that `@gorhom/bottom-sheet` handles out of the box. Hand-rolling this would consume the entire phase budget.

## Common Pitfalls

### Pitfall 1: Mosaic Animation Jank from JS Thread
**What goes wrong:** Using `Animated` from react-native (not Reanimated) or JS `setInterval` causes animation stuttering when JS thread is busy.
**Why it happens:** Classic Animated API runs on JS thread. Image loading can block JS thread.
**How to avoid:** Use Reanimated's `useSharedValue` + `useAnimatedStyle` -- runs entirely on UI thread. Use `Easing.linear` for constant-speed scrolling.
**Warning signs:** Visible stutter when navigating or loading images.

### Pitfall 2: Bottom Sheet Not Opening (index=-1 gotcha)
**What goes wrong:** Setting `index={-1}` to start closed is correct, but calling `ref.current?.expand()` may not work if `snapPoints` is not provided and `enableDynamicSizing` is not set.
**Why it happens:** The sheet needs to know what position to expand to.
**How to avoid:** Always pair `enableDynamicSizing={true}` with `index={-1}`. The sheet auto-calculates snap from content. Alternatively, provide explicit `snapPoints={['35%']}`.
**Warning signs:** Sheet does not appear when button is tapped.

### Pitfall 3: Wikipedia Image URLs Failing
**What goes wrong:** Wikipedia CDN may block or throttle requests, or images may be removed/renamed.
**Why it happens:** Using external URLs for bird images that may change.
**How to avoid:** expo-image handles caching well. Add a `placeholder` or fallback background color to each tile so empty tiles don't break the visual. Consider `contentFit="cover"` for consistent tile appearance.
**Warning signs:** Blank tiles in the mosaic.

### Pitfall 4: Seamless Loop Jump
**What goes wrong:** Visible "jump" when the animation resets to start position.
**Why it happens:** Content is not duplicated, so when translateY wraps around, there's a gap.
**How to avoid:** Render the image list twice (stacked). Translate by exactly one list-height. The duplicate fills the gap as the first set scrolls out.
**Warning signs:** Momentary flash or gap between animation cycles.

### Pitfall 5: BottomSheet Reanimated 4 Compatibility
**What goes wrong:** Render errors or crashes with `@gorhom/bottom-sheet` and Reanimated 4.
**Why it happens:** Versions below 5.1.8 are not compatible with Reanimated 4.
**How to avoid:** Install `@gorhom/bottom-sheet@^5` which resolves to 5.2.8 (latest). This version has Reanimated 4 support.
**Warning signs:** "Argument appears to not be a ReactComponent" render error.

### Pitfall 6: Mixed Heights Calculation
**What goes wrong:** If image heights are calculated dynamically after load, the total column height changes mid-animation, breaking the seamless loop.
**Why it happens:** Network images have unknown dimensions until loaded.
**How to avoid:** Pre-define tile heights using a deterministic algorithm (e.g., seeded based on image index). Don't wait for image dimensions from the network. Use fixed heights like `[140, 180, 160, 200, 150]` cycled across tiles.
**Warning signs:** Animation speed changes or jumps after images load.

## Code Examples

### Mosaic Column Height Generation
```typescript
// Deterministic mixed heights for Pinterest-style layout
const TILE_HEIGHTS = [140, 180, 160, 200, 150, 170, 190, 145, 175, 165]

function getTileHeight(index: number): number {
  return TILE_HEIGHTS[index % TILE_HEIGHTS.length]
}
```

### Auth Option Button with Brand Colors
```typescript
// Source: Project design system + CONTEXT.md decisions
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

const AUTH_OPTIONS = {
  apple: {
    icon: 'logo-apple' as const,       // Ionicons
    label: 'Continue with Apple',
    bg: '#000000',
    textColor: '#FFFFFF',
    iconFamily: 'ionicons',
  },
  google: {
    icon: 'google' as const,            // MaterialCommunityIcons
    label: 'Continue with Google',
    bg: '#FFFFFF',
    textColor: '#000000',
    borderColor: '#D9D9D9',
    iconFamily: 'material-community',
  },
  email: {
    icon: 'mail-outline' as const,      // Ionicons
    label: 'Continue with Email',
    bg: '#1F87FE',                       // semantic.actionPrimary
    textColor: '#FFFFFF',
    iconFamily: 'ionicons',
  },
}
```

### Recommended Column Speeds
```typescript
// Claude's discretion: animation timing
const COLUMN_CONFIG = [
  { direction: -1, duration: 25000 }, // Left column: up, 25s per cycle
  { direction: 1,  duration: 30000 }, // Center column: down, 30s per cycle
  { direction: -1, duration: 22000 }, // Right column: up, 22s per cycle (fastest)
]
```

### Bottom Sheet Dismiss-Then-Navigate Pattern
```typescript
// Source: CONTEXT.md - "drawer dismisses first, then navigates"
const handleAuthSelect = useCallback(() => {
  sheetRef.current?.close()
  // Use onChange callback or setTimeout to navigate after dismiss
}, [])

// In BottomSheet onChange:
const handleSheetChange = useCallback((index: number) => {
  if (index === -1 && shouldNavigate.current) {
    shouldNavigate.current = false
    router.push('/(onboarding)/ai-bird-id')
  }
}, [router])
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Animated API (RN core) | Reanimated 4 worklets | 2024-2025 | All animations run on UI thread, no jank |
| @gorhom/bottom-sheet v4 | v5 with Reanimated 4 support | v5.1.8 (Jul 2025) | Required for Reanimated 4 peer dep |
| react-native Image | expo-image | 2023+ | Better caching, blurhash, contentFit |

**Deprecated/outdated:**
- `@gorhom/bottom-sheet` < 5.1.8: Does NOT work with Reanimated 4 -- causes render errors

## Open Questions

1. **Google icon availability in @expo/vector-icons**
   - What we know: MaterialCommunityIcons has a "google" icon. Ionicons may not.
   - What's unclear: Whether the Google icon matches brand guidelines closely enough for a prototype.
   - Recommendation: Use MaterialCommunityIcons "google" icon. For a prototype, exact brand compliance is not required.

2. **expo-image behavior with many simultaneous Wikipedia loads**
   - What we know: 20 bird images loading at once from Wikipedia CDN. expo-image caches aggressively.
   - What's unclear: Whether all 20 images loading simultaneously causes visible lag on first launch.
   - Recommendation: Set `priority="low"` on mosaic images since they are decorative. The content card is the focus.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test infrastructure exists |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WELC-01 | Welcome screen content is locked (no scrolling) | manual-only | Visual verification on device | N/A |
| WELC-02 | Auto-scrolling mosaic with 3 columns at different speeds | manual-only | Visual verification on device | N/A |
| AUTH-01 | Login opens drawer with Apple + Google | manual-only | Visual verification on device | N/A |
| AUTH-02 | Create account opens drawer with Apple + Google + Email | manual-only | Visual verification on device | N/A |
| AUTH-03 | Auth option proceeds to next screen | manual-only | Visual verification on device | N/A |

**Justification for manual-only:** All requirements are visual/animation behaviors on a prototype app with no test infrastructure. Setting up a test framework (Jest + React Native Testing Library) for 5 visual/animation requirements would cost more than the phase itself. These are best verified by running the app on a device/simulator.

### Sampling Rate
- **Per task commit:** Run app in Expo Go / dev client, visually verify
- **Per wave merge:** Full walkthrough of welcome -> auth drawer -> navigation flow
- **Phase gate:** All 5 requirements visually confirmed on device

### Wave 0 Gaps
- No test infrastructure exists and is not needed for this phase (all requirements are visual/animation)
- `npm install @gorhom/bottom-sheet@^5` must run before implementation

## Sources

### Primary (HIGH confidence)
- [react-native-reanimated docs - withRepeat](https://docs.swmansion.com/react-native-reanimated/docs/animations/withRepeat/) - API signature, infinite loop with -1
- [@gorhom/bottom-sheet official docs](https://gorhom.dev/react-native-bottom-sheet/) - Props, usage, dynamic sizing
- [@gorhom/bottom-sheet npm](https://www.npmjs.com/package/@gorhom/bottom-sheet) - v5.2.8 latest
- [Reanimated 4 migration guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/) - Breaking changes

### Secondary (MEDIUM confidence)
- [GitHub Issue #2546](https://github.com/gorhom/react-native-bottom-sheet/issues/2546) - Reanimated 4 compatibility fixed in v5.1.8
- [FreeCodeCamp Reanimated v4 guide](https://www.freecodecamp.org/news/how-to-create-fluid-animations-with-react-native-reanimated-v4/) - Animation patterns

### Tertiary (LOW confidence)
- None -- all findings verified with official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries verified, versions confirmed, compatibility checked
- Architecture: HIGH - patterns derived from official docs and established project conventions
- Pitfalls: HIGH - based on official GitHub issues and documented API behavior

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (stable libraries, 30-day validity)
