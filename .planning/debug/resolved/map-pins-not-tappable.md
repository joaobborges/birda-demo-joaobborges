---
status: resolved
trigger: "map bird pins are not tappable — regression from tappable area radius increase"
created: 2026-03-10T00:00:00Z
updated: 2026-03-10T00:00:00Z
---

## Current Focus

hypothesis: The 44x44 hitArea wrapper View inside the Marker causes overlapping transparent touch targets that intercept taps meant for adjacent markers; additionally the CaptureFAB overlay (zIndex: 10, StyleSheet.absoluteFillObject) may be stealing touches even when pointerEvents="none"
test: Examine z-index stacking and hit area overlap
expecting: Overlapping 44x44 hit areas on closely-spaced markers block onPress
next_action: Report diagnosis

## Symptoms

expected: Tapping a bird pin on the map opens the bottom sheet with bird details
actual: Taps on bird pins do not register / are not responsive
errors: None reported
reproduction: Tap any bird pin marker on the map screen
started: After commit 5e48bc4 (feat(08-01): map marker hit area + tab/navigation styling)

## Eliminated

- hypothesis: CaptureFAB overlay blocking all touches when closed
  evidence: overlay has pointerEvents={isOpen ? 'auto' : 'none'}, so when menu is closed it should pass touches through
  timestamp: 2026-03-10

- hypothesis: onPress handler is missing or broken
  evidence: onPress={() => onPress(bird)} is correctly wired in BirdMarker, and handleBirdPress correctly calls setSelectedBird + sheetRef.present()
  timestamp: 2026-03-10

## Evidence

- timestamp: 2026-03-10
  checked: git history for BirdMarker.tsx
  found: Commit 5e48bc4 added a 44x44 hitArea View wrapper around all marker variants (which are 14-18px). The anchor is {x:0.5, y:0.5}.
  implication: The 44x44 transparent View is the Marker's child — react-native-maps uses the child View dimensions to determine the marker's rendered size and touch area.

- timestamp: 2026-03-10
  checked: react-native-maps Marker behavior with custom children
  found: When a Marker has a custom child View, react-native-maps renders that View as the marker image. The native tap target is determined by the rendered View's bounds. With anchor={x:0.5, y:0.5}, the 44x44 area is centered on the coordinate.
  implication: Adjacent markers with 44x44 hit areas are very likely to overlap each other, especially at lower zoom levels where birds are close together.

- timestamp: 2026-03-10
  checked: CaptureFAB overlay implementation
  found: The overlay uses StyleSheet.absoluteFillObject with zIndex:10 and pointerEvents conditionally set. The fabColumn has zIndex:20. When the FAB menu is closed, overlay pointerEvents='none'.
  implication: The overlay should not block touches when FAB is closed. However, the fabColumn (zIndex:20, position:absolute, bottom:24, right:16) uses pointerEvents='box-none' which means it passes touches through the container but its children still receive touches — this is correct behavior and should not block map markers.

- timestamp: 2026-03-10
  checked: How react-native-maps handles overlapping Marker children
  found: The 44x44 hitArea is a transparent (no background color) View wrapping a 14-18px visible marker. On iOS, react-native-maps converts the Marker's child View to a bitmap image for the native MKAnnotationView. The native annotation view's frame becomes 44x44. When multiple 44x44 annotations overlap, iOS's native hit testing may prioritize the topmost annotation or fail to register taps on overlapped ones.
  implication: This is the primary suspect — the enlarged hit area creates overlapping native annotation views.

- timestamp: 2026-03-10
  checked: Supercluster configuration
  found: Cluster radius is 60 with maxZoom 16, minPoints 2. At high zoom levels markers un-cluster and can be very close together.
  implication: When markers un-cluster, their 44x44 hit areas (previously just 14-18px) now massively overlap, making many markers untappable.

## Resolution

root_cause: |
  TWO issues identified:

  **Primary: Oversized transparent hit area creates overlapping native annotation views**
  Commit 5e48bc4 wrapped each marker variant in a 44x44 transparent hitArea View. Since react-native-maps converts Marker children to native annotation bitmaps, the native annotation frame is now 44x44 instead of 14-18px. When markers are close together (especially after un-clustering at high zoom), these 44x44 native annotations overlap. iOS MKMapView hit-testing for overlapping annotations is unreliable — it often fails to deliver taps to the intended marker.

  **Secondary (potential): The hitArea View has no background color**
  On iOS, a transparent View rendered as a Marker child may result in a native annotation image with transparent pixels. iOS hit-testing on MKAnnotationView checks whether the tap point is within the annotation's bounds, but some configurations may skip transparent regions, making it appear that taps "fall through" to the map instead of triggering the marker's onPress.

fix: (not applied — diagnosis only)
verification: (not applied)
files_changed: []
