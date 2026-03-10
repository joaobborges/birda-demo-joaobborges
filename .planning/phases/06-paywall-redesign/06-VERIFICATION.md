---
phase: 06-paywall-redesign
verified: 2026-03-10T14:00:00Z
status: human_needed
score: 7/8 must-haves verified
gaps:
human_verification:
  - test: "Confirm PAYW-06 social proof intent is placeholder-only"
    expected: "Two side-by-side placeholder boxes (flex: 1, height 72, bgTinted) are sufficient for PAYW-06 — OR — boxes need visible text labels ('400+ birders', '4.7 stars') per the requirement description"
    why_human: "REQUIREMENTS.md says 'social proof (400+ happy birders, 4.7 stars)' but PLAN/VALIDATION redefines PAYW-06 as 'two placeholder boxes side by side.' The implementation has empty boxes with no text. Cannot determine from code alone whether the requirement was intentionally scoped to placeholders or whether the requirement description was the authoritative spec."
  - test: "Visual fit on small screen (iPhone SE)"
    expected: "All 10 content sections visible without clipping — hero, headline, 3 bullets, social row, unlock pill, pricing, trust line, CTA, footer links"
    why_human: "justifyContent: space-evenly distribution on body zone cannot be verified for overflow behavior without running the app on a small device"
  - test: "Back gesture blocked after dismiss"
    expected: "After tapping close (x) or CTA, swiping back does NOT return to paywall"
    why_human: "router.replace is used (not push), which is correct for preventing back navigation, but stack behavior can only be confirmed by running the app"
  - test: "CTA mixed-weight text renders correctly"
    expected: "'Redeem your FREE Week' with FREE visually bolder (bold weight) than the surrounding semiBold text"
    why_human: "Nested Text with different fontFamily values for bold/semiBold requires visual inspection to confirm weight difference is perceptible"
---

# Phase 6: Paywall Redesign — Verification Report

**Phase Goal:** Rewrite paywall as standalone conversion screen with hero, features, social proof, pricing, CTA, footer links. Both close and CTA navigate to home map.
**Verified:** 2026-03-10T14:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Paywall displays a full-bleed hero placeholder at ~35% screen height with a close (x) button in top-right | VERIFIED | `HERO_HEIGHT = Dimensions.get('window').height * 0.35`; hero View uses that height; close Pressable at `right: 16`, `top: insets.top + 12` with Ionicons `close` icon |
| 2 | Paywall shows 'Unlock the full experience' headline and 3 feature bullets with ribbon icons | VERIFIED | `Text` "Unlock the full experience" in headline style; `FEATURES` array of 3 items mapped with `Ionicons name="ribbon"` per row |
| 3 | Paywall shows two social proof placeholder boxes side by side | VERIFIED (code) / HUMAN NEEDED (content) | `socialRow` flexDirection row with two `socialBox` Views (flex: 1, height: 72, bgTinted). Code structure is correct but boxes are empty — REQUIREMENTS.md describes "400+ happy birders, 4.7 stars" content; see human verification item |
| 4 | Paywall shows pricing (3,33/month large, annual line small) with unlock pill above | VERIFIED | `priceMain` text "€3,33 /month" at fontSize 32; `priceAnnual` "€39,99 billed annually after trial" at caption size; unlock pill present above pricingBlock |
| 5 | CTA reads 'Redeem your FREE Week' with FREE in bold | VERIFIED | `ctaText` + nested `<Text style={styles.ctaTextBold}>FREE</Text>`; base style `fontWeights.semiBold`, bold style `fontWeights.bold` |
| 6 | Footer shows Terms of Use, Restore Purchase, Privacy Policy as tappable links | VERIFIED | Three `Pressable` elements wrapping `Text` in `footerLinks` row; each `onPress={() => {}}` (visual demo per spec) |
| 7 | Close button and CTA both call completeOnboarding() then router.replace('/(main)') to land on home map | VERIFIED | Single `handleDismiss` function used by both: `completeOnboarding()` called first, then `router.replace('/(main)')`; `/(main)` route confirmed at `app/(main)/index.tsx` (MapScreen) |
| 8 | Back gesture does not return to paywall after dismiss | VERIFIED (code) / HUMAN NEEDED (runtime) | `router.replace` (not `router.push`) used — correct for preventing back-stack entry; runtime confirmation needed |

