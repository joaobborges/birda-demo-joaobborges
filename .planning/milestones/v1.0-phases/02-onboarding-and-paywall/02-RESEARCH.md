# Phase 2: Onboarding and Paywall - Research

**Researched:** 2026-03-09
**Domain:** React Native onboarding flow, animations, paywall UI
**Confidence:** HIGH

## Summary

Phase 2 replaces the existing 8-screen onboarding flow with an 11-screen flow: welcome with T&C, 4 feature tour screens, 3 quiz screens, paywall, and 2 post-paywall screens. All screens share a single `OnboardingLayout` component. The existing codebase already has most patterns established (uncontrolled TextInput via ref, chip selection, Reanimated entering animations, ProgressDots, Zustand store). The main new work is: creating the shared layout component, adding new screen types (feature tour, post-paywall), redesigning the welcome screen with T&C checkbox, making the paywall toggle adaptive-width, adding hero image placeholders, and applying `borderCurve: 'continuous'` across the entire app.

The stack animation change from `slide_from_right` to `fade` is a one-line config change -- `animation: 'fade'` is a supported value in expo-router's native Stack navigator. The adaptive-width toggle requires measuring text content widths via `onLayout` and animating the indicator's width/translateX with `withSpring`. The Zustand store needs new fields for `birdingJourney`, `goals`, and `termsAccepted`.

**Primary recommendation:** Build OnboardingLayout first, then migrate/create screens in flow order, then polish paywall toggle and animations last.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Create `OnboardingLayout` in `src/components/onboarding/OnboardingLayout.tsx` with optional slots: `header`, `children`, `footer`
- Layout handles safe area insets internally -- screens never touch `useSafeAreaInsets`
- ProgressDots passed as optional `header` prop
- Full 11-screen flow replaces existing 8-screen flow (see CONTEXT.md for exact screen table)
- Two separate dot groups: feature tour (4 dots) and quiz (3 dots)
- Navigation is button-driven only -- no swipe/pager
- Back gesture remains disabled on onboarding stack
- Screen transitions: fade crossfade (not slide_from_right)
- Content entrance: all elements fade in together with subtle delay -- no stagger, no slide-down, just opacity
- Paywall toggle: keep `withSpring({ damping: 15 })` animation
- Paywall toggle becomes adaptive/content-fit width
- Both standard and Nature Day paywall get full-bleed hero image at top
- Nature Day variant: different hero image + promotional banner
- Headline personalization: name only, falls back to generic
- Welcome screen: top-half hero image, T&C checkbox required before buttons work
- All hero images use solid color block placeholders
- Apply `borderCurve: 'continuous'` to all rounded corners throughout the app
- Birding journey levels: New, Garden, Intermediate, Expert (single-select chips)
- Goals options: 5 items (multi-select)
- Feature tour copy is specified in CONTEXT.md
- Create Account / Log in on welcome are visual only -- both lead to same flow

### Claude's Discretion
- Whether to delete or keep old screen files (location, interests, notifications, summary)
- Exact placeholder color block values from the Birda palette
- Spring parameters for adaptive toggle width animation
- ProgressDots component updates (if any needed for the two-group pattern)
- Zustand store updates for new fields (birding journey, goals)
- Exact fade timing and delay values for content entrance animations

