# Phase 8: Auth Fix & UI Polish - Research

**Researched:** 2026-03-10
**Domain:** React Native UI — bottom sheet backdrop, onboarding layout alignment, keyboard avoidance, tab bar styling, Expo Router back button, map marker hit area, achievement list layout
**Confidence:** HIGH (all findings sourced from direct codebase inspection + established project patterns)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Auth drawer (Welcome screen): Login drawer KEEPS Email button — both Login and Signup show identical options (Apple, Google, Email). Only the title text differs ("Log in" vs "Create Account"). Current code already implements this correctly — AUTH-01 is a no-op (requirement updated, not code).
- Backdrop overlay must cover the FULL screen including the bird mosaic section at the top — currently the overlay stops below the mosaic. Backdrop stays at 50% opacity black, just needs to render above the mosaic gradient and scrolling columns.
- Welcome screen is the golden reference for text positioning. All onboarding screens (ai-bird-id, name, location, stay-in-the-loop, mailing-list, etc.) must match the welcome screen's title and description X/Y positioning. Text is center-aligned on both welcome and onboarding screens. This is an OnboardingLayout fix — propagates to all screens using it.
- Name input screen: Avatar, title, and input should align to the TOP (right below progress dots), not vertically centered — only this screen gets top-alignment. Other onboarding screens keep their current centered vertical layout. When keyboard opens, the view must push content up to keep the input visible.
- Paywall tweaks: Social proof boxes — keep current layout (flex: 1, height: 72) but prepare for Image component swap. Unlock pill icon: change from `lock-open-outline` to `ribbon`. Nature Day banner: remove the leaf icon AND the 🌿 emoji — just text: "Nature Day Special — **10% off**".
- Map marker tap area: add a larger invisible hit area (minimum 44x44px) around each marker while keeping the visual marker the same size. Bird info drawer is already working correctly (full-width, above tab bar) — NAV-03 and NAV-04 are already resolved.
- Tab bar active color: change from `neutral700` to primary blue (`#1F87FE` / `actionPrimary`).
- Map header icons (notification, profile): style them consistently with the inactive tab bar items (same `neutral400` color, matching weight).
- Back button on Profile and Community screens: remove "(main)" text label — show only the back chevron icon, no text.
- Header separator line: remove the border/line between the header bar and content area on both Profile and Community screens.
- Profile achievements: change from column/grid layout to a vertical list of rows. Add 2-3 grayed-out/locked dummy achievements. Earned achievements display in full color, locked ones appear dimmed/grayed.

### Claude's Discretion

- Exact backdrop z-index implementation for auth drawer (portal vs z-order approach)
- Keyboard avoidance implementation details for name screen (KeyboardAvoidingView vs ScrollView)
- Social proof box image component setup (expo-image configuration)
- Locked achievement visual treatment (opacity level, lock icon vs just dimmed)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope (all items are UI polish within existing screens)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | Login button opens bottom drawer with Apple and Google sign-in options | Code inspection confirms current implementation already has all three options (Apple, Google, Email) for both modes — requirement text was updated to match current code; no code change needed. Backdrop z-order fix IS needed. |
| PAYW-06 | Paywall shows social proof (400+ happy birders, 4.7 stars) | Current `socialBox` views are empty placeholder `View`s with `semantic.bgTinted` background. Need to add text content ("400+ happy birders", "4.7 stars") directly into the boxes or swap for an `expo-image` Image component when assets arrive. |
| NAV-03 | Map bird info drawer is full-width (left, right, bottom edges) | Code inspection of `index.tsx` shows `BottomSheetModal` with `BottomSheetModalProvider` in root layout — drawer is already portal-rendered above tab bar. Per CONTEXT.md, NAV-03 and NAV-04 are already resolved; map marker hit area is the real remaining gap. |
| NAV-04 | Map drawer renders above all other content (including debug) | Same as NAV-03 — already resolved via BottomSheetModalProvider portal pattern. |
</phase_requirements>

---

## Summary

