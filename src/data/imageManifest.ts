import { ImageSource } from 'expo-image'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type AssetStatus = 'exists' | 'placeholder'

interface ImageAsset {
  source: ImageSource
  filename: string
  width: number
  height: number
  location: string
  status: AssetStatus
}

// ─────────────────────────────────────────────────────────────
// Quick-access image sources (no metadata, just the require() value)
// These are the exports that screen components import.
// ─────────────────────────────────────────────────────────────

/**
 * Hero/illustration images for onboarding screens.
 * Keys: 'ai-bird-id' | 'discover' | 'goals' | 'green-time' | 'community' | 'mailing-list' | 'reminders'
 */
export const ONBOARDING_IMAGES: Record<string, ImageSource> = {
  'ai-bird-id': require('@/assets/onboarding/ai-bird-id.png'),
  'discover': require('@/assets/onboarding/discover.png'),
  'goals': require('@/assets/onboarding/goals.png'),
  'green-time': require('@/assets/onboarding/green-time.png'),
  'community': require('@/assets/onboarding/community.png'),
  'mailing-list': require('@/assets/onboarding/mailing-list.png'),
  'reminders': require('@/assets/onboarding/reminders.png'),
}

/**
 * Avatar images keyed by skill level.
 * Keys: 'default' | 'new' | 'garden' | 'intermediate' | 'expert'
 */
export const AVATAR_IMAGES: Record<string, ImageSource> = {
  'default': require('@/assets/avatar-default.png'),
  'new': require('@/assets/avatars/new.png'),
  'garden': require('@/assets/avatars/garden.png'),
  'intermediate': require('@/assets/avatars/intermediate.png'),
  'expert': require('@/assets/avatars/expert.png'),
  'avatar-1': require('@/assets/avatars/avatar-1.png'),
  'avatar-2': require('@/assets/avatars/avatar-2.png'),
  'avatar-3': require('@/assets/avatars/avatar-3.png'),
  'avatar-4': require('@/assets/avatars/avatar-4.png'),
}

/**
 * Avatar videos keyed by skill level.
 * Only levels with an actual MP4 have a value; others are null.
 */
export const AVATAR_VIDEOS: Record<string, any | null> = {
  new: require('@/assets/onboarding/new.mp4'),
  garden: require('@/assets/onboarding/garden.mp4'),
  intermediate: require('@/assets/onboarding/intermediate.mp4'),
  expert: require('@/assets/onboarding/expert.mp4'),
}

/**
 * Paywall hero image — full-bleed cover for the paywall hero zone.
 */
export const PAYWALL_HERO: ImageSource = require('@/assets/paywall-hero.png')
export const PAYWALL_HAPPY_BIRDERS: ImageSource = require('@/assets/happy birders.png')
export const PAYWALL_STORE: ImageSource = require('@/assets/store.png')

/**
 * Bird species images keyed by bird ID (matches birds.ts id field).
 * IDs: '1'–'20'
 */
export const BIRD_IMAGES: Record<string, ImageSource> = {
  '1': require('@/assets/birds/european-robin.jpg'),
  '2': require('@/assets/birds/common-blackbird.jpg'),
  '3': require('@/assets/birds/white-stork.jpg'),
  '4': require('@/assets/birds/eurasian-blue-tit.jpg'),
  '5': require('@/assets/birds/sardinian-warbler.jpg'),
  '6': require('@/assets/birds/house-sparrow.jpg'),
  '7': require('@/assets/birds/common-swift.jpg'),
  '8': require('@/assets/birds/serin.jpg'),
  '9': require('@/assets/birds/goldfinch.jpg'),
  '10': require('@/assets/birds/grey-heron.jpg'),
  '11': require('@/assets/birds/peregrine-falcon.jpg'),
  '12': require('@/assets/birds/common-kingfisher.jpg'),
  '13': require('@/assets/birds/hoopoe.jpg'),
  '14': require('@/assets/birds/little-egret.jpg'),
  '15': require('@/assets/birds/eurasian-spoonbill.jpg'),
  '16': require('@/assets/birds/black-stork.jpg'),
  '17': require('@/assets/birds/eagle-owl.jpg'),
  '18': require('@/assets/birds/flamingo.jpg'),
  '19': require('@/assets/birds/bee-eater.jpg'),
  '20': require('@/assets/birds/iberian-magpie.jpg'),
}

// ─────────────────────────────────────────────────────────────
// Manifest arrays (full metadata — for reporting/tooling)
// ─────────────────────────────────────────────────────────────

export const ONBOARDING_MANIFEST: ImageAsset[] = [
  {
    source: ONBOARDING_IMAGES['ai-bird-id'],
    filename: 'ai-bird-id.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/ai-bird-id.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['discover'],
    filename: 'discover.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/discover.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['goals'],
    filename: 'goals.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/goals.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['green-time'],
    filename: 'green-time.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/green-time.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['community'],
    filename: 'community.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/community.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['mailing-list'],
    filename: 'mailing-list.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/mailing-list.png',
    status: 'placeholder',
  },
  {
    source: ONBOARDING_IMAGES['reminders'],
    filename: 'reminders.png',
    width: 390,
    height: 220,
    location: 'src/assets/onboarding/reminders.png',
    status: 'placeholder',
  },
]

