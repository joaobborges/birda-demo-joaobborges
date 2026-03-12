---
status: resolved
trigger: "name screen title uses different font weight/style vs other onboarding screens"
created: 2026-03-10T00:00:00Z
updated: 2026-03-10T00:00:00Z
---

## Current Focus

hypothesis: name.tsx heading uses typography.subheading (medium weight, 22px) with bold override and manual fontSize, while other screens use typography.h2/h3 (regular weight, 30/26px)
test: compare heading style definitions across screens
expecting: confirm token mismatch
next_action: report findings

## Symptoms

expected: name screen title should use same heading token as other onboarding screens
actual: name screen heading looks visually different (bolder/smaller)
errors: none (visual inconsistency)
reproduction: compare name screen title against ai-bird-id or discover screen titles

## Evidence

- timestamp: 2026-03-10
  checked: name.tsx heading style (line 69-71)
  found: uses `...typography.subheading` then overrides with `fontFamily: fontWeights.bold` and `fontSize: 24`
  implication: base token is subheading (medium/22px) but nearly everything is overridden

- timestamp: 2026-03-10
  checked: ai-bird-id.tsx and discover.tsx heading style
  found: both use `...typography.h2` with no overrides (regular/30px/lineHeight 36)
  implication: consistent pattern among illustration screens

- timestamp: 2026-03-10
  checked: goals.tsx heading style
  found: uses `...typography.h3` with no overrides (regular/26px/lineHeight 31)
  implication: goals uses h3 (slightly smaller than h2 but same regular weight)

- timestamp: 2026-03-10
  checked: typography.ts token definitions
  found: |
    subheading = Rubik_500Medium / 22px / lineHeight 31
    h2 = Rubik_400Regular / 30px / lineHeight 36
    h3 = Rubik_400Regular / 26px / lineHeight 31
  implication: name screen ends up as Rubik_700Bold/24px vs Regular/30px or Regular/26px on other screens

## Resolution

root_cause: name.tsx uses `typography.subheading` as base then overrides fontFamily to bold and fontSize to 24. Other onboarding screens use `typography.h2` or `typography.h3` which are Regular weight (400). The effective style on name.tsx is Rubik_700Bold at 24px, whereas other screens are Rubik_400Regular at 26-30px.
fix: n/a (investigation only)
verification: n/a
files_changed: []