Phase 8 is a UI polish sweep across six distinct areas: auth drawer backdrop, onboarding screen alignment, name screen keyboard avoidance, paywall content tweaks, map marker hit area enlargement, tab/navigation styling, and profile achievements restructure. No new libraries are required — every fix uses patterns already established in the codebase.

The heaviest conceptual task is the **OnboardingLayout alignment fix**: the current `ScrollView` content container uses `justifyContent: 'center'`, which vertically centers all content. The welcome screen uses a different absolute-positioned layout. The fix is to adjust `scrollContent` padding in `OnboardingLayout.tsx` so text blocks match the welcome screen's Y position. The name screen additionally needs a `justifyContent: 'flex-start'` override plus keyboard avoidance.

The second heaviest task is **backdrop z-order for AuthDrawer**: `@gorhom/bottom-sheet` renders its `BottomSheetBackdrop` within the sheet's own layer. On the welcome screen, `mosaicContainer` has `position: relative` / `height: MOSAIC_HEIGHT`. The backdrop does not extend above the sheet's render origin, so it stops below the mosaic. The correct fix is to use `@gorhom/bottom-sheet`'s `backdropComponent` with an absolute-positioned `View` at the `GestureHandlerRootView` / `BottomSheetModalProvider` level — or to use `overDragResistanceFactor` with a custom backdrop that measures full screen height. Simpler: render an additional `Animated.View` backdrop sibling at the root screen level that mirrors the sheet's open/close state. The least-intrusive approach that matches `BottomSheet` (not `BottomSheetModal`) is to override the `style` prop on `BottomSheetBackdrop` by wrapping with absolute positioning at full screen height.

**Primary recommendation:** Execute all seven task areas sequentially, each scoped to its own files, referencing existing token/component patterns without introducing new dependencies.

---

## Standard Stack

### Core (already installed, no additions needed)

| Library | Version | Purpose | Role in Phase 8 |
|---------|---------|---------|-----------------|
| `@gorhom/bottom-sheet` | 5.2.8 | Bottom sheet + backdrop | Auth drawer backdrop fix |
| `expo-router` | ~55.0.4 | Navigation + Stack config | Back button label removal, header border removal |
| `react-native-gesture-handler` | ~2.30.0 | Gesture system | Map marker hit area (TouchableOpacity wrapper) |
| `expo-image` | ~55.0.6 | Image rendering | Social proof Image component (future swap) |
| `react-native-reanimated` | 4.2.1 | Animations | Already in use for AuthDrawer backdrop opacity |
| Design tokens | n/a | Colors, spacing, typography | `semantic.actionPrimary` for tab active color |

### No New Installations Required

All required capabilities are already in `package.json`. This phase is purely configuration and styling changes.

---

## Architecture Patterns

### Pattern 1: BottomSheet Backdrop Z-Order Fix

**What:** `BottomSheetBackdrop` on `BottomSheet` (non-modal) renders within the sheet's layer, which sits below the mosaic container in the welcome screen's z-stack. The backdrop needs to cover the full screen including the mosaic.

**Root cause in code:** `WelcomeScreen` renders `AuthDrawer` after `mosaicContainer` in JSX order. `BottomSheet` with `index={-1}` and `enableDynamicSizing` renders its backdrop starting from the sheet's snap point origin, not from the top of the screen.

