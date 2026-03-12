import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { Bird } from '@/data/birds'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

const rarityStyles: Record<Bird['rarity'], ViewStyle> = {
  common: { backgroundColor: semantic.rarityCommonBg },
  uncommon: { backgroundColor: semantic.rarityUncommonBg },
  rare: { backgroundColor: semantic.rarityRareBg },
}

interface BirdInfoCardProps {
  bird: Bird
  onClose: () => void
}

export function BirdInfoCard({ bird, onClose }: BirdInfoCardProps) {
  return (
    <Animated.View entering={SlideInDown.duration(300)} style={styles.infoCard}>
      <Pressable style={styles.infoCardClose} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
      <Image
        source={bird.image}
        style={styles.birdImage}
        contentFit="cover"
        contentPosition="top"
        transition={200}
      />
      <View style={styles.infoCardContent}>
        <Text style={styles.birdName}>{bird.name}</Text>
        <Text style={styles.birdSpecies}>{bird.species}</Text>
        <Text style={styles.birdDescription}>{bird.description}</Text>
        <View style={[styles.rarityBadge, rarityStyles[bird.rarity]]}>
          <Text style={styles.rarityText}>{bird.rarity}</Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  infoCard: {
    position: 'absolute',
    bottom: 100,
    left: spacing['4'],
    right: spacing['4'],
    backgroundColor: semantic.bgPage,
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
  infoCardClose: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    width: 28,
    height: 28,
    borderRadius: 14, // no exact token
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    ...typography.caption,
    fontFamily: fontWeights.semiBold,
    color: semantic.textInverse,
  },
  birdImage: {
    width: '100%',
    height: 160,
  },
  infoCardContent: {
    padding: spacing['4'],
    gap: spacing['1'],
  },
  birdName: {
    ...typography.bodyLarge,
    fontFamily: fontWeights.bold,
    color: semantic.textPrimary,
  },
  birdSpecies: {
    ...typography.caption,
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  birdDescription: {
    ...typography.caption,
    color: semantic.textBody,
    lineHeight: 20,
    marginTop: spacing['1'],
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, // no exact token
    paddingVertical: 3, // no exact token
    borderRadius: spacing['2'],
    borderCurve: 'continuous',
    marginTop: spacing['2'],
  },
  rarityText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 12, // no exact token
    color: semantic.textBody,
    textTransform: 'capitalize',
  },
})
