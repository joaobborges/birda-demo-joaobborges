import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native'
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

interface BirdDrawerContentProps {
  bird: Bird
  onImagePress: () => void
}

export function BirdDrawerContent({ bird, onImagePress }: BirdDrawerContentProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onImagePress}>
        <Image
          source={{ uri: bird.image }}
          style={styles.birdImage}
          contentFit="cover"
          transition={200}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.birdName}>{bird.name}</Text>
        <Text style={styles.birdSpecies}>{bird.species}</Text>
        <Text style={styles.birdDescription}>{bird.description}</Text>
        <View style={[styles.rarityBadge, rarityStyles[bird.rarity]]}>
          <Text style={styles.rarityText}>{bird.rarity}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  birdImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: spacing['4'],
    gap: spacing['2'],
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
  },
  rarityBadge: {
    alignSelf: 'flex-start',
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
})