**Fix approach (Claude's discretion — recommend Approach A):**

- **Approach A — Custom backdrop with absolute position (recommended):** Replace `BottomSheetBackdrop` with a custom `backdropComponent` that renders an `Animated.View` with `StyleSheet.absoluteFillObject` (covering 100% of the root container). Drive opacity using `BottomSheetBackdropProps.animatedIndex`. This guarantees the backdrop covers the mosaic.
- **Approach B — Z-index layering:** Add explicit `zIndex` to the `AuthDrawer` wrapper in `welcome.tsx` above the mosaic. Risk: may interfere with pointer events on mosaic columns.

```tsx
// Approach A — custom backdrop pattern (recommended)
// Source: @gorhom/bottom-sheet backdropComponent prop docs
const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    style={[props.style, StyleSheet.absoluteFillObject]}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.5}
  />
), [])
```

Note: `BottomSheetBackdrop` already accepts a `style` prop — adding `StyleSheet.absoluteFillObject` extends its positioning to the full parent container. Verify that `WelcomeScreen`'s root `View` with `flex: 1` is the correct ancestor. If not, set `position: 'absolute'` with `top: 0, bottom: 0, left: 0, right: 0` on the `BottomSheet` container.

### Pattern 2: OnboardingLayout Alignment Fix

**What:** `OnboardingLayout`'s `scrollContent` uses `justifyContent: 'center'`, vertically centering children. Welcome screen uses a different hard-coded layout. To match, the `scrollContent` padding needs to add `paddingTop` that positions text at the same Y as the welcome screen's `textSection`.

**Welcome screen reference values:**
- `textSection.paddingTop: spacing['6']` (24px)
- `textSection.paddingHorizontal: spacing['4']` (16px)
- Text is center-aligned

**Current OnboardingLayout scrollContent:**
```tsx
scrollContent: {
  flexGrow: 1,
  justifyContent: 'center',       // vertically centers
  paddingHorizontal: spacing['6'], // 24px horizontal
}
```

**Fix:** Remove `justifyContent: 'center'`, add `paddingTop: spacing['6']` to `scrollContent`. This places children at the top of the scroll area with the same padding as welcome. All onboarding screens using `OnboardingLayout` will be affected — this is intentional per CONTEXT.md.

### Pattern 3: Name Screen Top-Alignment + Keyboard Avoidance

**What:** Name screen must align content to top (not center) AND push content up when keyboard opens.

**Current name.tsx structure:** Uses `OnboardingLayout` with `Animated.View` > `View` (avatar) + `Text` (heading) + `TextInput`. `OnboardingLayout`'s `ScrollView` becomes the keyboard-aware container.

**Fix approach (Claude's discretion — recommend `KeyboardAvoidingView`):**

```tsx
// In name.tsx — wrap in KeyboardAvoidingView before OnboardingLayout
import { KeyboardAvoidingView, Platform } from 'react-native'

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <OnboardingLayout ...>
    {/* content */}
  </OnboardingLayout>
</KeyboardAvoidingView>
```

**Alternative:** Add `automaticallyAdjustKeyboardInsets={true}` to the `ScrollView` inside `OnboardingLayout`. Since `OnboardingLayout` is shared and other screens don't need keyboard avoidance, the per-screen `KeyboardAvoidingView` wrapper is preferred.

For top-alignment: Override `justifyContent` in the `scrollContent` for name screen — pass a `contentContainerStyle` override prop to `OnboardingLayout`. OR: name screen can opt out of the new `paddingTop`-only `scrollContent` by wrapping its content with `alignSelf: 'flex-start'` since it needs `justifyContent: 'flex-start'` by default after the layout change.

After the OnboardingLayout change (Pattern 2), `scrollContent` will already be `flex-start` aligned — name screen just needs the `KeyboardAvoidingView`.

### Pattern 4: Map Marker Hit Area Enlargement

**What:** `BirdMarker` renders markers of 14-18px size. React Native / Maps minimum tap target is 44x44px per HIG guidelines.

**Fix pattern — transparent hit area wrapper:**

```tsx
// In BirdMarker.tsx — wrap marker view in a larger transparent container
<Marker ...onPress={...}>
  <View style={styles.hitArea}>
    {bird.rarity === 'common' ? (
      <View style={styles.commonMarker} />
    ) : ...}
  </View>
</Marker>

// styles:
hitArea: {
  width: 44,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: 'transparent' -- implicit
},
```

This preserves visual marker size while expanding the touchable area. `react-native-maps` `Marker` respects the size of its custom view child for hit testing.

### Pattern 5: Tab Bar Active Color

**What:** `(main)/_layout.tsx` sets `tabBarActiveTintColor: colors.neutral700`. Change to `semantic.actionPrimary` (`#1F87FE`).

**Current code (line 10 of `_layout.tsx`):**
```tsx
tabBarActiveTintColor: colors.neutral700,
```

**Fix:**
```tsx
import { semantic } from '@/theme/colors'
// ...
tabBarActiveTintColor: semantic.actionPrimary,
```

### Pattern 6: Back Button Label + Header Border Removal

**What:** Profile screen (`app/profile.tsx`) is a Stack screen configured in `app/_layout.tsx` at line 63:
```tsx
<Stack.Screen name="profile" options={{ headerShown: true, title: '', headerBackTitle: '' }} />
```

`headerBackTitle: ''` already removes the text label for the back button on profile. However, Community screen uses `headerShown: true` via the Tabs config in `(main)/_layout.tsx` (line 27: `headerShown: true`). The back button label on Community may show "(main)" from Expo Router's default behavior.

**Back button label removal:**
- Profile: already has `headerBackTitle: ''` in `app/_layout.tsx` Stack.Screen. Verify this is working. If not, add `headerBackButtonDisplayMode: 'minimal'` (React Native 0.83 / Expo 55).
- Community: `headerShown: true` in Tabs config doesn't create a Stack back button — Community is a tab, not pushed route, so there may be no back button at all. Investigate if the "(main)" label appears from a different navigator push.

**Header separator removal:**
```tsx
// In Stack.Screen options or Tabs.Screen options:
headerShadowVisible: false,

// For platform-accurate complete removal (iOS):
headerStyle: { borderBottomWidth: 0 },
```

Expo Router / React Navigation `headerShadowVisible: false` removes the bottom border/shadow on both platforms (confirmed pattern in React Navigation docs). This is the correct approach.

**For Profile (Stack.Screen in app/_layout.tsx):**
```tsx
<Stack.Screen
  name="profile"
  options={{
    headerShown: true,
    title: '',
    headerBackTitle: '',
    headerShadowVisible: false,
  }}
/>
```

**For Community (Tabs.Screen in (main)/_layout.tsx):**
```tsx
<Tabs.Screen
  name="community"
  options={{
    headerShown: true,
    title: 'Community',
    headerShadowVisible: false,
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="people" size={size} color={color} />
    ),
  }}
/>
```

### Pattern 7: Profile Achievements — Vertical List with Locked Items

**What:** Current `achievements` style is `flexDirection: 'row'` (4 columns). Change to vertical list. Add 2-3 locked dummy items with visual dimming.

**Fix pattern:**
```tsx
const ACHIEVEMENTS = [
  { icon: 'sunny-outline', label: 'Early Bird', bg: semantic.rarityUncommonBg, unlocked: true },
  { icon: 'eye-outline', label: 'Sharp Eye', bg: semantic.rarityCommonBg, unlocked: true },
  { icon: 'camera-outline', label: 'Photographer', bg: semantic.rarityRareBg, unlocked: true },
  { icon: 'compass-outline', label: 'Explorer', bg: semantic.statusSuccessBg, unlocked: true },
  { icon: 'lock-closed-outline', label: 'Night Owl', bg: semantic.bgSurface, unlocked: false },
  { icon: 'lock-closed-outline', label: 'Migration Tracker', bg: semantic.bgSurface, unlocked: false },
  { icon: 'lock-closed-outline', label: 'Rare Finder', bg: semantic.bgSurface, unlocked: false },
]

// Row style — replaces achievement grid item:
achievementRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing['4'],
  paddingVertical: spacing['3'],
  paddingHorizontal: spacing['4'],
  borderRadius: 12,
  borderCurve: 'continuous',
  backgroundColor: semantic.bgPage,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
},
achievementRowLocked: {
  opacity: 0.4,
},
```

Claude's discretion: opacity 0.4 for locked items (clear enough to suggest "there's more" while being obviously inaccessible). Lock icon in place of achievement icon for locked items.

### Pattern 8: Paywall Tweaks

Three independent changes in `paywall.tsx`:

1. **Nature Day banner** (line 49-54): Remove `<Ionicons name="leaf">` and `🌿 ` from the Text. Keep banner container and text styles.
2. **Unlock pill icon** (line 82): Change `name="lock-open-outline"` to `name="ribbon"`.
3. **Social proof boxes** (lines 73-78): The boxes are empty `<View>` placeholders. Per decisions, keep current layout (`flex: 1, height: 72`) but add text content as placeholder for now — user will provide images later. Add centered text inside each box.

```tsx
// Social proof box with placeholder text (until user provides images):
<View style={styles.socialBox}>
  <Text style={styles.socialText}>400+ happy birders</Text>
</View>
<View style={styles.socialBox}>
  <Text style={styles.socialText}>4.7 stars</Text>
</View>

// socialText style:
socialText: {
  fontFamily: fontWeights.semiBold,
  fontSize: 13,
  color: semantic.textSecondary,
  textAlign: 'center',
  padding: spacing['3'],
},
```

### Anti-Patterns to Avoid

- **Do not add new navigation libraries** to implement back button changes — all config is via Expo Router `options` props on Stack.Screen / Tabs.Screen.
- **Do not use `zIndex` on `mosaicContainer`** to fix backdrop — this can block pointer events on the mosaic animation.
- **Do not wrap `OnboardingLayout` in another ScrollView** for keyboard avoidance — nesting ScrollViews breaks scroll behavior.
- **Do not change `OnboardingLayout` to require `justifyContent` as a prop** — the fix (remove `justifyContent: 'center'`, add `paddingTop`) is the right approach and applies to all screens correctly.
- **Do not use `hitSlop` on `BirdMarker`** — `hitSlop` on custom Marker children has inconsistent behavior in `react-native-maps`. Use the transparent wrapper View approach instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard push-up behavior | Custom keyboard height listener | `KeyboardAvoidingView` with `behavior="padding"` | Platform-correct, handles IME insets automatically |
| Header border removal | Custom header component | `headerShadowVisible: false` in Screen options | Built into React Navigation / Expo Router |
| Back button label | Custom back button render | `headerBackTitle: ''` + `headerBackButtonDisplayMode: 'minimal'` | Stack navigator option, no custom component needed |
| Full-screen backdrop | Manual Modal-based overlay | `BottomSheetBackdrop` with `StyleSheet.absoluteFillObject` style override | Backdrop is already wired to sheet animation state |

---

## Common Pitfalls

### Pitfall 1: `headerBackTitle` vs `headerBackButtonDisplayMode`
**What goes wrong:** `headerBackTitle: ''` hides the text label on iOS but the back button may still show "(main)" from Expo Router's default file-system routing if the route name is derived from the group. React Native 0.73+ adds `headerBackButtonDisplayMode: 'minimal'` which shows only the chevron.
**Why it happens:** Expo Router generates back button titles from the previous screen name if `headerBackTitle` is not explicitly overridden in the right `Stack.Screen`.
**How to avoid:** Set both `headerBackTitle: ''` AND `headerBackButtonDisplayMode: 'minimal'` in the Stack.Screen options.
**Warning signs:** Back button still shows text after setting `headerBackTitle: ''`.

### Pitfall 2: `OnboardingLayout` justifyContent change affecting existing screens incorrectly
**What goes wrong:** Removing `justifyContent: 'center'` from `scrollContent` causes screens with short content to stick to the top instead of center — this IS the desired effect per CONTEXT.md but may expose spacing inconsistencies in individual screens.
**Why it happens:** Each onboarding screen relies on the layout centering its content. After the change, screens with less content will appear top-aligned.
**How to avoid:** The fix is intentional — all screens should match welcome screen's positioning. Verify each screen after applying the layout change and adjust individual screen `paddingTop` or wrapper margins if needed.
**Warning signs:** Text appears too high (close to progress dots) on any screen after the change.

### Pitfall 3: `react-native-maps` Marker custom view sizing
**What goes wrong:** Adding a 44x44 wrapper `View` around the marker visual may shift the marker's anchor point, causing the visual marker to not align with the coordinate on the map.
**Why it happens:** `anchor={{ x: 0.5, y: 0.5 }}` centers the entire custom view child (now 44x44) on the coordinate — the visual marker inside is centered within that 44x44, so it should remain correctly positioned.
**How to avoid:** Keep `anchor={{ x: 0.5, y: 0.5 }}` on `Marker`. The transparent wrapper preserves alignment. Verify visually on device.
**Warning signs:** Markers appear offset from their expected geographic position after the hit area change.

### Pitfall 4: BottomSheet backdrop not covering mosaic after style override
**What goes wrong:** `BottomSheetBackdrop` with `StyleSheet.absoluteFillObject` added to its `style` prop may still be clipped by the sheet's container.
**Why it happens:** `BottomSheet` renders its backdrop inside its own view hierarchy. If the parent container is not `position: 'absolute'` / full-screen, `absoluteFillObject` is relative to that container, not the screen.
**How to avoid:** Confirm that `WelcomeScreen`'s root `View` with `style={styles.root}` (`flex: 1`) fills the full screen. In practice, this should be sufficient. Test on device — if clipping persists, consider using a sibling `Animated.View` overlay in `welcome.tsx` driven by the `onChange` callback.

### Pitfall 5: Tab active color import conflict
**What goes wrong:** `(main)/_layout.tsx` imports `colors` from `@/theme/colors`. Adding `semantic` import is needed but `semantic` is not yet imported there.
**Why it happens:** The file currently only imports `colors` (line 3 of `_layout.tsx`). Changing to `semantic.actionPrimary` requires adding `semantic` to the import.
**How to avoid:** Update import to `import { colors, semantic } from '@/theme/colors'` — or simply use the raw value `'#1F87FE'` with a comment referencing the token.

---

## Code Examples

### Map Header Icon Color (consistent with inactive tab)

```tsx
// In index.tsx topBar — change Ionicons color to neutral400 (inactive tab color)
// Source: Direct codebase inspection of (main)/_layout.tsx + colors.ts
import { colors } from '@/theme/colors'

// Before: color={semantic.textPrimary}  (neutral700)
// After:
<Ionicons name="person-circle" size={24} color={colors.neutral400} />
<Ionicons name="notifications" size={22} color={colors.neutral400} />
```

### Tab Bar Active Color

```tsx
// In app/(main)/_layout.tsx
// Source: Direct codebase inspection
import { colors, semantic } from '@/theme/colors'

<Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: semantic.actionPrimary,  // was: colors.neutral700
    tabBarInactiveTintColor: colors.neutral400,
  }}
>
```

### Header Shadow Removal (both Stack and Tabs screens)

```tsx
// Stack.Screen (profile) in app/_layout.tsx:
<Stack.Screen
  name="profile"
  options={{
    headerShown: true,
    title: '',
    headerBackTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerShadowVisible: false,
  }}
/>

// Tabs.Screen (community) in app/(main)/_layout.tsx:
<Tabs.Screen
  name="community"
  options={{
    headerShown: true,
    title: 'Community',
    headerShadowVisible: false,
    tabBarIcon: ...
  }}
/>
```

### Keyboard Avoiding Name Screen

```tsx
// In app/(onboarding)/name.tsx
import { KeyboardAvoidingView, Platform } from 'react-native'

export default function NameScreen() {
  // ...
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <OnboardingLayout ...>
        {/* existing content */}
      </OnboardingLayout>
    </KeyboardAvoidingView>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact for Phase 8 |
|--------------|------------------|---------------------|
| `headerBackTitleVisible: false` | `headerBackTitle: ''` + `headerBackButtonDisplayMode: 'minimal'` | Use both for reliable label removal |
| `hitSlop` on map markers | Transparent wrapper View | More reliable in react-native-maps custom markers |
| `flex-wrap` achievement grid | Vertical list rows | User request — shows progression more clearly |

---

## Open Questions

1. **Community screen back button source**
   - What we know: Community is a Tabs screen, not a pushed Stack screen. It should not have a back button unless it's being pushed via `router.push('/community')` from somewhere.
   - What's unclear: Whether "(main)" label actually appears on Community, or only on Profile. Community uses `headerShown: true` in Tabs config — Tabs headers don't show back buttons by default.
   - Recommendation: During implementation, check whether Community actually shows a back button. If not, skip back button change for Community — only Profile needs it.

2. **Auth drawer backdrop — `style` prop on `BottomSheetBackdrop`**
   - What we know: `@gorhom/bottom-sheet` v5.x `BottomSheetBackdrop` accepts a `style` prop.
   - What's unclear: Whether adding `StyleSheet.absoluteFillObject` to the existing `style` actually extends the backdrop to cover the mosaic, or whether it's still clipped by the sheet's internal container.
   - Recommendation: Implement Approach A first (style override). If mosaic is still not covered after testing on device, fall back to a sibling overlay in welcome.tsx driven by the `onChange` prop.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, no vitest.config, no test/ directory |
| Config file | None — Wave 0 would need to establish if required |
| Quick run command | n/a |
| Full suite command | `npm run lint` (ESLint only) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Login and Signup drawers both show Apple, Google, Email options | manual-only | Visual inspection on device | n/a |
| PAYW-06 | Social proof boxes show "400+ happy birders" and "4.7 stars" text | manual-only | Visual inspection on device | n/a |
| NAV-03 | Map bird info drawer is full-width (left, right, bottom edges) | manual-only | Visual inspection on device | n/a |
| NAV-04 | Map drawer renders above all other content | manual-only | Visual inspection on device | n/a |

All phase requirements are visual/behavioral and require manual verification on device. No automated test infrastructure exists in the project. ESLint (`npm run lint`) validates TypeScript correctness and can catch import errors.

### Sampling Rate

- **Per task commit:** `npm run lint` — confirms no TypeScript/lint regressions
- **Per wave merge:** `npm run lint` — full lint pass
- **Phase gate:** All visual checks passing before `/gsd:verify-work`

### Wave 0 Gaps

None needed — no test framework required. Lint is sufficient for this phase's change type (styling, layout, config options only).

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — `src/components/welcome/AuthDrawer.tsx`, `app/(onboarding)/welcome.tsx`, `app/(onboarding)/paywall.tsx`, `app/(onboarding)/name.tsx`, `app/(onboarding)/ai-bird-id.tsx`, `src/components/onboarding/OnboardingLayout.tsx`, `app/(main)/_layout.tsx`, `app/(main)/index.tsx`, `app/profile.tsx`, `src/components/map/BirdMarker.tsx`, `src/theme/colors.ts`, `app/_layout.tsx`
- `.planning/phases/08-auth-fix-ui-polish/08-CONTEXT.md` — user decisions
- `.planning/REQUIREMENTS.md` — requirement IDs and acceptance criteria
- `package.json` — installed dependency versions (all libraries already present)

### Secondary (MEDIUM confidence)

- React Navigation / Expo Router Stack options: `headerBackTitle`, `headerShadowVisible`, `headerBackButtonDisplayMode` — standard documented options; patterns confirmed by existing usage in `app/_layout.tsx`
- `@gorhom/bottom-sheet` v5 `backdropComponent` + `BottomSheetBackdrop` `style` prop — confirmed API from v5 changelog and established project usage

### Tertiary (LOW confidence)

- `headerBackButtonDisplayMode: 'minimal'` availability in React Native 0.83 — should be available (added in RN 0.73) but not verified against exact installed version. Low risk: `headerBackTitle: ''` alone is sufficient fallback.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed, versions confirmed from package.json
- Architecture: HIGH — all patterns derived from direct codebase inspection of actual files
- Pitfalls: HIGH — sourced from known React Native / Expo Router / react-native-maps behaviors
- Validation: HIGH — no test infra exists, manual verification is the only viable approach

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (stable dependencies, no fast-moving libraries involved)
