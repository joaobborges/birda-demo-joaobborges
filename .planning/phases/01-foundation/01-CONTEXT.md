# Phase 1: Foundation - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Every screen draws from a single source of truth for styling, returning users never flash onboarding, and tooling catches bugs automatically. This phase sets up theme tokens, hydration guard, React Compiler, and ESLint rules. No new features or screens are added.

</domain>

<decisions>
## Implementation Decisions

### Color palette direction
- Use birda.org blue palette (#1F87FE primary, #2DD1E6 accent) — existing `src/theme/colors.ts` is the source of truth
- Replace all green-based hardcoded colors (#1B4332, #2D6A4F, etc.) with birda.org theme tokens
- Extend the semantic token system to include rarity colors (common/uncommon/rare badge backgrounds) and status colors (error red, success green)
- All screen backgrounds use single white (#FFFFFF / bgPage). Use #F8F8F8 (bgSurface) only for cards and secondary surfaces — no warm off-whites

### Token migration scope
- Replace ALL hardcoded hex values across every screen file in Phase 1 — one full sweep
- Files to touch: all `app/(onboarding)/*.tsx` (8 files), `app/(main)/*.tsx` (3 files), `src/components/**/*.tsx` (3 files)
- Zero hardcoded hex strings should remain in screen files after Phase 1
- Apply Rubik font globally in the same pass (already touching every file)

### Hydration transition
- Hold native splash screen (expo-splash-screen preventAutoHideAsync) until Zustand rehydrates from AsyncStorage
- After hydration: check onboarding completion state, navigate to map or onboarding, then hide splash
- User sees: native splash → destination screen (no flash of wrong screen)

### Linting strictness
- ESLint with required rules only: jsx-no-leaked-render (error) and barrel file detection
- TypeScript parser configured
- No Prettier, no formatting enforcement, no auto-fix on save
- Formatting stays editor-default (consistent with current no-semicolons, single-quotes convention)

### Claude's Discretion
- React Compiler (babel-plugin-react-compiler) setup and Babel plugin ordering with Reanimated
- Exact ESLint config structure and rule implementation details
- Hydration guard implementation pattern (root layout vs index redirect)
- How to handle the theme barrel export in `src/theme/index.ts` given no-barrel-files rule (likely exempt since it's the theme system, not a component barrel)

</decisions>

<specifics>
## Specific Ideas

- Theme token system already exists at `src/theme/` with colors, typography, spacing, and components files — build on this, don't recreate
- Rubik is the sole typeface (Google Font), matching birda.org brand identity
- Current codebase already uses ternary conditional rendering (no && short-circuit) — FOUN-04 lint rule will enforce this going forward

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/colors.ts`: Brand + neutral color scales with semantic tokens — extend with rarity/status tokens
- `src/theme/typography.ts`: Rubik font family and type scale — apply globally
- `src/theme/spacing.ts`: Spacing tokens — use during migration
- `src/theme/components.ts`: Border radius and button variant tokens
- `src/theme/index.ts`: Barrel export for all theme tokens

### Established Patterns
- `StyleSheet.create()` at bottom of every file — token migration replaces hex values inside existing StyleSheet calls
- `@/` path alias maps to `./src/*` — theme imports will use `@/theme` or `@/theme/colors`
- Conditional styles use array syntax: `[styles.base, condition ? styles.variant : null]`
- No barrel imports enforced by convention (but no lint rule yet)

### Integration Points
- `app/_layout.tsx`: Root layout — hydration guard lives here (wrap with splash screen hold)
- `app/index.tsx`: Root redirect — currently decides onboarding vs main (needs hydration awareness)
- `app.json`: Expo config — React Compiler plugin and expo-font config plugin go here
- `package.json`: Babel config — React Compiler + Reanimated plugin ordering

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-09*
