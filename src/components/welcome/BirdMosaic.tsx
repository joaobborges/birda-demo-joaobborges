import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { birds } from '@/data/birds'
import { semantic } from '@/theme/colors'

const TILE_HEIGHTS = [140, 180, 160, 200, 150, 170, 190, 145, 175, 165]
const GAP = 16
const HORIZONTAL_PADDING = 16

const leftBirds = birds.slice(0, 7)
const centerBirds = birds.slice(7, 14)
const rightBirds = birds.slice(14, 20)

interface ColumnConfig {
  birds: typeof birds
  direction: 'up' | 'down'
  duration: number
}

const COLUMNS: ColumnConfig[] = [
  { birds: leftBirds, direction: 'up', duration: 120000 },
  { birds: centerBirds, direction: 'down', duration: 140000 },
  { birds: rightBirds, direction: 'up', duration: 110000 },
]

function getTileHeight(index: number): number {
  return TILE_HEIGHTS[index % TILE_HEIGHTS.length]
}

function getTotalHeight(count: number): number {
  let total = 0
  for (let i = 0; i < count; i++) {
    total += getTileHeight(i) + GAP
  }
  return total
}

interface BirdMosaicProps {
  height: number
}

function MosaicColumn({ config }: { config: ColumnConfig }) {
  const translateY = useSharedValue(0)
  const totalHeight = getTotalHeight(config.birds.length)

  useEffect(() => {
    if (config.direction === 'up') {
      translateY.value = 0
      translateY.value = withRepeat(
        withTiming(-totalHeight, {
          duration: config.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    } else {
      translateY.value = -totalHeight
      translateY.value = withRepeat(
        withTiming(0, {
          duration: config.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const tiles = config.birds.map((bird, index) => (
    <View
      key={bird.id}
      style={[
        styles.tile,
        { height: getTileHeight(index) },
      ]}
    >
      <Image
        source={bird.image}
        style={styles.tileImage}
        contentFit="cover"
        priority="low"
      />
    </View>
  ))

  return (
    <View style={styles.column}>
      <Animated.View style={animatedStyle}>
        {tiles}
        {config.birds.map((bird, index) => (
          <View
            key={`dup-${bird.id}`}
            style={[
              styles.tile,
              { height: getTileHeight(index) },
            ]}
          >
            <Image
              source={bird.image}
              style={styles.tileImage}
              contentFit="cover"
              priority="low"
            />
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

export function BirdMosaic({ height }: BirdMosaicProps) {
  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      {COLUMNS.map((config, index) => (
        <MosaicColumn key={index} config={config} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: HORIZONTAL_PADDING,
    overflow: 'hidden',
  },
  column: {
    flex: 1,
    overflow: 'hidden',
  },
  tile: {
    borderRadius: 12,
    borderCurve: 'continuous',
    marginBottom: GAP,
    overflow: 'hidden',
    backgroundColor: semantic.bgTinted,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
})
