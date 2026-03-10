# Phase 6: Paywall Redesign - Research

**Researched:** 2026-03-10
**Domain:** React Native static screen layout, Ionicons, navigation stack management, Expo Image
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero image**
- Full-bleed edge-to-edge image stretching to left, right, and top edges — no margins
- ~35% of screen height
- Static asset bundled in `src/assets/` — user will provide later; build with a placeholder (colored rectangle matching current paywall)
- Close (x) button overlaid top-right in a semi-transparent circular container
- Close button uses simple opacity press feedback (0.7 on press), no spring animation

**Layout structure**
- Standalone full-screen layout — does NOT use OnboardingLayout
- Fixed single-screen layout — all content visible at once, no scrolling
- No progress dots, no shared onboarding chrome
- No pricing toggle — removed entirely in favor of static pricing display

**Content sections (top to bottom)**
1. Hero image — full-bleed bird photo with close (x) button overlay
2. Headline — "Unlock the full experience" centered
3. Feature bullets — 3 items, each with a crown icon (primary blue #1F87FE)
   - Offline maps and field guides
   - Rare bird alerts in your area
   - AI sighting reports
4. Social proof row — two image assets side by side (placeholders initially)
5. Unlock pill — badge/pill reading "Unlock all features" with a lock-opening icon
6. Pricing — "€3,33 /month" displayed large (hero pricing)
7. Annual line — "€39,99 billed annually after trial" in smaller text
8. Trust line — green checkmark icon + "No payment required · Cancel anytime"
9. CTA button — blue pill button: "Redeem your FREE Week" (FREE in all-caps bold)
10. Footer links — "Terms of Use · Restore Purchase · Privacy Policy" as tappable text links

**Feature bullet icons**
- Crown icon for all three bullets — app uses Ionicons; closest match is `ribbon` or `ribbon-outline` (no native crown in Ionicons — see research below)
- Icon color: primary blue (#1F87FE)

**Dismiss navigation**
- Close (x) button: `router.replace('/(main)')` — replaces entire onboarding stack
- CTA button: same navigation as close — goes to home map screen
- Back gesture does NOT return to onboarding after dismiss
- Both actions mark onboarding as complete in the store

**Image assets (user-provided later)**
- Hero image — bird photo
- Social proof "400+ Happy birders" illustration
- Social proof "4.7 star rating" badge
- Build all three with placeholder rectangles initially

### Claude's Discretion
- Exact spacing between content sections
- Close button circle size and opacity level
- Font sizes for pricing display (large vs small)
- Feather/leaf decorative elements approach if user doesn't provide assets
- Placeholder styling for image slots

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAYW-04 | Paywall displays hero image with close (x) button top-right | Full-bleed Image component, absolute positioned Pressable with Ionicons `close` icon |
| PAYW-05 | Paywall shows "Unlock the full experience" with 3 feature bullet points | Typography.h2 token, Ionicons `ribbon` as crown substitute, `semantic.actionPrimary` icon color |
| PAYW-06 | Paywall shows social proof (400+ happy birders, 4.7 stars) | Two side-by-side placeholder View boxes with fixed dimensions; swap for Image when assets arrive |
| PAYW-07 | Paywall shows pricing (3,33/month large, annual line small) | Custom literal fontSize (non-token) for hero price; typography.caption for annual line |
| PAYW-08 | Paywall CTA reads "Redeem your FREE Week" | Existing Button component; CTA text with inline bold sub-span via Text nesting trick |
| PAYW-09 | Paywall footer shows Terms of Use / Restore Purchase / Privacy Policy | Three Pressable Text links in a row with separator dots |
| PAYW-10 | Close button dismisses paywall and navigates to home screen | `router.replace('/(main)')` + `completeOnboarding()` — existing store action already present |
</phase_requirements>

---

## Summary

Phase 6 is a complete rewrite of `app/(onboarding)/paywall.tsx` from its current OnboardingLayout-based implementation to a standalone, fixed-height full-screen layout. The new screen is purely presentational — no state management beyond the dismiss action, no pricing toggle, no scrolling. All layout complexity is handled through absolute positioning (hero overlay close button) and `justifyContent`/`gap` for vertical spacing between content blocks.

The most important architectural constraint is that all content must fit on screen without scrolling. This means the planner must think carefully about vertical distribution — the spacing tokens and font sizes together determine whether everything fits across device sizes. The reference image shows generous but not extravagant whitespace; the planner should target devices from iPhone SE (667pt height) upwards.

The icon question is resolved: Ionicons does not include a crown icon. The closest available Ionicons icon for the "premium/crown" metaphor is `ribbon` or `ribbon-outline` (Ionicons has `ribbon`, `ribbon-outline`, `ribbon-sharp`). The unlock pill uses `lock-open` or `lock-open-outline`. For the trust line green checkmark, use `checkmark-circle` colored with a green literal (`#22C55E` is already in the color system as `markerCommon`). The close button uses `close` from Ionicons.

**Primary recommendation:** Build the screen as a single `View` with `flex: 1` and `justifyContent: 'space-between'` across major zones (hero, body, footer), using `Dimensions.get('window').height * 0.35` for hero height. Use `Pressable` with `({ pressed }) => [style, { opacity: pressed ? 0.7 : 1 }]` for the close button — consistent with the `AuthOptionButton` pattern already in the codebase.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Native `View`, `Text`, `Pressable`, `StyleSheet` | 0.83.2 (RN bundled) | Layout, typography, interaction | Already in use throughout project |
| `expo-router` `useRouter` | ~55.0.4 | `router.replace('/(main)')` for dismiss nav | Established pattern; same router used in every screen |
| `@expo/vector-icons` `Ionicons` | bundled with expo | `ribbon`, `lock-open`, `close`, `checkmark-circle` icons | Already used in AuthOptionButton; no additional install needed |
| `react-native-safe-area-context` `useSafeAreaInsets` | ~5.6.2 | Top/bottom inset padding so content avoids notch/home indicator | Used in welcome.tsx; standard Expo pattern |
| `Dimensions` from `react-native` | 0.83.2 | `Dimensions.get('window').height * 0.35` for hero height | Used in welcome.tsx for MOSAIC_HEIGHT |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `expo-image` `Image` | ~55.0.6 | Render hero image asset when provided | Swap placeholder `View` for `Image` once asset is available |
| `src/stores/onboarding` `useOnboardingStore` | Zustand 5.x | Call `completeOnboarding()` on dismiss | Already has the action — no store changes needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `ribbon` icon (crown substitute) | `trophy`, `medal`, `star` | `ribbon` best matches premium/award feel; trophy is larger visual weight; star risks "rating" connotation |
| `checkmark-circle` (green trust line) | Literal unicode `✓` | Ionicons renders correctly across platforms; unicode checkmark is font-dependent |
| `Pressable` opacity (close button) | Reanimated `withTiming` opacity | Context doc explicitly says "no spring animation" for close button; Pressable `({ pressed })` style is exactly 0.7 opacity |

**Installation:** No new packages required. All libraries are already installed.

---

## Architecture Patterns

### Recommended File Structure
```
app/(onboarding)/paywall.tsx     ← complete rewrite (single file)
src/assets/
  paywall-hero-placeholder.png   ← NOT needed; use inline View as placeholder
```

No new components needed. The paywall is a self-contained screen.

### Pattern 1: Standalone Full-Screen Layout (no OnboardingLayout)
**What:** Single root `View` with `flex: 1`, divided into three zones: hero (fixed height), body (flex: 1), footer (fixed padding). Content fills exactly one screen.
**When to use:** When a screen has unique chrome requirements — no progress dots, no shared header, must not scroll.
**Example:**
```typescript
// Mirrors welcome.tsx pattern (Phase 5)
export default function PaywallScreen() {
  const insets = useSafeAreaInsets()
  const { height } = Dimensions.get('window')
  const HERO_HEIGHT = height * 0.35

  return (
    <View style={styles.root}>
      {/* Zone 1: Hero (fixed height) */}
      <View style={[styles.hero, { height: HERO_HEIGHT }]}>
        {/* placeholder or Image */}
        <Pressable
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={handleDismiss}
        >
          {({ pressed }) => (
            <View style={[styles.closeBtnInner, { opacity: pressed ? 0.7 : 1 }]}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Zone 2: Body (flex: 1, justifyContent space-between or gap) */}
      <View style={styles.body}>
        {/* headline, bullets, social proof, unlock pill, pricing, trust */}
      </View>

      {/* Zone 3: Footer (fixed padding using insets) */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        {/* CTA button, footer links */}
      </View>
    </View>
  )
}
```

### Pattern 2: Pressable Close Button with Opacity Feedback
**What:** `Pressable` uses the `style` prop as a function receiving `{ pressed }` boolean. No Reanimated needed for simple opacity transitions.
**When to use:** Non-CTA interactive elements where the context doc specifies "simple opacity press feedback."
**Example:**
```typescript
// Source: src/components/welcome/AuthOptionButton.tsx (established pattern)
<Pressable
  style={({ pressed }) => [
    styles.closeBtn,
    { opacity: pressed ? 0.7 : 1 },
  ]}
  onPress={handleDismiss}
>
  <Ionicons name="close" size={20} color="#FFFFFF" />
</Pressable>
```

### Pattern 3: Dismiss Navigation — router.replace
**What:** `router.replace('/(main)')` replaces the entire navigation stack so back-gesture cannot return to onboarding.
**When to use:** Final dismissal of a modal/onboarding flow — user should not be able to go back.
**Example:**
```typescript
// Confirmed pattern from CONTEXT.md + expo-router docs
const router = useRouter()
const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding)

const handleDismiss = () => {
  completeOnboarding()
  router.replace('/(main)')
}
```

### Pattern 4: Feature Bullet Row with Ionicons
**What:** `flexDirection: 'row'` View with an icon and Text. Mirrors existing `featureRow` style from current paywall.tsx but replaces checkmark text with an Ionicons component.
**Example:**
```typescript
// Icon-based bullet (upgrade from existing text checkmark pattern)
<View style={styles.featureRow}>
  <Ionicons name="ribbon" size={20} color={semantic.actionPrimary} />
  <Text style={styles.featureText}>Offline maps and field guides</Text>
</View>
```

### Pattern 5: Mixed-weight CTA text ("FREE" bold within sentence)
**What:** React Native supports inline text weight mixing via nested `<Text>` components. The outer `<Text>` sets base style; inner `<Text>` overrides `fontFamily` for the emphasised word.
**When to use:** Button.tsx renders `title` as a plain `Text` — it cannot handle mixed weight internally. Build the CTA as a custom Pressable rather than using `Button` component, OR override Button to accept ReactNode for title.
**Example:**
```typescript
// Custom CTA (recommended — simpler than modifying Button.tsx)
<Pressable style={styles.ctaButton} onPress={handleDismiss}>
  {({ pressed }) => (
    <Animated.View style={[styles.ctaInner, { opacity: pressed ? 0.85 : 1 }]}>
      <Text style={styles.ctaText}>
        Redeem your{' '}
        <Text style={styles.ctaTextBold}>FREE</Text>
        {' '}Week
      </Text>
    </Animated.View>
  )}
</Pressable>
```

### Anti-Patterns to Avoid
- **Using OnboardingLayout:** Context doc is explicit — standalone layout only. OnboardingLayout adds scroll + progress header chrome.
- **Using ScrollView for "just in case":** The design requires all content visible at once. If content overflows on small screens, fix spacing/font sizes rather than adding scroll.
- **Using Button.tsx for CTA when mixed weight is needed:** Button renders a plain string. Either build a custom Pressable for the CTA or pass a pre-styled Text as a child.
- **Using `router.push` instead of `router.replace`:** Push adds paywall to back stack; user could return to it via back gesture. Always `replace` for final dismiss.
- **Placing close button without safe area top inset:** Hero image is full-bleed to top edge. Without `insets.top`, the close button renders under the notch on iPhone X+.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon rendering | Custom SVG or unicode glyphs | `Ionicons` from `@expo/vector-icons` | Already installed; consistent sizing across platforms; handles iOS/Android rendering differences |
| Opacity press feedback | Reanimated animation | Pressable `({ pressed }) => style` pattern | `AuthOptionButton.tsx` already uses this; context doc says simple opacity, not spring |
| Navigation stack clear | Manual stack manipulation | `router.replace('/(main)')` | expo-router `replace` handles stack replacement natively |
| Onboarding completion flag | Local state or new store | `completeOnboarding()` from existing `useOnboardingStore` | Already exists in `src/stores/onboarding.ts`; no store changes needed |
| Image placeholder | External library | Inline `View` with `backgroundColor: semantic.bgTinted` | Zero deps; straightforward swap for `expo-image` Image when asset arrives |

---

## Common Pitfalls

### Pitfall 1: Content Overflows on Small Screens
**What goes wrong:** Paywall has 10 vertical sections. On iPhone SE (667pt screen height), 35% hero = ~233pt, leaving ~434pt for body + footer. With default spacing tokens this can overflow.
**Why it happens:** Fixed single-screen layout with no scroll safety net.
**How to avoid:** Use `spacing['3']` (12px) between body sections rather than `spacing['6']` (24px). Verify on a 667pt-height simulator before considering done. Use `flex: 1` with `justifyContent: 'space-evenly'` on the body zone to let React Native distribute space.
**Warning signs:** Content clips at bottom; footer links not visible without scroll.

### Pitfall 2: Close Button Hidden Under Notch
**What goes wrong:** Hero image is full-bleed from top. Close button positioned with hardcoded `top: 12` renders under the status bar on notched iPhones.
**Why it happens:** No safe area inset applied to the absolute-positioned overlay.
**How to avoid:** `const insets = useSafeAreaInsets()` then `top: insets.top + 12` for the close button.

### Pitfall 3: Ionicons Has No "Crown" — Wrong Icon Name Crashes App
**What goes wrong:** Searching for `crown` in Ionicons returns nothing. Passing an invalid name to `<Ionicons name="crown" />` silently renders nothing (no crash, but icon is invisible).
**Why it happens:** Context doc references SF Symbols crown which is Apple-specific; Ionicons does not include it.
**How to avoid:** Use `ribbon` (Ionicons confirmed — see research). If the user later wants a crown specifically, MaterialCommunityIcons has `crown` and `crown-outline`, but that requires an additional icon set import.
**Confirmed Ionicons available:** `ribbon`, `ribbon-outline`, `ribbon-sharp` — all present in the installed glyph map at `/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json`.

### Pitfall 4: Mixed-Weight Text Inside Button.tsx
**What goes wrong:** `Button` component renders `title` as `<Text>{title}</Text>`. Passing a string `"Redeem your FREE Week"` with all-caps bold "FREE" is impossible via the existing Button API.
**Why it happens:** Button.tsx was built for uniform-weight text labels.
**How to avoid:** Build the CTA as a custom `Pressable` inline in the paywall screen (applying `buttons.cta` style from `src/theme/components.ts`). Do NOT modify Button.tsx — that component is used widely.

### Pitfall 5: Social Proof Placeholder Layout Drift When Assets Swap
**What goes wrong:** Placeholder Views use arbitrary sizes; when real image assets arrive they have different aspect ratios, causing layout shift.
**Why it happens:** No explicit dimensions on placeholder containers.
**How to avoid:** Set explicit `width` and `height` on placeholder Views (e.g., 140x80). Use the same dimensions for `<Image>` when assets arrive. Document the expected dimensions in a code comment.

### Pitfall 6: `router.replace` Timing with Store Action
**What goes wrong:** Calling `completeOnboarding()` after `router.replace()` may not execute if navigation destroys the component.
**Why it happens:** Navigation is synchronous but component unmounting can interrupt subsequent JS execution.
**How to avoid:** Always call `completeOnboarding()` BEFORE `router.replace()`:
```typescript
const handleDismiss = () => {
  completeOnboarding()        // store update first
  router.replace('/(main)')   // then navigate
}
```

---

## Code Examples

### Full Screen Root with Safe Area
```typescript
// Mirrors pattern from welcome.tsx
import { View, StyleSheet, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { semantic } from '@/theme/colors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const HERO_HEIGHT = SCREEN_HEIGHT * 0.35

export default function PaywallScreen() {
  const insets = useSafeAreaInsets()
  // ...
  return (
    <View style={styles.root}>
      <View style={[styles.hero, { height: HERO_HEIGHT }]}>
        {/* placeholder */}
        <View style={[styles.heroBg, { backgroundColor: semantic.bgTinted }]} />
        {/* close button */}
        <Pressable
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={handleDismiss}
        >
          {({ pressed }) => (
            <View style={[styles.closeBtnCircle, { opacity: pressed ? 0.7 : 1 }]}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.body}>
        {/* 8 content sections */}
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        {/* CTA + footer links */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.bgPage },
  hero: { position: 'relative', overflow: 'hidden' },
  heroBg: { ...StyleSheet.absoluteFillObject },
  closeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  closeBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-evenly',
  },
  footer: {
    paddingHorizontal: 16,
    gap: 12,
  },
})
```

### Feature Bullet with Ionicons
```typescript
// Confirmed icon name from installed glyph map
import { Ionicons } from '@expo/vector-icons'
import { semantic } from '@/theme/colors'

const FEATURES = [
  'Offline maps and field guides',
  'Rare bird alerts in your area',
  'AI sighting reports',
]

// In JSX:
{FEATURES.map((feature) => (
  <View key={feature} style={styles.featureRow}>
    <Ionicons name="ribbon" size={18} color={semantic.actionPrimary} />
    <Text style={styles.featureText}>{feature}</Text>
  </View>
))}
```

### Mixed-Weight CTA Button
```typescript
// Custom Pressable — do not use Button.tsx for this
import { buttons } from '@/theme/components'
import { fontWeights } from '@/theme/typography'

<Pressable style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]} onPress={handleDismiss}>
  <Text style={styles.ctaText}>
    {'Redeem your '}
    <Text style={styles.ctaTextBold}>FREE</Text>
    {' Week'}
  </Text>
</Pressable>

// styles:
cta: {
  ...buttons.cta,
  alignItems: 'center',
},
ctaText: {
  fontFamily: fontWeights.semiBold,
  fontSize: 15,
  color: semantic.actionSecondaryText,
},
ctaTextBold: {
  fontFamily: fontWeights.bold,
  // uppercase can be done via textTransform or literal ALL CAPS in the string
},
```

### Footer Links Row
```typescript
// Three tappable links with separator dots (non-interactive)
<View style={styles.footerLinks}>
  <Pressable onPress={() => {}}>
    <Text style={styles.footerLink}>Terms of Use</Text>
  </Pressable>
  <Text style={styles.footerSep}> · </Text>
  <Pressable onPress={() => {}}>
    <Text style={styles.footerLink}>Restore Purchase</Text>
  </Pressable>
  <Text style={styles.footerSep}> · </Text>
  <Pressable onPress={() => {}}>
    <Text style={styles.footerLink}>Privacy Policy</Text>
  </Pressable>
</View>

// styles:
footerLinks: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
},
footerLink: {
  fontFamily: fontWeights.regular,
  fontSize: 12,
  color: semantic.textMuted,
},
footerSep: {
  fontFamily: fontWeights.regular,
  fontSize: 12,
  color: semantic.textMuted,
},
```

### Unlock Pill Badge
```typescript
// Centered pill with lock-open icon
<View style={styles.unlockPill}>
  <Ionicons name="lock-open-outline" size={14} color={semantic.actionPrimary} />
  <Text style={styles.unlockText}>Unlock all features</Text>
</View>

// styles:
unlockPill: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  alignSelf: 'center',
  backgroundColor: semantic.actionPrimaryBg,  // blue50 = '#C7E1FF'
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 999,
  borderCurve: 'continuous',
},
unlockText: {
  fontFamily: fontWeights.semiBold,
  fontSize: 13,
  color: semantic.actionPrimary,
},
```

### Trust Line with Green Checkmark
```typescript
// Green verification checkmark — markerCommon (#22C55E) is in the color system
import { colors } from '@/theme/colors'

<View style={styles.trustRow}>
  <Ionicons name="checkmark-circle" size={16} color={colors.markerCommon} />
  <Text style={styles.trustText}>No payment required · Cancel anytime</Text>
</View>
```

### Dismiss Navigation
```typescript
// Always completeOnboarding BEFORE router.replace
const router = useRouter()
const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding)

const handleDismiss = () => {
  completeOnboarding()
  router.replace('/(main)')
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Paywall used OnboardingLayout with scroll | Standalone fixed-screen layout (no scroll, no progress dots) | Phase 6 | Simpler, dedicated chrome; cleaner visual hierarchy |
| Pricing toggle (monthly/annual) | Static pricing display — removed entirely | Phase 6 | Eliminates state and animation complexity |
| Text checkmark `✓` for features | Ionicons `ribbon` icon | Phase 6 | Platform-consistent icon rendering |
| Multiple button variants for paywall | Single custom CTA Pressable + footer links | Phase 6 | Allows mixed-weight text in CTA label |

**Deprecated in this screen:**
- `useLocalSearchParams` for variant selection — no variant logic in new design
- `useState` for plan toggle — removed entirely
- Reanimated indicator animation for toggle — removed with toggle

---

## Open Questions

1. **Vertical fit on iPhone SE (smallest supported)**
   - What we know: Screen height 667pt; hero = 233pt; leaves ~434pt for body + footer
   - What's unclear: Whether 10 content sections fit with comfortable spacing
   - Recommendation: Use `justifyContent: 'space-evenly'` on body zone and target 12px gaps between sections. The planner should note this as a verification step.

2. **"FREE" all-caps — literal string or textTransform**
   - What we know: Context doc says "FREE in all-caps bold" — emphasis within CTA button label
   - What's unclear: Whether to use CSS `textTransform: 'uppercase'` or literal `"FREE"` string
   - Recommendation: Use literal `"FREE"` in the string. textTransform on a nested Text is unreliable in React Native.

3. **Social proof placeholder dimensions**
   - What we know: Two side-by-side image assets; user will provide later
   - What's unclear: Exact dimensions of provided assets
   - Recommendation: Planner should set each placeholder to 140 wide × 72 tall and document in a comment so they're easy to update.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, no vitest.config, no test/ directory |
| Config file | none |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAYW-04 | Hero image placeholder renders; close button visible top-right | manual-only | visual inspection in Expo Go | N/A |
| PAYW-05 | Headline + 3 feature bullets render with icons | manual-only | visual inspection | N/A |
| PAYW-06 | Social proof placeholders render side by side | manual-only | visual inspection | N/A |
| PAYW-07 | Pricing and annual line render correctly | manual-only | visual inspection | N/A |
| PAYW-08 | CTA reads "Redeem your FREE Week" with FREE bolded | manual-only | visual inspection | N/A |
| PAYW-09 | Footer links row renders and is tappable | manual-only | visual inspection | N/A |
| PAYW-10 | Dismiss navigates to `/(main)`, back gesture does not return to onboarding | manual-only | navigate in Expo Go, press hardware back | N/A |

**Manual-only justification:** This project has no test infrastructure (no jest, no testing-library/react-native). All requirements are visual/navigational; automated UI testing would require full setup of jest + react-native-testing-library which is out of scope for Phase 6.

### Wave 0 Gaps
None — no test infrastructure required for this phase. Manual verification via Expo Go covers all requirements.

---

## Sources

### Primary (HIGH confidence)
- Direct file read: `/Users/joaobborges/Developer/BIRDADEMO/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json` — confirmed icon names: `ribbon`, `ribbon-outline`, `lock-open`, `lock-open-outline`, `close`, `checkmark-circle`, `checkmark-circle-outline`
- Direct file read: `src/components/welcome/AuthOptionButton.tsx` — confirmed Pressable `({ pressed })` opacity pattern used in project
- Direct file read: `src/theme/colors.ts` — confirmed `markerCommon: '#22C55E'` for green checkmark, `actionPrimaryBg: blue50` for unlock pill background
- Direct file read: `src/stores/onboarding.ts` — confirmed `completeOnboarding()` action already present, no store changes needed
- Direct file read: `src/theme/components.ts` — confirmed `buttons.cta` style and `containers.fixedBottomCTA` values

### Secondary (MEDIUM confidence)
- expo-router documentation pattern for `router.replace` — consistent with all Phase 5 implementation patterns observed in codebase
- `useSafeAreaInsets` pattern verified in `app/(onboarding)/welcome.tsx`

### Tertiary (LOW confidence)
- Ionicons vs MaterialCommunityIcons crown icon alternative — WebSearch confirmed MaterialCommunityIcons has `crown` but not verified against installed version

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified as installed in package.json; icon names verified from installed glyph map
- Architecture: HIGH — patterns directly observed in existing Phase 5 code (welcome.tsx, AuthOptionButton.tsx)
- Pitfalls: HIGH — derived from direct inspection of existing patterns and known React Native constraints (nested Text weight, safe area insets)

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (stable dependencies; Ionicons glyph map changes only on major version bumps)
