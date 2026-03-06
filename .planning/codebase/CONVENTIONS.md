# Coding Conventions

**Analysis Date:** 2026-03-06

## Naming Patterns

**Files:**
- Screen files: `kebab-case.tsx` (e.g., `app/(onboarding)/skill-level.tsx`)
- Component files: `PascalCase.tsx` (e.g., `src/components/ui/Button.tsx`, `src/components/onboarding/ProgressDots.tsx`)
- Store files: `camelCase.ts` (e.g., `src/stores/onboarding.ts`)
- Data files: `camelCase.ts` (e.g., `src/data/birds.ts`)
- Layout files: `_layout.tsx` (Expo Router convention)

**Functions:**
- Use `camelCase` for all functions and handlers
- Prefix event handlers with `handle`: `handleContinue`, `handleSubscribe`, `handleFree`, `handlePress`
- Prefix toggle functions with `toggle`: `toggleInterest`
- State setters follow `set` prefix: `setName`, `setLocation`, `setSkillLevel`

**Variables:**
- Use `camelCase` for all variables
- Constants (static config arrays) use `UPPER_SNAKE_CASE`: `LEVELS`, `BIRD_TYPES`, `NOTIFICATION_OPTIONS`, `FEATURES`, `SIGHTINGS`, `ACHIEVEMENTS`, `LISBON_REGION`
- Shared animation values use descriptive camelCase: `pressed`, `togglePosition`

**Types/Interfaces:**
- Use `PascalCase` for interfaces and type aliases
- Suffix props interfaces with `Props`: `ButtonProps`, `ProgressDotsProps`
- State interfaces suffixed with `State`: `OnboardingState`
- Data model interfaces are plain PascalCase: `Bird`, `Sighting`

**Components:**
- Use `PascalCase` for component names
- Screen components suffixed with `Screen`: `WelcomeScreen`, `NameScreen`, `MapScreen`
- Layout components suffixed with `Layout`: `RootLayout`, `OnboardingLayout`, `MainLayout`
- Screens export as `default`, reusable components use named exports

## Code Style

**Formatting:**
- No ESLint or Prettier config detected -- rely on editor defaults
- No semicolons at end of statements
- Single quotes for strings
- 2-space indentation (inferred from all files)
- Trailing commas in multi-line objects and arrays

**Linting:**
- No linter configured. No `.eslintrc`, `.prettierrc`, or `biome.json` present.
- TypeScript strict mode enabled in `tsconfig.json`

**TypeScript:**
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- Use explicit interface definitions for component props (never inline complex types)
- Use `as const` for type narrowing in constant arrays (e.g., `'beginner' as const` in `app/(onboarding)/skill-level.tsx`)
- Union types for constrained values: `'beginner' | 'intermediate' | 'advanced'`, `'primary' | 'secondary' | 'link'`, `'common' | 'uncommon' | 'rare'`
- Generic type parameters used with Zustand: `create<OnboardingState>()`

## Import Organization

