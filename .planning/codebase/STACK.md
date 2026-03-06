# Technology Stack

**Analysis Date:** 2026-03-06

## Languages

**Primary:**
- TypeScript 5.9.2 - All application code (`src/`, `app/`)

**Secondary:**
- JavaScript - Metro bundler config only (`metro.config.js`)
- Objective-C / Swift - iOS native layer (managed by Expo, `ios/`)

## Runtime

**Environment:**
- React Native 0.83.2 (New Architecture enabled via `"newArchEnabled": true` in `app.json`)
- Expo SDK 55

**Package Manager:**
- npm
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- React 19.2.0 - UI component library
- React Native 0.83.2 - Cross-platform mobile framework
- Expo ~55.0.5 - Managed React Native platform
- Expo Router ~55.0.4 - File-based routing (`app/` directory)

**Animation & Gestures:**
- React Native Reanimated 4.2.1 - UI thread animations (shared values, animated styles, layout animations)
- React Native Gesture Handler ~2.30.0 - Gesture API (Tap, Pan gestures)
- React Native Worklets ^0.7.4 - Worklet runtime for Reanimated

**Testing:**
- None configured (no test runner, no test files)

**Build/Dev:**
- Metro bundler (Expo default) - configured in `metro.config.js`
- EAS Build (Expo Application Services) - configured in `eas.json`
- TypeScript ~5.9.2 - Type checking

## Key Dependencies

**Critical:**
- `expo-router` ~55.0.4 - File-based navigation; entry point is `expo-router/entry` (set in `package.json` `"main"`)
- `zustand` ^5.0.11 - Global state management with persist middleware
- `react-native-maps` 1.26.20 - Map rendering (Apple Maps on iOS, Google Maps on Android)
- `@react-native-async-storage/async-storage` 2.2.0 - Persistent key-value storage for Zustand state

**UI:**
- `expo-image` ~55.0.6 - High-performance image loading with transitions
- `expo-haptics` ~55.0.8 - Haptic feedback on button interactions
- `react-native-safe-area-context` ~5.6.2 - Safe area inset handling
- `react-native-screens` ~4.23.0 - Native screen containers for navigation
- `@legendapp/list` ^2.0.19 - High-performance list component (installed but not yet used in source)

**Infrastructure:**
- `expo-constants` ~55.0.7 - App constants and environment info
- `expo-linking` ~55.0.7 - Deep linking support
- `expo-status-bar` ~55.0.4 - Status bar configuration
- `expo-font` ~55.0.4 - Custom font loading

## Configuration

**TypeScript:**
- Config: `tsconfig.json` extends `expo/tsconfig.base`
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`

**Metro Bundler:**
- Config: `metro.config.js`
- `experimentalImportSupport: true` enabled in transformer

**Expo:**
- Config: `app.json`
- Orientation locked to portrait
- Scheme: `birda` (for deep linking)
- iOS bundle ID: `com.joaobborges.birda`
- Android package: `com.joaobborges.birda`
- Plugins: `expo-router`, `expo-image`, `expo-font`

**EAS Build:**
- Config: `eas.json`
- Three profiles: `development` (simulator, dev client), `preview` (internal APK), `production` (auto-increment)
- `APP_VARIANT` env var distinguishes build profiles

**Environment:**
- `.env` file present - contains environment configuration

## Platform Requirements

**Development:**
- Node.js (version not pinned, no `.nvmrc`)
- EAS CLI >= 12.0.0 (specified in `eas.json`)
- Xcode (for iOS simulator builds)
- iOS Simulator or physical device with Expo Dev Client

**Production:**
- iOS and Android (no web target beyond dev)
- New Architecture (Fabric/TurboModules) enabled

---

*Stack analysis: 2026-03-06*