**Score:** 7/8 truths fully verified programmatically; 1 truth structurally verified, content intent needs human confirmation

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/(onboarding)/paywall.tsx` | Complete paywall screen rewrite | VERIFIED | 264 lines; standalone layout with no OnboardingLayout import; contains `router.replace`, `completeOnboarding`, all 10 content sections |
| `src/stores/onboarding.ts` | `completeOnboarding` action | VERIFIED | `completeOnboarding: () => set({ completed: true })` at line 31 |
| `app/(main)/index.tsx` | Home map screen target | VERIFIED | `MapScreen` component at `app/(main)/index.tsx`; registered in `app/(main)/_layout.tsx` as `index` |
| `src/theme/components.ts` | `buttons.cta` token | VERIFIED | `buttons.cta` at line 23 with `backgroundColor: colors.blue500`, `borderRadius: borderRadius.full`, `borderCurve: 'continuous'` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/(onboarding)/paywall.tsx` | `src/stores/onboarding.ts` | `useOnboardingStore completeOnboarding` | WIRED | `completeOnboarding()` called at paywall line 25; pattern `completeOnboarding\(\)` confirmed present |
| `app/(onboarding)/paywall.tsx` | `/(main)` | `router.replace` | WIRED | `router.replace('/(main)')` at line 26; `/(main)` route confirmed to exist at `app/(main)/index.tsx` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PAYW-04 | 06-01-PLAN.md | Paywall displays hero image with close (x) button top-right | SATISFIED | Hero View at 35% height with absoluteFill placeholder and close Pressable at `right: 16, top: insets.top + 12` |
| PAYW-05 | 06-01-PLAN.md | Paywall shows "Unlock the full experience" with 3 feature bullet points | SATISFIED | Headline text literal + `FEATURES` array of 3 items with ribbon icons |
| PAYW-06 | 06-01-PLAN.md | Paywall shows social proof (400+ happy birders, 4.7 stars) | PARTIAL | Two `socialBox` placeholder Views exist side by side. REQUIREMENTS.md specifies "400+ happy birders, 4.7 stars" content; PLAN/VALIDATION scoped this to visual placeholders. Boxes are empty — no text. Needs human decision on whether placeholder satisfies intent. |
| PAYW-07 | 06-01-PLAN.md | Paywall shows pricing (3,33/month large, annual line small) | SATISFIED | `€3,33 /month` at fontSize 32 (bold); `€39,99 billed annually after trial` at caption size |
| PAYW-08 | 06-01-PLAN.md | Paywall CTA reads "Redeem your FREE Week" | SATISFIED | Nested Text: outer semiBold + inner `<Text style={ctaTextBold}>FREE</Text>` bold; CTA `onPress={handleDismiss}` |
| PAYW-09 | 06-01-PLAN.md | Paywall footer shows Terms of Use / Restore Purchase / Privacy Policy | SATISFIED | Three Pressables in `footerLinks` row with correct labels and middle-dot separators |
| PAYW-10 | 06-01-PLAN.md | Close button dismisses paywall and navigates to home screen | SATISFIED (code) | `handleDismiss` → `completeOnboarding()` + `router.replace('/(main)')`; back gesture blocked by `replace` semantics; runtime confirmation needed |

**Note on orphaned requirements:** No orphaned requirements. All 7 requirement IDs in the PLAN frontmatter appear in REQUIREMENTS.md mapped to Phase 6.

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `app/(onboarding)/paywall.tsx` lines 66, 68 | Empty `<View style={styles.socialBox} />` — no text content in social proof boxes | Info | Social proof boxes render as empty blue-tinted rectangles; placeholder per plan intent, but see PAYW-06 human verification item |

No TODO/FIXME/XXX comments found. No `return null` stubs. No ScrollView. No `router.push`. No OnboardingLayout import. No Reanimated import.

### Human Verification Required

#### 1. PAYW-06 Social Proof Content Intent

**Test:** Inspect the two side-by-side boxes at the social proof section of the paywall.
**Expected:** Determine whether empty placeholder boxes (blue-tinted, no text) satisfy PAYW-06, OR whether the boxes should display "400+ happy birders" and "4.7 stars" text content per the REQUIREMENTS.md description.
**Why human:** REQUIREMENTS.md defines PAYW-06 as "social proof (400+ happy birders, 4.7 stars)" but the PLAN/VALIDATION strategy redefines it as "two placeholder boxes side by side." The executor implemented empty boxes. Whether the requirement is met depends on whether the intent was visual structure or actual content text. This is a product decision.

#### 2. Visual Fit on Small Screens

**Test:** Open paywall in Expo Go on the smallest available device (iPhone SE if possible).
**Expected:** All 10 content sections (hero, headline, 3 bullets, social row, unlock pill, pricing block, trust line, CTA, footer links) are visible without any clipping or overflow.
**Why human:** `justifyContent: space-evenly` distributes space dynamically — cannot verify overflow safety at 320px screen width without running the app.

#### 3. Back Gesture Blocked After Dismiss

**Test:** Navigate to paywall through onboarding flow. Tap the close (x) button. Attempt to swipe back.
**Expected:** Swipe back gesture does not return to paywall — app stays on home map screen.
**Why human:** `router.replace` prevents back-stack entry by design, but Expo Router stack behavior depends on how the onboarding route group is configured — runtime verification required.

#### 4. CTA Mixed-Weight Text Rendering

**Test:** Inspect the CTA button in Expo Go.
**Expected:** "Redeem your FREE Week" — "FREE" visibly bolder/heavier than the surrounding text.
**Why human:** Nested `Text` with `fontWeights.bold` vs `fontWeights.semiBold` (Rubik_700Bold vs Rubik_600SemiBold) — weight difference must be visually perceptible, which requires rendering.

### Gaps Summary

No structural gaps. The implementation is substantive, fully wired, and passes all automated checks.

One item requires a product decision: PAYW-06 ("social proof") is implemented as two empty placeholder boxes. The requirement description in REQUIREMENTS.md specifies "400+ happy birders, 4.7 stars" as content, but the PLAN and VALIDATION strategy scoped this to visual placeholders. The current code has no text in these boxes. If the requirement intent was to show actual social proof copy (not just the layout), the boxes need text content added — approximately 15 minutes of work. If the placeholder intent was correct, PAYW-06 is fully satisfied.

All four human verification items are behavioral/visual and cannot be resolved programmatically.

---

_Verified: 2026-03-10T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