### Deferred Ideas (OUT OF SCOPE)
- Second paywall after reminders/mailing list (before home)
- Location screen
- Notification preferences screen
- Profile summary screen
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ONBR-01 | Each onboarding screen has animated content transitions (FadeIn, spring effects on buttons) | Reanimated `FadeIn` entering animation on content wrapper; Button already has spring press animation via GestureDetector |
| ONBR-02 | Onboarding screens share a reusable layout component (no duplicated styles across screens) | OnboardingLayout with `header`/`children`/`footer` slots handles safe area, background, spacing consistently |
| ONBR-03 | Name and location inputs use uncontrolled TextInput pattern (ref-based, commit on Continue) | Existing `name.tsx` already uses `useRef` pattern; location screen removed from flow, but same pattern applies if re-added |
| PAYW-01 | Plan toggle animates with withSpring and adapts to content width (no hardcoded dimensions) | `onLayout` to measure each option's width, store in shared values, animate indicator width/translateX with `withSpring` |
| PAYW-02 | Paywall headline references user's name or skill level from onboarding store | Zustand store already has `name`; just needs conditional in headline template |
| PAYW-03 | Nature Day discount variant accessible via debug panel with 20% off pricing and urgency copy | DevPanel already triggers Nature Day via `variant: 'nature-day'` search param; needs hero image + banner additions |
| STYL-01 | All rounded corners use borderCurve: 'continuous' for smooth iOS corners | Audit found `DevPanel.tsx` and several `(main)` files missing `borderCurve` alongside `borderRadius` |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 4.2.1 | Entering animations, spring toggle, fade transitions | Already in project; FadeIn, withSpring, useAnimatedStyle |
| react-native-gesture-handler | ~2.30.0 | Tap gestures on buttons | Already in project; Button component uses GestureDetector |
| expo-router | ~55.0.4 | Stack navigator with fade animation | Already in project; native Stack supports `animation: 'fade'` |
| zustand | ^5.0.11 | Onboarding state persistence | Already in project; store needs new fields |
| react-native-safe-area-context | ~5.6.2 | Safe area insets (used inside OnboardingLayout only) | Already in project |
| expo-haptics | ~55.0.8 | Button feedback | Already in project |

### No New Dependencies Required
This phase requires zero new npm packages. All animations, state management, and layout are covered by the existing stack.

## Architecture Patterns

### Recommended File Structure
```
src/
  components/
    onboarding/
      OnboardingLayout.tsx    # NEW - shared layout with slots
      ProgressDots.tsx         # EXISTS - may need minor updates
app/
  (onboarding)/
    _layout.tsx               # MODIFY - animation: 'fade'
    index.tsx                 # EXISTS - redirect to welcome
    welcome.tsx               # REWRITE - hero image, T&C, two buttons
    ai-bird-id.tsx            # NEW - feature tour screen 1
    green-time.tsx             # NEW - feature tour screen 2
    discover.tsx               # NEW - feature tour screen 3
    community.tsx              # NEW - feature tour screen 4
    name.tsx                   # MODIFY - use OnboardingLayout, update flow
    birding-journey.tsx        # NEW - replaces skill-level.tsx
    goals.tsx                  # NEW - replaces interests.tsx
    paywall.tsx                # MODIFY - hero image, adaptive toggle, layout
    reminders.tsx              # NEW - post-paywall screen
    mailing-list.tsx           # NEW - post-paywall screen
    # DELETE: location.tsx, interests.tsx, notifications.tsx, summary.tsx
    # KEEP: skill-level.tsx can be deleted (replaced by birding-journey.tsx)
src/
  stores/
    onboarding.ts             # MODIFY - new fields
```

### Pattern 1: OnboardingLayout Slot Component
**What:** A shared layout component that handles safe area insets, background color, and consistent spacing. Screens pass content through named slots.
**When to use:** Every onboarding screen.
**Example:**
```typescript
// src/components/onboarding/OnboardingLayout.tsx
import { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { semantic } from '@/theme/colors'

interface OnboardingLayoutProps {
  header?: ReactNode    // ProgressDots or null
  children: ReactNode   // Main content area (flex: 1)
  footer?: ReactNode    // Buttons / actions
}

export function OnboardingLayout({ header, children, footer }: OnboardingLayoutProps) {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      {header ? header : null}
      <View style={styles.content}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    gap: 8,
  },
})
```

### Pattern 2: Feature Tour Screen (Repeatable)
**What:** A thin screen file that passes content to OnboardingLayout. All 4 tour screens follow this identical pattern.
**When to use:** Feature tour screens (ai-bird-id, green-time, discover, community).
**Example:**
```typescript
// app/(onboarding)/ai-bird-id.tsx
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

export default function AIBirdIdScreen() {
  const { push } = useRouter()

  return (
    <OnboardingLayout
      header={<ProgressDots total={4} current={0} />}
      footer={<Button title="Continue" onPress={() => push('/(onboarding)/green-time')} />}
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <View style={styles.imagePlaceholder} />
        <Text style={styles.title}>AI Bird ID</Text>
        <Text style={styles.description}>Identify birds with AI photo recognition</Text>
      </Animated.View>
    </OnboardingLayout>
  )
}
```

