# Phase 3: Map and Screens - Research

**Researched:** 2026-03-09
**Domain:** Map clustering, custom markers, navigation patterns, screen polish
**Confidence:** HIGH

## Summary

This phase transforms the existing map screen into a polished home experience with marker clustering via Supercluster, shape-coded rarity markers, a clean Apple Maps base, floating navigation UI with proper icons, and full-screen push screens for profile and community. The codebase already has all dependencies installed (react-native-maps 1.26.20, expo-router, @expo/vector-icons via expo). The only new dependency is `supercluster` (pure JS library, no native code).

The main technical challenges are: (1) integrating Supercluster with react-native-maps region changes, (2) rendering performant custom marker views with `tracksViewChanges={false}`, and (3) switching profile/community from formSheet to standard stack push while enabling proper headers.

**Primary recommendation:** Install `supercluster` as the sole new dependency. Use View-based custom markers (not SVG) for maximum compatibility. Set `tracksViewChanges={false}` on all markers since content is static. Replace emoji icons with Ionicons from `@expo/vector-icons`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Supercluster directly (skip react-native-map-clustering -- New Architecture compatibility risk)
- Cluster markers: solid Birda blue (#1F87FE) circle with white count number, fixed size
- Tap cluster: animate map zoom to expansion level
- Individual markers: shape + color encodes rarity (common=green circle, uncommon=orange diamond, rare=red star), 16-20px, solid fill, subtle white border
- Apple Maps `mutedStandard` mode with POIs filtered out
- Replace all emoji with Ionicons via `@expo/vector-icons` (already in Expo)
- Profile icon (top-left): 44px circular avatar thumbnail
- Community icon (top-right): people/group icon; Notification icon (top-right): bell with red dot
- Bottom buttons: icon + text label for "Capture" and "Logbook"
- Navigation: switch profile and community from `formSheet` to standard full-screen stack push
- Back navigation: native iOS back arrow (standard Stack header)
- Profile avatar: SF Symbol person icon on colored circular background (no DiceBear URL)
- Achievement badges: replace emoji with Ionicons on soft-colored circular backgrounds
- Community feed: add visual-only like count (heart icon + mock number, static)
- Component extraction: BirdMarker to `src/components/map/BirdMarker.tsx`, BirdInfoCard to `src/components/map/BirdInfoCard.tsx`, named exports

### Claude's Discretion
- Supercluster configuration (radius, minZoom, maxZoom)
- Exact Ionicons icon names for each use case
- Map zoom animation duration and easing for cluster tap
- POI filter configuration specifics
- Exact marker shapes and dimensions
- Like count mock data values on community cards
- Stack header styling (title, back button label text)

### Deferred Ideas (OUT OF SCOPE)
- Sighting detail view (tap a community card to see full sighting)
- Achievement detail form sheet (tap an achievement for more info)
- Notification screen/list -- notifications are visual-only indicator
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MAP-01 | Bird markers cluster automatically at lower zoom levels | Supercluster library integration: load bird data as GeoJSON, getClusters on region change, getClusterExpansionZoom on tap |
| MAP-02 | Map has floating UI overlay -- profile icon (top-left), community + notification icons (top-right), capture + logbook buttons (bottom) | Ionicons icon names verified; existing floating UI pattern already in place, needs icon swap |
| MAP-03 | BirdMarker and BirdInfoCard extracted to src/components/map/ as reusable components | Straightforward extraction from index.tsx; named exports per project convention |
| SCRN-01 | Profile screen opens with avatar, username, skill badge, and mock achievement badges | Stack push with headerShown:true; Ionicons for avatar and achievements; existing store data |
| SCRN-02 | Community screen opens with LegendList feed of mock bird sightings | Stack push with headerShown:true; add heart icon + count to SightingItem cards |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| supercluster | ^8.0.1 | Geospatial point clustering | Mapbox's official clustering library; pure JS, no native code; fast KD-tree index |
| react-native-maps | 1.26.20 (installed) | Map rendering + markers | Already in project; Apple Maps provider on iOS |
| @expo/vector-icons | (bundled with expo) | Ionicons icons | Already available; no new dependency needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-reanimated | 4.2.1 (installed) | Marker entrance animations | Already used for FadeIn, SlideInDown on map UI |
| expo-image | (installed) | Bird photos in info card | Already used in BirdInfoCard and community feed |
| @legendapp/list | (installed) | Community feed list | Already used in CommunityScreen |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| supercluster (JS) | react-native-map-clustering | Wrapper lib has New Architecture/Fabric compatibility risk (user decision to avoid) |
| supercluster (JS) | react-native-clusterer (C++ JSI) | Faster but adds native dependency; 20 birds don't need C++ perf |
| View-based markers | react-native-svg markers | SVG markers have documented rendering bugs on iOS with react-native-maps 1.26.x |

**Installation:**
```bash
npm install supercluster
npm install --save-dev @types/supercluster
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── map/
│   │   ├── BirdMarker.tsx       # Individual bird marker (shape-coded by rarity)
│   │   └── BirdInfoCard.tsx     # Slide-up info card for selected bird
│   ├── ui/                      # Existing UI components
│   └── onboarding/              # Existing onboarding components
├── data/
│   └── birds.ts                 # Bird data (existing, add GeoJSON helper)
├── stores/
│   └── onboarding.ts            # User name/journey (existing)
└── theme/
    └── colors.ts                # Add solid rarity marker colors
```

### Pattern 1: Supercluster Integration with react-native-maps
**What:** Convert bird data to GeoJSON, create Supercluster index once, query on every region change
**When to use:** Every time the map region changes (onRegionChangeComplete)
**Example:**
```typescript
// Source: https://github.com/mapbox/supercluster
import Supercluster from 'supercluster'
import { Bird, birds } from '@/data/birds'
import { Region } from 'react-native-maps'

// Convert birds to GeoJSON points (do this once, outside component)
const geoJsonPoints = birds.map((bird) => ({
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [bird.longitude, bird.latitude],
  },
  properties: bird,
}))

// Create and load the index (do this once, outside component or useMemo)
const clusterIndex = new Supercluster({
  radius: 60,        // cluster radius in pixels
  maxZoom: 16,       // stop clustering at this zoom
  minZoom: 0,
  minPoints: 2,      // minimum points to form a cluster
})
clusterIndex.load(geoJsonPoints)

// In component: get clusters for current viewport
function getClustersForRegion(region: Region) {
  const bbox: [number, number, number, number] = [
    region.longitude - region.longitudeDelta / 2,  // west
    region.latitude - region.latitudeDelta / 2,     // south
    region.longitude + region.longitudeDelta / 2,   // east
    region.latitude + region.latitudeDelta / 2,     // north
  ]
  const zoom = Math.round(Math.log2(360 / region.longitudeDelta))
  return clusterIndex.getClusters(bbox, zoom)
}
```

### Pattern 2: Cluster Tap to Zoom
**What:** On cluster tap, get expansion zoom and animate map
**When to use:** When user taps a cluster marker
**Example:**
```typescript
// Source: https://github.com/mapbox/supercluster
const mapRef = useRef<MapView>(null)

function handleClusterPress(clusterId: number, latitude: number, longitude: number) {
  const expansionZoom = clusterIndex.getClusterExpansionZoom(clusterId)
  // Convert zoom level to delta (approximate)
  const latitudeDelta = 360 / Math.pow(2, expansionZoom + 1)
  const longitudeDelta = 360 / Math.pow(2, expansionZoom + 1)

  mapRef.current?.animateToRegion(
    { latitude, longitude, latitudeDelta, longitudeDelta },
    350  // animation duration ms
  )
}
```

### Pattern 3: Custom View Markers with tracksViewChanges
**What:** Render View children inside Marker for custom shapes; disable tracking for performance
**When to use:** All bird markers and cluster markers
**Example:**
```typescript
// Source: react-native-maps marker docs
<Marker
  coordinate={{ latitude, longitude }}
  tracksViewChanges={false}  // CRITICAL for performance
  onPress={handlePress}
>
  <View style={[styles.markerCircle, { backgroundColor: markerColor }]}>
    {/* For clusters: show count */}
    <Text style={styles.clusterCount}>{pointCount}</Text>
  </View>
</Marker>
```

### Pattern 4: Stack Navigation with Headers (replacing formSheet)
**What:** Change profile/community from formSheet modal to standard card push with native header
**When to use:** _layout.tsx configuration
**Example:**
```typescript
// Source: expo-router docs
// app/(main)/_layout.tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen
    name="profile"
    options={{
      headerShown: true,
      title: 'Profile',
      // presentation defaults to 'card' (full-screen push)
    }}
  />
  <Stack.Screen
    name="community"
    options={{
      headerShown: true,
      title: 'Community Sightings',
    }}
  />
</Stack>
```

### Anti-Patterns to Avoid
- **Using react-native-svg inside Marker children:** Documented rendering bugs on iOS with react-native-maps 1.26.x. Use plain View + border styling instead.
- **Leaving tracksViewChanges={true} (default):** Causes continuous high CPU load with custom markers. Always set to false for static markers.
- **Recomputing Supercluster index on every render:** Load GeoJSON once; only call getClusters on region change. The index is immutable after load().
- **Using && for conditional rendering:** Project convention requires ternary operator (established in Phase 2).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Marker clustering | Custom spatial clustering algorithm | supercluster | KD-tree based, handles edge cases (international date line, polar regions, cluster expansion) |
| Zoom-level calculation | Manual delta-to-zoom math | `getClusterExpansionZoom(clusterId)` | Supercluster knows exact break points |
| Icon rendering | Custom SVG icon components | `@expo/vector-icons/Ionicons` | 1300+ icons already bundled with Expo |
| List virtualization | Custom FlatList for community feed | `@legendapp/list` (LegendList) | Already in project, handles recycling |

**Key insight:** With only 20 birds, the clustering is more about UX polish than performance. Supercluster handles the spatial math correctly; hand-rolling clustering for a demo would waste time on edge cases.

## Common Pitfalls

### Pitfall 1: Supercluster Longitude/Latitude Ordering
**What goes wrong:** GeoJSON uses [longitude, latitude] order, but react-native-maps uses {latitude, longitude}. Easy to swap them.
**Why it happens:** GeoJSON follows [x, y] convention; maps use [lat, lng].
**How to avoid:** Always construct coordinates as `[bird.longitude, bird.latitude]` for Supercluster input, and `{ latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0] }` for Marker output.
**Warning signs:** Markers appear in the ocean or wrong continent.

### Pitfall 2: tracksViewChanges Performance Drain
**What goes wrong:** Map becomes sluggish with custom View markers, high CPU usage even when idle.
**Why it happens:** `tracksViewChanges` defaults to `true`, causing continuous re-rendering of marker bitmaps.
**How to avoid:** Set `tracksViewChanges={false}` on every custom marker. Content is static (shapes don't change).
**Warning signs:** CPU usage stays above 30% when map is idle with markers visible.

### Pitfall 3: showsPointsOfInterest Bug on iOS
**What goes wrong:** Setting `showsPointsOfInterest={false}` may not actually hide POIs on react-native-maps 1.25+.
**Why it happens:** Known bug in recent react-native-maps versions with Apple Maps.
**How to avoid:** Use `mapType="mutedStandard"` which already reduces POI visibility significantly. Additionally try `pointOfInterestFilter={[]}` (empty array) which takes precedence over `showsPointsOfInterest`.
**Warning signs:** Restaurants, shops still visible on the map despite configuration.

### Pitfall 4: Custom Marker Anchor Point
**What goes wrong:** Custom View markers don't point to the exact coordinate -- they're offset.
**Why it happens:** Default anchor is top-left of the custom view. For centered markers (circles/diamonds/stars), anchor should be center.
**How to avoid:** Set `anchor={{ x: 0.5, y: 0.5 }}` on Marker when using centered custom views.
**Warning signs:** Markers visually shift when zooming in/out.

### Pitfall 5: Missing borderCurve on New Views
**What goes wrong:** New UI elements (marker circles, achievement badges, etc.) look slightly different from rest of app.
**Why it happens:** STYL-01 requires `borderCurve: 'continuous'` on all borderRadius elements.
**How to avoid:** Add `borderCurve: 'continuous'` to every StyleSheet entry that has `borderRadius`.
**Warning signs:** Subtle visual inconsistency between new and existing elements.

## Code Examples

### Ionicons Icon Names for This Phase

```typescript
// Source: https://ionic.io/ionicons
// Import pattern:
import Ionicons from '@expo/vector-icons/Ionicons'

// Map floating UI:
<Ionicons name="person-circle-outline" size={28} />     // Profile (or use View avatar)
<Ionicons name="people-outline" size={24} />             // Community
<Ionicons name="notifications-outline" size={24} />      // Notifications
<Ionicons name="camera-outline" size={20} />             // Capture button
<Ionicons name="book-outline" size={20} />               // Logbook button

// Profile achievements:
<Ionicons name="sunny-outline" size={24} />              // Early Bird (sunrise)
<Ionicons name="eye-outline" size={24} />                // Sharp Eye
<Ionicons name="camera-outline" size={24} />             // Photographer
<Ionicons name="compass-outline" size={24} />            // Explorer

// Community feed:
<Ionicons name="heart-outline" size={16} />              // Like count icon
```

### Rarity Marker Colors (Solid Variants)

```typescript
// Add to src/theme/colors.ts
// Existing pastel backgrounds need solid counterparts for map markers:
export const colors = {
  // ... existing ...

  // Solid marker colors for map (double-encoding rarity):
  markerCommon: '#22C55E',    // Green -- common birds
  markerUncommon: '#F59E0B',  // Orange -- uncommon birds
  markerRare: '#EF4444',      // Red -- rare birds
  markerCluster: '#1F87FE',   // Birda blue -- clusters
}
```

### BirdMarker Component Shape Rendering

```typescript
// src/components/map/BirdMarker.tsx
// Shapes encoded via View styling (no SVG dependency needed):
// Circle: borderRadius = size/2
// Diamond: 45deg rotation with overflow hidden
// Star: Use Ionicons 'star' icon inside colored circle

// Diamond marker example:
const diamondStyle = {
  width: 14,
  height: 14,
  backgroundColor: colors.markerUncommon,
  transform: [{ rotate: '45deg' }],
  borderWidth: 1.5,
  borderColor: '#FFFFFF',
  borderCurve: 'continuous' as const,
}

// Star marker example -- use icon inside circle:
<View style={[styles.starMarker, { backgroundColor: colors.markerRare }]}>
  <Ionicons name="star" size={10} color="#FFFFFF" />
</View>
```

### MapView Configuration

```typescript
// Source: react-native-maps docs
<MapView
  ref={mapRef}
  style={styles.map}
  initialRegion={LISBON_REGION}
  onRegionChangeComplete={handleRegionChange}
  showsUserLocation
  showsCompass={false}
  mapType="mutedStandard"              // Muted colors, cleaner base
  showsPointsOfInterest={false}        // Hide POIs
  pointOfInterestFilter={[]}           // Fallback: empty filter array
  showsBuildings={false}               // Cleaner map
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-native-map-clustering wrapper | Direct supercluster usage | 2024+ (New Arch) | Avoids Fabric compatibility issues |
| Emoji icons in UI | @expo/vector-icons Ionicons | Expo SDK 52+ | Consistent, scalable, accessible |
| formSheet modal screens | Stack card push | Design decision | Enables future drill-down without modal stacking |
| DiceBear avatar URL | Local Ionicons person icon | Phase 3 decision | No external dependency, faster load |

**Deprecated/outdated:**
- `react-native-map-clustering`: Last updated sporadically; New Architecture support unverified. Avoid.
- `showsPointsOfInterest` prop alone: Has known bug in react-native-maps 1.25+. Combine with `pointOfInterestFilter={[]}` and `mapType="mutedStandard"`.

## Open Questions

1. **Diamond marker rendering fidelity**
   - What we know: CSS rotation of a square creates a diamond shape. It works but may look slightly rough at small sizes.
   - What's unclear: Whether a 14px rotated square renders cleanly enough on retina screens, or if an Ionicons diamond icon would look better.
   - Recommendation: Try View rotation first. If it looks poor at small sizes, fall back to `<Ionicons name="diamond" />` inside a colored container.

2. **pointOfInterestFilter empty array behavior**
   - What we know: The prop takes precedence over `showsPointsOfInterest`. An empty array should hide all POIs.
   - What's unclear: Whether this workaround fully resolves the known bug in react-native-maps 1.26.x on iOS.
   - Recommendation: Apply both `showsPointsOfInterest={false}` and `pointOfInterestFilter={[]}` as belt-and-suspenders.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-01 | Markers cluster at lower zoom levels | manual-only | Visual verification: zoom out on map | N/A |
| MAP-02 | Floating UI overlay with correct icons | manual-only | Visual verification: check all icons render | N/A |
| MAP-03 | BirdMarker and BirdInfoCard in src/components/map/ | smoke | `ls src/components/map/BirdMarker.tsx src/components/map/BirdInfoCard.tsx` | Wave 0 |
| SCRN-01 | Profile opens as push screen with avatar, badges | manual-only | Visual verification: tap profile icon | N/A |
| SCRN-02 | Community opens as push screen with sighting feed | manual-only | Visual verification: tap community icon | N/A |

### Sampling Rate
- **Per task commit:** `npx expo lint` (ESLint check)
- **Per wave merge:** Visual manual check of all 5 requirements on device/simulator
- **Phase gate:** Full visual walkthrough before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test framework installed -- testing is explicitly out of scope per REQUIREMENTS.md ("Architecture should be testable -- mention testing approach in conversation")
- [ ] File existence check for MAP-03 is the only automatable verification

## Sources

### Primary (HIGH confidence)
- [supercluster GitHub](https://github.com/mapbox/supercluster) - Full API docs, options, methods
- [react-native-maps mapview docs](https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md) - mapType, showsPointsOfInterest, pointOfInterestFilter
- [react-native-maps marker docs](https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md) - tracksViewChanges, custom view markers, anchor
- [Expo icons guide](https://docs.expo.dev/guides/icons/) - @expo/vector-icons usage
- [Ionicons directory](https://ionic.io/ionicons) - Icon name lookup
- [Expo Router modals docs](https://docs.expo.dev/router/advanced/modals/) - formSheet, presentation options

### Secondary (MEDIUM confidence)
- [react-native-maps issue #5676](https://github.com/react-native-maps/react-native-maps/issues/5676) - showsPointsOfInterest bug confirmation
- [react-native-maps issue #5402](https://github.com/react-native-maps/react-native-maps/issues/5402) - Performance with custom markers on New Architecture
- [react-native-maps issue #5406](https://github.com/react-native-maps/react-native-maps/issues/5406) - SVG marker rendering bugs

### Tertiary (LOW confidence)
- Ionicons icon names verified by naming convention pattern (person-circle-outline, people-outline, etc.) but not individually tested in app -- validated during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - supercluster is well-documented, react-native-maps already installed and working
- Architecture: HIGH - patterns verified against official docs; existing codebase patterns are clear
- Pitfalls: HIGH - multiple sources confirm tracksViewChanges, POI bug, GeoJSON coordinate ordering issues

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable libraries, low churn)
