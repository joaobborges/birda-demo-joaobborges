import { useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Bird } from '@/data/birds'
import { semantic, colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'
import { buttons, containers } from '@/theme/components'

interface BirdDrawerContentProps {
  bird: Bird
  onViewMore: () => void
}

export function BirdDrawerContent({ bird, onViewMore }: BirdDrawerContentProps) {
  const { bottom } = useSafeAreaInsets()

  const sightings = useMemo(
    () => Math.floor(Math.random() * 45) + 3,
    [bird.id],
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.birdName}>{bird.name}</Text>
          <View style={[styles.rarityBadge, { backgroundColor: colors[`rarity${bird.rarity.charAt(0).toUpperCase() + bird.rarity.slice(1)}Bg` as keyof typeof colors] }]}>
            <Text style={styles.rarityText}>{bird.rarity}</Text>
          </View>
        </View>
        <Text style={styles.birdSpecies}>{bird.species}</Text>
      </View>

      {/* Image with sightings pill overlay */}
      <View style={styles.imageWrapper}>
        <Image
          source={bird.image}
          style={styles.birdImage}
          contentFit="cover"
          contentPosition="top"
          transition={200}
        />
        <View style={styles.sightingsPill}>
          <Ionicons name="eye" size={14} color={semantic.textInverse} />
          <Text style={styles.sightingsText}>
            {sightings} {sightings === 1 ? 'sighting' : 'sightings'}
          </Text>
        </View>
      </View>

      {/* 2-column stats box */}
      <View style={styles.statsWrapper}>
        <View style={styles.statsBox}>
          <View style={styles.stat}>
            <Ionicons name="leaf" size={20} color={semantic.actionPrimary} />
            <Text style={styles.statValue}>{bird.family}</Text>
            <Text style={styles.statLabel}>Family</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="resize" size={20} color={semantic.actionPrimary} />
            <Text style={styles.statValue}>{bird.length}</Text>
            <Text style={styles.statLabel}>Length</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.birdDescription} numberOfLines={3}>
          {bird.description}
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: bottom + containers.fixedBottomCTA.paddingBottom }]}>
        <Pressable style={styles.ctaButton} onPress={onViewMore}>
          <Text style={styles.ctaText}>View More</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  imageWrapper: {
    marginHorizontal: spacing['4'],
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  birdImage: {
    width: '100%',
    height: 200,
  },
  sightingsPill: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: spacing['2'],
    borderCurve: 'continuous',
  },
  sightingsText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 13,
    color: semantic.textInverse,
  },
  statsWrapper: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: spacing['3'],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontFamily: fontWeights.semiBold,
    fontSize: 14,
    color: semantic.textPrimary,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fontWeights.regular,
    fontSize: 12,
    color: semantic.textSecondary,
  },
  header: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing['2'],
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: spacing['2'],
    borderCurve: 'continuous',
  },
  rarityText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 12,
    color: semantic.textBody,
    textTransform: 'capitalize',
  },
  content: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  birdName: {
    ...typography.subheading,
    fontFamily: fontWeights.bold,
    color: semantic.textPrimary,
  },
  birdSpecies: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  birdDescription: {
    ...typography.caption,
    color: semantic.textBody,
    lineHeight: 14 * 1.5,
  },
  footer: {
    paddingHorizontal: containers.fixedBottomCTA.paddingHorizontal,
    paddingTop: spacing['4'],
  },
  ctaButton: {
    ...buttons.cta,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 16,
    color: semantic.textInverse,
  },
})