### Pattern 3: Adaptive-Width Toggle
**What:** Toggle indicator that measures each option's rendered width and animates to match.
**When to use:** Paywall plan toggle.
**Example:**
```typescript
// Key mechanism for adaptive toggle
const monthlyWidth = useSharedValue(0)
const annualWidth = useSharedValue(0)

const indicatorStyle = useAnimatedStyle(() => {
  const targetWidth = plan === 'monthly' ? monthlyWidth.get() : annualWidth.get()
  const targetX = plan === 'monthly' ? 0 : monthlyWidth.get()
  return {
    width: withSpring(targetWidth, { damping: 15 }),
    transform: [{ translateX: withSpring(targetX, { damping: 15 }) }],
  }
})

// Each option uses onLayout to report its width
<View onLayout={(e) => { monthlyWidth.set(e.nativeEvent.layout.width) }}>
  {/* Monthly content */}
</View>
```

### Pattern 4: Zustand Store Updates
**What:** New fields for birding journey, goals, and terms acceptance.
**Example:**
```typescript
interface OnboardingState {
  name: string
  birdingJourney: 'new' | 'garden' | 'intermediate' | 'expert' | null  // replaces skillLevel
  goals: string[]          // replaces interests
  termsAccepted: boolean   // NEW
  completed: boolean
  // ... setters
}
```

### Anti-Patterns to Avoid
- **Calling `useSafeAreaInsets` in screen files:** OnboardingLayout owns safe area -- screens must not import or use it
- **Using `FadeInDown` for content entrance:** Decision specifies `FadeIn` (opacity only), not slide-down variants
- **Hardcoded toggle indicator width:** Current paywall uses `width: 148` -- must be replaced with measured values
- **Using `&&` for conditional rendering:** Project convention requires ternary operator
- **Controlled TextInput for name:** Must use `useRef` + `onChangeText` to avoid re-renders on every keystroke

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screen transitions | Custom animated transitions | `animation: 'fade'` in Stack screenOptions | Native performance, one-line config |
| Safe area handling | Manual padding per screen | `useSafeAreaInsets` inside OnboardingLayout | Centralized, never duplicated |
| Button press animation | Custom Animated.Value spring | Existing `Button` component with GestureDetector | Already built, has haptics |
| State persistence | AsyncStorage manual read/write | Zustand `persist` middleware (already configured) | Already working, handles hydration |
| Content entering animation | Custom opacity + timing logic | Reanimated `FadeIn.delay(100).duration(300)` | Declarative, performant, one line |

## Common Pitfalls

### Pitfall 1: Toggle indicator flash on mount
**What goes wrong:** Adaptive toggle indicator shows wrong width on first render because `onLayout` hasn't fired yet.
**Why it happens:** `onLayout` fires after the first render; shared values start at 0.
**How to avoid:** Either: (a) set initial shared values to reasonable defaults (e.g., `Dimensions.get('window').width / 2 - padding`), or (b) hide indicator until both measurements are available.
**Warning signs:** Toggle indicator is zero-width or full-width briefly on mount.

### Pitfall 2: Stale ref value on name screen Skip
**What goes wrong:** Tapping "Skip" after typing still commits the name because `nameRef.current` has the typed value.
**Why it happens:** Skip handler doesn't clear the ref.
**How to avoid:** Skip handler should NOT commit the ref value -- just navigate. The existing pattern does this correctly (skip calls push without calling setName).

### Pitfall 3: Navigation stack accumulation
**What goes wrong:** User can navigate forward through 11 screens, creating a deep stack.
**Why it happens:** Using `push` for every screen adds to the back stack.
**How to avoid:** With back gesture disabled, this is acceptable. But consider using `replace` for linear-only flows if memory is a concern. Current pattern uses `push` which is fine since gestureEnabled is false.