**Order:**
1. React/React Native core imports (`react`, `react-native`)
2. Expo imports (`expo-router`, `expo-haptics`, `expo-image`, etc.)
3. Third-party libraries (`react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-maps`, `zustand`)
4. Internal imports using `@/` alias (`@/stores/onboarding`, `@/components/ui/Button`, `@/data/birds`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use `@/` for imports from `src/` directory

**Import Style:**
- Named imports for specific items: `import { Button } from '@/components/ui/Button'`
- Default imports for screen-level components (they export default)
- Namespace imports for libraries with many exports: `import * as Haptics from 'expo-haptics'`
- Destructured imports from Reanimated: `import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'`

## Component Patterns

**Screen Components (in `app/`):**
- Always export as `default function`
- Destructure `useRouter()` to get `push` or `replace`
- Destructure `useSafeAreaInsets()` to get `top` and `bottom`
- Apply safe area padding via inline styles: `{ paddingTop: top + 20, paddingBottom: bottom + 20 }`
- Follow a three-section layout pattern: header/progress, scrollable content, bottom actions

```tsx
export default function ExampleScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={N} />
      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        {/* Screen content */}
      </Animated.View>
      <View style={styles.actions}>
        <Button title="Continue" onPress={() => push('/(next)/route')} />
        <Button title="Skip" variant="link" onPress={() => push('/(next)/route')} />
      </View>
    </View>
  )
}
```

**Reusable Components (in `src/components/`):**
- Use named exports (not default): `export function Button(...)`
- Define a `Props` interface above the component
- Keep styles colocated in the same file via `StyleSheet.create()`

**Sub-Components within a screen file:**
- Define helper components in the same file (not separate files) when they are screen-specific
- Examples: `BirdMarker` and `BirdInfoCard` in `app/(main)/index.tsx`, `SightingItem` in `app/(main)/community.tsx`
- Use `memo()` for list item renderers: `const BirdMarker = memo(function BirdMarker(...) { ... })`

## Styling

**Approach:**
- Use `StyleSheet.create()` exclusively -- no styled-components or inline style objects
- Define `styles` const at bottom of file, after the component
- Compose styles using array syntax: `style={[styles.base, condition ? styles.variant : null]}`
- Use `null` (not `undefined`) for conditional style exclusion

**Design Tokens (hardcoded):**
- Primary dark green: `#1B4332`
- Secondary green: `#2D6A4F`
- Background: `#FAFAF8`
- Card background: `#FFFFFF`
- Text primary: `#1F2937`
- Text secondary: `#6B7280`
- Text tertiary: `#9CA3AF`
- Border: `#E5E7EB`
- Selected background: `#F0F7F4`
- Success/accent green background: `#D4EDDA`
- No theme/design-token system -- colors are repeated as hex literals throughout

**Common Style Patterns:**
- Border radius: 16 for cards/buttons, 12 for small elements, 24 for chips/pills
- Always use `borderCurve: 'continuous'` with `borderRadius` for iOS smooth corners
- Shadows use `boxShadow` string format: `'0 2px 8px rgba(0, 0, 0, 0.08)'` or `'0 2px 8px rgba(0, 0, 0, 0.12)'`
- Horizontal padding: 24 for screens, 20 for cards
- Gap for spacing between elements (not margin)

## Animation

**Library:** `react-native-reanimated` (v4) with `react-native-gesture-handler`

**Entrance Animations:**
- Use Reanimated layout animations: `FadeIn`, `FadeInDown`, `SlideInDown`
- Standard duration: 400ms for content, 300ms for cards
- Stagger with `.delay()`: `FadeInDown.delay(200).duration(400)`

**Gesture-Based Animations:**
- Use `Gesture.Tap()` from gesture handler (not `onPress` from Pressable) for animated buttons
- Use `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`
- Bridge JS callbacks with `runOnJS()` for haptic feedback and navigation

**Haptic Feedback:**
- Use `expo-haptics` with `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` on button presses

## State Management

**Global State:**
- Zustand stores with `persist` middleware and `AsyncStorage` backend
- Store hook naming: `useXxxStore` (e.g., `useOnboardingStore`)
- Access store outside React with `useOnboardingStore.getState()`
- Define state interface including actions (setters and commands together)

**Local State:**
- Use `useState` for UI-only state (e.g., modal visibility, selected plan)
- Use `useRef` for text input values that do not need re-renders (e.g., `nameRef` in `app/(onboarding)/name.tsx`)

## Error Handling

**Patterns:**
- Expo Router `ErrorBoundary` export convention used in `app/(main)/index.tsx`
- Pattern: export a named `ErrorBoundary` function alongside the default screen export
- Error boundary renders a retry button

```tsx
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Something went wrong loading the map.</Text>
      <Pressable style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>
  )
}
```

- No try/catch blocks observed in the codebase
- No global error handling or error reporting service

## Logging

**Framework:** None configured. No logging utility.
- `alert()` used in dev panel for quick debugging
- `console.*` not observed in production code

## Comments

**When to Comment:**
- Inline comments used sparingly for section labels: `{/* Floating top bar */}`, `{/* Bird info card */}`
- No JSDoc or TSDoc usage
- No file-level comments or module documentation

## Conditional Rendering

**Pattern:** Use ternary with `null` (never `&&` short-circuit):
```tsx
{condition ? <Component /> : null}
```
This is consistent across all files (`app/_layout.tsx`, `app/(main)/index.tsx`, `app/(onboarding)/paywall.tsx`, `app/(main)/profile.tsx`).

## Module Design

**Exports:**
- Screen files: single `export default function`
- Some screens also export `ErrorBoundary` as a named export
- Reusable components: named `export function`
- Stores: named `export const`
- Data: named `export const` and `export interface`

**Barrel Files:**
- Not used. All imports reference specific files directly.

---

*Convention analysis: 2026-03-06*
