---
status: resolved
trigger: "bird images in BirdMosaic have bird faces cropped out of composition"
created: 2026-03-10T00:00:00Z
updated: 2026-03-10T00:00:00Z
---

## Current Focus

hypothesis: contentFit="cover" with default center contentPosition crops heads on tall portrait images rendered in wide short containers
test: visual analysis of image aspect ratios vs container aspect ratios
expecting: portrait images lose top portion (heads) when squeezed into landscape containers
next_action: report findings

## Symptoms

expected: Bird faces/heads visible and well-composed in mosaic tiles and card images
actual: Bird faces cropped out, especially in short wide containers
errors: none (visual issue)
reproduction: visible in BirdMosaic tiles (140-200px height, ~33vw width) and card images (160-200px height, full width)
started: since implementation

## Eliminated

(none)

## Evidence

- timestamp: 2026-03-10
  checked: all 5 components using bird images
  found: all use contentFit="cover" with NO contentPosition specified (defaults to "center")
  implication: expo-image centers the image both horizontally and vertically when scaling to cover

- timestamp: 2026-03-10
  checked: image source files in src/assets/birds/
  found: mixed aspect ratios - some landscape (robin, flamingo, hoopoe, eagle-owl, bee-eater, stork), some square-ish (kingfisher), some tall portrait (grey-heron, peregrine-falcon, black-stork)
  implication: portrait images are the primary problem - when rendered in landscape containers, center-crop removes top AND bottom equally, cutting off heads

- timestamp: 2026-03-10
  checked: grey-heron.jpg composition
  found: tall portrait orientation, bird's head is in the TOP ~15% of the frame, body fills center/bottom
  implication: in a 200px-tall full-width container, center-crop would slice off the top portion containing the head entirely

- timestamp: 2026-03-10
  checked: peregrine-falcon.jpg composition
  found: tall portrait, bird perched at top of frame, head in upper ~20%
  implication: same problem - center crop loses the head

- timestamp: 2026-03-10
  checked: black-stork.jpg composition
  found: very tall portrait, birds' heads in upper ~30% of frame
  implication: center crop in a wide container would cut heads

- timestamp: 2026-03-10
  checked: BirdMosaic tile dimensions
  found: tiles are ~33% viewport width (3 columns with 16px gaps) x 140-200px height. On a 390px phone that's roughly 106px wide x 140-200px tall
  implication: mosaic tiles are actually more portrait-shaped than landscape, so landscape source images would lose left/right (less head-cropping). But portrait source images fit better here. The WORST cropping is in cards (full-width x 160-200px = very landscape containers)

- timestamp: 2026-03-10
  checked: container aspect ratios across all 5 components
  found: |
    BirdMosaic tiles: ~106x140-200px (portrait-ish, ~0.6 ratio) - least problematic
    BirdInfoCard: full-width x 160px (very landscape, ~2.4 ratio) - problematic for portrait images
    BirdDrawerContent: full-width x 200px (landscape, ~1.95 ratio) - problematic for portrait images
    bird-detail hero: full-width x 300px (landscape, ~1.3 ratio) - moderate, more height helps
    community cards: full-width x 200px (landscape, ~1.95 ratio) - problematic for portrait images
  implication: the 4 card/hero contexts are the worst offenders for portrait bird images

## Resolution

root_cause: |
  The cropping issue stems from TWO interacting factors:

  1. **Mixed source image aspect ratios**: The bird photo set includes landscape (~1.3:1), square (~1:1), and tall portrait (~0.6:1 to ~0.75:1) images. Portrait images like grey-heron, peregrine-falcon, and black-stork have the bird's HEAD positioned in the upper portion of the frame.

  2. **contentFit="cover" with default center contentPosition**: When expo-image scales a tall portrait image to cover a wide landscape container (e.g., full-width x 160-200px), it center-crops vertically. This equally removes the top and bottom of the image. Since bird photography naturally places the bird's head near the top of a portrait frame, the head gets cropped off.

  The mosaic tiles (BirdMosaic) are actually LESS affected because the 3-column layout makes tiles somewhat portrait-shaped (~106x160px), which better matches portrait source images. The WORST cropping occurs in the full-width card contexts (BirdInfoCard, BirdDrawerContent, community feed cards) where containers are strongly landscape-shaped.

fix: (investigation only - not applied)
verification: (investigation only)
files_changed: []