### Pitfall 4: ProgressDots confusion with two groups
**What goes wrong:** Two separate dot groups (4 tour + 3 quiz) could be confusing if not visually separate.
**Why it happens:** ProgressDots component is generic -- it just takes `total` and `current`.
**How to avoid:** Each screen group simply passes its own `total` and `current`. Tour screens pass `total={4}`, quiz screens pass `total={3}`. No component changes needed -- the two groups are naturally separated by being on different screens.

### Pitfall 5: borderCurve on non-iOS platforms
**What goes wrong:** `borderCurve: 'continuous'` is iOS-only; Android ignores it.
**Why it happens:** It's an iOS-specific rendering hint for squircle corners.
**How to avoid:** This is fine -- Android simply ignores the property. No platform check needed. Apply it everywhere.

### Pitfall 6: Welcome screen T&C checkbox blocking buttons
**What goes wrong:** Buttons appear tappable but do nothing when T&C is unchecked.
**Why it happens:** No visual feedback that checkbox is required.
**How to avoid:** Either disable buttons visually (reduced opacity) when unchecked, or show a subtle error state. Recommend: set `opacity: 0.5` on buttons when `termsAccepted` is false, and ignore press.

## Code Examples

### Stack layout with fade animation
```typescript
// app/(onboarding)/_layout.tsx
import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        animation: 'fade',  // Changed from 'slide_from_right'
      }}
    />
  )
}
```
Source: [Expo Router Stack docs](https://docs.expo.dev/router/advanced/stack/) -- `fade` is a supported value for the `animation` property.

### Content entrance animation (simplified)
```typescript
// FadeIn only -- no slide, no stagger
<Animated.View entering={FadeIn.delay(100).duration(300)}>
  {/* All screen content wrapped in a single animated view */}
</Animated.View>
```
Source: Reanimated layout animations API.

### Chip/pill selection (single-select for birding journey)
```typescript
const LEVELS = [
  { key: 'new', label: 'New', description: "I'm new to birding" },
  { key: 'garden', label: 'Garden', description: 'I know a few garden birds' },
  { key: 'intermediate', label: 'Intermediate', description: 'I go birding regularly' },
  { key: 'expert', label: 'Expert', description: "I'm an experienced birder" },
] as const

// Chip style follows existing interests.tsx pattern but single-select
```

### T&C Checkbox pattern
```typescript
// Simple pressable checkbox -- no library needed
const [termsAccepted, setTermsAccepted] = useState(false)

<Pressable
  style={styles.checkboxRow}
  onPress={() => setTermsAccepted(!termsAccepted)}
>
  <View style={[styles.checkbox, termsAccepted ? styles.checkboxChecked : null]}>
    {termsAccepted ? <Text style={styles.checkmark}>✓</Text> : null}
  </View>
  <Text style={styles.checkboxLabel}>
    I agree to the Terms of Service and Privacy Policy
  </Text>
</Pressable>
```

### Mailing list toggle switch
```typescript
// React Native's built-in Switch component
import { Switch } from 'react-native'

const [mailingList, setMailingList] = useState(false)

<Switch
  value={mailingList}
  onValueChange={setMailingList}
  trackColor={{ false: semantic.borderDefault, true: semantic.actionPrimary }}
  thumbColor={semantic.bgPage}
/>
```

## State of the Art

| Old Approach (Current) | New Approach (Phase 2) | Impact |
|------------------------|------------------------|--------|
| `animation: 'slide_from_right'` | `animation: 'fade'` | Smoother wizard feel, no directional bias |
| `FadeInDown` content entrance | `FadeIn` only | Simpler, less distracting |
| Hardcoded toggle width (148px) | `onLayout` measured adaptive width | Works on any screen size, any content |
| 3 skill levels (beginner/intermediate/advanced) | 4 birding journey levels (new/garden/intermediate/expert) | More granular, better personalization |
| `interests` array (bird types) | `goals` array (user motivations) | More relevant to onboarding value prop |
| 7 screens, one dot group | 11 screens, two dot groups (4 + 3) | Richer flow, separated concerns |

## STYL-01 Audit: borderCurve Gaps

Files with `borderRadius` but missing `borderCurve: 'continuous'`:

| File | Lines with borderRadius | Status |
|------|------------------------|--------|
| `src/components/dev/DevPanel.tsx` | L94 (borderRadius: 22) | MISSING borderCurve |
| `app/(main)/index.tsx` | L156, L171, L185, L201, L212, L251, L284 | Some present, audit needed per-style |
| `app/(main)/profile.tsx` | L80, L92, L103, L143 | Some present, audit needed per-style |
| `app/(main)/community.tsx` | L81 | Has borderCurve |
| `src/theme/components.ts` | Button presets L20, L26, L32 | Token-level -- no borderCurve (screens add it) |

The planner should include a task to sweep all files and add `borderCurve: 'continuous'` wherever `borderRadius` appears.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected (automated testing out of scope per REQUIREMENTS.md) |
| Config file | none |
| Quick run command | Manual visual verification |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ONBR-01 | Content fade animations on each screen | manual-only | Visual check: navigate through all 11 screens | N/A |
| ONBR-02 | All screens use OnboardingLayout | manual-only | Grep: no `useSafeAreaInsets` in screen files | N/A |
| ONBR-03 | Uncontrolled TextInput (ref-based) | manual-only | Type in name field, verify no re-renders via React DevTools | N/A |
| PAYW-01 | Adaptive toggle with spring animation | manual-only | Toggle between Monthly/Annual, verify smooth width change | N/A |
| PAYW-02 | Personalized paywall headline | manual-only | Enter name in onboarding, verify it appears on paywall | N/A |
| PAYW-03 | Nature Day variant via debug panel | manual-only | Open DevPanel, trigger Nature Day, verify 20% pricing | N/A |
| STYL-01 | borderCurve on all rounded corners | manual-only | Grep: every `borderRadius` has adjacent `borderCurve` | N/A |

**Justification for manual-only:** Project explicitly excludes automated test suite (see REQUIREMENTS.md Out of Scope). Architecture should be testable but no test infrastructure is required.

### Sampling Rate
- **Per task commit:** Visual walkthrough of affected screens
- **Per wave merge:** Full 11-screen flow walkthrough + Nature Day variant check
- **Phase gate:** Complete flow + borderCurve grep audit

### Wave 0 Gaps
None -- no test infrastructure required per project scope.

## Open Questions

1. **Hero image placeholder colors**
   - What we know: Placeholders use solid color blocks from Birda palette
   - What's unclear: Which specific colors for which screens (standard paywall vs Nature Day vs tour screens)
   - Recommendation: Use `colors.blue50` for standard screens, `colors.accent` (#2DD1E6) for Nature Day variant -- Claude's discretion per CONTEXT.md

2. **Old screen file cleanup**
   - What we know: location.tsx, interests.tsx, notifications.tsx, summary.tsx are being replaced
   - What's unclear: Whether to delete or keep (Claude's discretion)
   - Recommendation: Delete them -- they create confusion and dead code. The git history preserves them if needed.

3. **Mailing list and reminders store persistence**
   - What we know: These are post-paywall screens with "maybe later" options
   - What's unclear: Whether their state should persist in the Zustand store
   - Recommendation: No persistence needed -- these are one-shot screens. If user taps "Maybe later", just navigate forward. No store fields required.

## Sources

### Primary (HIGH confidence)
- [Expo Router Stack documentation](https://docs.expo.dev/router/advanced/stack/) -- confirms `animation: 'fade'` is supported
- [React Navigation Native Stack](https://reactnavigation.org/docs/native-stack-navigator/) -- full list of animation values
- Codebase audit of all existing files in `/Users/joaobborges/Developer/BIRDADEMO/`

### Secondary (MEDIUM confidence)
- [Reanimated measure docs](https://docs.swmansion.com/react-native-reanimated/docs/advanced/measure/) -- onLayout vs measure for dimension tracking
- [Reanimated layout transitions](https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/LayoutAnimations/layoutTransitions/) -- entering animation API

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and working in the project
- Architecture: HIGH - patterns derived from existing codebase conventions
- Pitfalls: HIGH - identified from actual code review of current implementation
- Animations: HIGH - `animation: 'fade'` verified against official Expo/React Navigation docs
- Adaptive toggle: MEDIUM - onLayout pattern is standard but specific implementation needs testing

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- all libraries are pinned in package.json)
