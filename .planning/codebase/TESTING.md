# Testing Patterns

**Analysis Date:** 2026-03-06

## Test Framework

**Runner:**
- No test framework configured
- No `jest`, `vitest`, or any test runner in `package.json` dependencies or devDependencies
- No test configuration files (`jest.config.*`, `vitest.config.*`) present

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
# No test scripts defined in package.json
# Only scripts present: start, android, ios, web
```

## Test File Organization

**Location:**
- No test files exist in the project
- No `__tests__/` directories
- No `*.test.*` or `*.spec.*` files

**Naming:**
- Not established

**Structure:**
- Not established

## Test Structure

**Suite Organization:**
- Not established. No tests exist in the codebase.

## Mocking

**Framework:** Not applicable

**Patterns:**
- Not established

## Fixtures and Factories

**Test Data:**
- Not applicable

**Note:** Static mock data exists in the application code itself:
  - `src/data/birds.ts` - hardcoded bird data array (20 entries)
  - `app/(main)/community.tsx` - hardcoded `SIGHTINGS` array (6 entries)
  - `app/(main)/profile.tsx` - hardcoded stats and achievements
  - These could serve as fixtures when testing is introduced

## Coverage

**Requirements:** None enforced
**View Coverage:** Not applicable

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented
- No Detox, Maestro, or other mobile E2E framework configured

## Recommendations for Establishing Testing

When adding tests to this project, consider:

**Recommended Setup:**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo
```

**Suggested `package.json` script:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Priority Areas for First Tests:**

1. **Zustand Store** (`src/stores/onboarding.ts`):
   - Pure logic, no UI dependencies
   - Test state transitions: `setName`, `setLocation`, `setSkillLevel`, `setInterests`, `completeOnboarding`, `reset`
   - Test persistence integration with AsyncStorage mock

2. **Utility Functions** (`app/(main)/index.tsx` - `getVisibleBirds`):
   - Pure function that filters birds by zoom level and rarity
   - Extract to `src/utils/` for testability

3. **Reusable Components** (`src/components/ui/Button.tsx`, `src/components/onboarding/ProgressDots.tsx`):
   - Test rendering with different props/variants
   - Test gesture interactions on Button

**Suggested Test File Locations:**
- Co-locate tests next to source files: `src/stores/__tests__/onboarding.test.ts`
- Or `src/stores/onboarding.test.ts` (adjacent pattern)
- Component tests: `src/components/ui/__tests__/Button.test.tsx`

**Zustand Store Test Pattern (example):**
```typescript
import { useOnboardingStore } from '@/stores/onboarding'

beforeEach(() => {
  useOnboardingStore.getState().reset()
})

describe('onboarding store', () => {
  it('sets name', () => {
    useOnboardingStore.getState().setName('Alice')
    expect(useOnboardingStore.getState().name).toBe('Alice')
  })

  it('completes onboarding', () => {
    useOnboardingStore.getState().completeOnboarding()
    expect(useOnboardingStore.getState().completed).toBe(true)
  })

  it('resets to initial state', () => {
    useOnboardingStore.getState().setName('Alice')
    useOnboardingStore.getState().completeOnboarding()
    useOnboardingStore.getState().reset()
    expect(useOnboardingStore.getState().name).toBe('')
    expect(useOnboardingStore.getState().completed).toBe(false)
  })
})
```

---

*Testing analysis: 2026-03-06*