export const AVATAR_MANIFEST: ImageAsset[] = [
  {
    source: AVATAR_IMAGES['default'],
    filename: 'avatar-default.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatar-default.png',
    status: 'placeholder',
  },
  {
    source: AVATAR_IMAGES['new'],
    filename: 'new.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/new.png',
    status: 'placeholder',
  },
  {
    source: AVATAR_IMAGES['garden'],
    filename: 'garden.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/garden.png',
    status: 'placeholder',
  },
  {
    source: AVATAR_IMAGES['intermediate'],
    filename: 'intermediate.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/intermediate.png',
    status: 'placeholder',
  },
  {
    source: AVATAR_IMAGES['expert'],
    filename: 'expert.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/expert.png',
    status: 'placeholder',
  },
  {
    source: AVATAR_IMAGES['avatar-1'],
    filename: 'avatar-1.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/avatar-1.png',
    status: 'exists',
  },
  {
    source: AVATAR_IMAGES['avatar-2'],
    filename: 'avatar-2.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/avatar-2.png',
    status: 'exists',
  },
  {
    source: AVATAR_IMAGES['avatar-3'],
    filename: 'avatar-3.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/avatar-3.png',
    status: 'exists',
  },
  {
    source: AVATAR_IMAGES['avatar-4'],
    filename: 'avatar-4.png',
    width: 120,
    height: 120,
    location: 'src/assets/avatars/avatar-4.png',
    status: 'exists',
  },
]

export const PAYWALL_MANIFEST: ImageAsset = {
  source: PAYWALL_HERO,
  filename: 'paywall-hero.png',
  width: 390,
  height: 280,
  location: 'src/assets/paywall-hero.png',
  status: 'placeholder',
}

export const BIRD_MANIFEST: ImageAsset[] = [
  { source: BIRD_IMAGES['1'], filename: 'european-robin.jpg', width: 320, height: 240, location: 'src/assets/birds/european-robin.jpg', status: 'exists' },
  { source: BIRD_IMAGES['2'], filename: 'common-blackbird.jpg', width: 320, height: 240, location: 'src/assets/birds/common-blackbird.jpg', status: 'exists' },
  { source: BIRD_IMAGES['3'], filename: 'white-stork.jpg', width: 320, height: 240, location: 'src/assets/birds/white-stork.jpg', status: 'exists' },
  { source: BIRD_IMAGES['4'], filename: 'eurasian-blue-tit.jpg', width: 320, height: 240, location: 'src/assets/birds/eurasian-blue-tit.jpg', status: 'exists' },
  { source: BIRD_IMAGES['5'], filename: 'sardinian-warbler.jpg', width: 320, height: 240, location: 'src/assets/birds/sardinian-warbler.jpg', status: 'exists' },
  { source: BIRD_IMAGES['6'], filename: 'house-sparrow.jpg', width: 320, height: 240, location: 'src/assets/birds/house-sparrow.jpg', status: 'exists' },
  { source: BIRD_IMAGES['7'], filename: 'common-swift.jpg', width: 320, height: 240, location: 'src/assets/birds/common-swift.jpg', status: 'exists' },
  { source: BIRD_IMAGES['8'], filename: 'serin.jpg', width: 320, height: 240, location: 'src/assets/birds/serin.jpg', status: 'exists' },
  { source: BIRD_IMAGES['9'], filename: 'goldfinch.jpg', width: 320, height: 240, location: 'src/assets/birds/goldfinch.jpg', status: 'exists' },
  { source: BIRD_IMAGES['10'], filename: 'grey-heron.jpg', width: 320, height: 240, location: 'src/assets/birds/grey-heron.jpg', status: 'exists' },
  { source: BIRD_IMAGES['11'], filename: 'peregrine-falcon.jpg', width: 320, height: 240, location: 'src/assets/birds/peregrine-falcon.jpg', status: 'exists' },
  { source: BIRD_IMAGES['12'], filename: 'common-kingfisher.jpg', width: 320, height: 240, location: 'src/assets/birds/common-kingfisher.jpg', status: 'exists' },
  { source: BIRD_IMAGES['13'], filename: 'hoopoe.jpg', width: 320, height: 240, location: 'src/assets/birds/hoopoe.jpg', status: 'exists' },
  { source: BIRD_IMAGES['14'], filename: 'little-egret.jpg', width: 320, height: 240, location: 'src/assets/birds/little-egret.jpg', status: 'exists' },
  { source: BIRD_IMAGES['15'], filename: 'eurasian-spoonbill.jpg', width: 320, height: 240, location: 'src/assets/birds/eurasian-spoonbill.jpg', status: 'exists' },
  { source: BIRD_IMAGES['16'], filename: 'black-stork.jpg', width: 320, height: 240, location: 'src/assets/birds/black-stork.jpg', status: 'exists' },
  { source: BIRD_IMAGES['17'], filename: 'eagle-owl.jpg', width: 320, height: 240, location: 'src/assets/birds/eagle-owl.jpg', status: 'exists' },
  { source: BIRD_IMAGES['18'], filename: 'flamingo.jpg', width: 320, height: 240, location: 'src/assets/birds/flamingo.jpg', status: 'exists' },
  { source: BIRD_IMAGES['19'], filename: 'bee-eater.jpg', width: 320, height: 240, location: 'src/assets/birds/bee-eater.jpg', status: 'exists' },
  { source: BIRD_IMAGES['20'], filename: 'iberian-magpie.jpg', width: 320, height: 240, location: 'src/assets/birds/iberian-magpie.jpg', status: 'exists' },
]

/**
 * Combined manifest of all image assets — use for reporting, tooling, or iteration.
 */
export const IMAGE_MANIFEST: ImageAsset[] = [
  ...ONBOARDING_MANIFEST,
  ...AVATAR_MANIFEST,
  PAYWALL_MANIFEST,
  ...BIRD_MANIFEST,
]
