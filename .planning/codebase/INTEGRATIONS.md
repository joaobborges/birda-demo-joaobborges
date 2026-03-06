# External Integrations

**Analysis Date:** 2026-03-06

## APIs & External Services

**Maps:**
- Apple Maps (iOS) / Google Maps (Android) - Bird sighting map display
  - SDK/Client: `react-native-maps` 1.26.20
  - Auth: Apple Maps requires no API key on iOS; Google Maps would require a key for Android (not yet configured in `app.json`)
  - Usage: `app/(main)/index.tsx` renders `MapView` with bird markers

**Image CDN:**
- Wikimedia Commons - Bird images loaded via direct URLs
  - Client: `expo-image` component
  - Auth: None (public URLs)
  - Usage: Hardcoded image URLs in `src/data/birds.ts`

## Data Storage

**Databases:**
- None - All data is hardcoded in `src/data/birds.ts` (20 bird entries with coordinates around Lisbon)

**Local Storage:**
- AsyncStorage (`@react-native-async-storage/async-storage`)
  - Purpose: Persists Zustand onboarding state across app restarts
  - Storage key: `onboarding-storage`
  - Implementation: `src/stores/onboarding.ts` uses `zustand/middleware` `persist` with `createJSONStorage(() => AsyncStorage)`

**File Storage:**
- Local filesystem only (no cloud file storage)

**Caching:**
- `expo-image` handles image caching internally
- No explicit caching layer

## Authentication & Identity

**Auth Provider:**
- None - No authentication system implemented
- No user accounts, no login flow
- Onboarding collects name and preferences but stores locally only

## Monitoring & Observability

**Error Tracking:**
- None - No crash reporting or error tracking service

**Logs:**
- Console only (development)
- No structured logging

## CI/CD & Deployment

**Hosting:**
- EAS Build (Expo Application Services) for native binary builds
- Three build profiles configured in `eas.json`:
  - `development`: iOS simulator, dev client
  - `preview`: Internal distribution (Android APK)
  - `production`: Auto-incrementing version

**CI Pipeline:**
- None configured (no GitHub Actions, no CI config files)

## Environment Configuration

**Required env vars:**
- `APP_VARIANT` - Set by EAS build profiles (`development`, `preview`, `production`)

**Env file:**
- `.env` file present (contents not inspected per security policy)

**Secrets location:**
- No secrets management system
- `.env` file in project root

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## In-App Purchases

**Status:** Not implemented
- Paywall UI exists at `app/(onboarding)/paywall.tsx` with pricing display ($4.99/mo, $39.99/yr)
- Subscribe and free-plan buttons both call `completeOnboarding()` and navigate to main screen
- No actual payment SDK integrated (no RevenueCat, StoreKit, or Google Play Billing)

## Deep Linking

**Scheme:** `birda://`
- Configured in `app.json` under `"scheme": "birda"`
- `expo-linking` installed for URL handling
- No specific deep link routes configured beyond Expo Router defaults

## Push Notifications

**Status:** Not implemented
- Onboarding screen exists at `app/(onboarding)/notifications.tsx` (notification permission prompt UI)
- No push notification SDK installed (no `expo-notifications`)
- Notification bell icon rendered in map screen (`app/(main)/index.tsx`) but non-functional

---

*Integration audit: 2026-03-06*
