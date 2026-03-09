import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { Bird } from '@/data/birds'
import { semantic } from '@/theme/colors'

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
        source={{ uri: bird.image }}
        style={styles.birdImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.infoCardContent}>
        <Text style={styles.birdName}>{bird.name}</Text>
        <Text style={styles.birdSpecies}>{bird.species}</Text>
        <Text style={styles.birdDescription}>{bird.description}</Text>
        <View style={[styles.rarityBadge, styles[`rarity_${bird.rarity}` as keyof typeof styles]]}>
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
    left: 16,
    right: 16,
    backgroundColor: semantic.bgPage,
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
  infoCardClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    color: semantic.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  birdImage: {
    width: '100%',
    height: 160,
  },
  infoCardContent: {
    padding: 16,
    gap: 4,
  },
  birdName: {
    fontSize: 20,
    fontWeight: '700',
    color: semantic.textPrimary,
  },
  birdSpecies: {
    fontSize: 14,
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  birdDescription: {
    fontSize: 14,
    color: semantic.textBody,
    lineHeight: 20,
    marginTop: 4,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderCurve: 'continuous',
    marginTop: 8,
  },
  rarity_common: {
    backgroundColor: semantic.rarityCommonBg,
  },
  rarity_uncommon: {
    backgroundColor: semantic.rarityUncommonBg,
  },
  rarity_rare: {
    backgroundColor: semantic.rarityRareBg,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '600',
    color: semantic.textBody,
    textTransform: 'capitalize',
  },
})
