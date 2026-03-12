import { View, Text, ScrollView, Pressable, StyleSheet, ViewStyle } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import MapView, { Marker } from 'react-native-maps'
import Ionicons from '@expo/vector-icons/Ionicons'
import { birds, Bird } from '@/data/birds'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

const rarityStyles: Record<Bird['rarity'], ViewStyle> = {
  common: { backgroundColor: semantic.rarityCommonBg },
  uncommon: { backgroundColor: semantic.rarityUncommonBg },
  rare: { backgroundColor: semantic.rarityRareBg },
}

export default function BirdDetailScreen() {
  const { birdId } = useLocalSearchParams<{ birdId: string }>()
  const router = useRouter()
  const { top } = useSafeAreaInsets()

  const bird = birds.find((b) => b.id === birdId)

  if (!bird) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bird not found.</Text>
        <Pressable style={styles.backButtonFallback} onPress={() => router.back()}>
          <Text style={styles.backButtonFallbackText}>Go Back</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      {/* Floating back button */}
      <Pressable
        style={[styles.backButton, { top: top + spacing['3'] }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={semantic.textPrimary} />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <Image
          source={bird.image}
          style={styles.heroImage}
          contentFit="cover"
          contentPosition="top"
          transition={300}
        />

        {/* Content section */}
        <View style={styles.content}>
          {/* Name + rarity row */}
          <View style={styles.nameRow}>
            <Text style={styles.birdName}>{bird.name}</Text>
            <View style={[styles.rarityBadge, rarityStyles[bird.rarity]]}>
              <Text style={styles.rarityText}>{bird.rarity}</Text>
            </View>
          </View>

          {/* Species */}
          <Text style={styles.birdSpecies}>{bird.species}</Text>

          {/* Description */}
          <Text style={styles.birdDescription}>{bird.description}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Habitat & Behavior section */}
          <Text style={styles.sectionTitle}>Habitat & Behavior</Text>
          <Text style={styles.sectionBody}>
            This species is commonly found in parks, gardens, and woodland edges across the Iberian
            Peninsula. Known for its distinctive call and foraging behavior, it can often be
            observed in the early morning hours.
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Observation Location section */}
          <Text style={styles.sectionTitle}>Observation Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.staticMap}
              region={{
                latitude: bird.latitude,
                longitude: bird.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              mapType="mutedStandard"
              showsPointsOfInterests={false}
              showsBuildings={false}
              showsCompass={false}
            >
              <Marker
                coordinate={{ latitude: bird.latitude, longitude: bird.longitude }}
              />
            </MapView>
          </View>

          {/* Log Sighting CTA */}
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Log Sighting</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['8'],
  },
  backButton: {
    position: 'absolute',
    left: spacing['4'],
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    zIndex: 10,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  content: {
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['4'],
    gap: spacing['4'],
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birdName: {
    fontFamily: fontWeights.semiBold,
    fontSize: 22,
    color: semantic.textPrimary,
    flex: 1,
    marginRight: spacing['3'],
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
  birdSpecies: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  birdDescription: {
    ...typography.bodySmall,
    color: semantic.textBody,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: semantic.borderDefault,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: fontWeights.semiBold,
    fontSize: 18,
    color: semantic.textPrimary,
  },
  sectionBody: {
    ...typography.bodySmall,
    color: semantic.textBody,
    lineHeight: 22,
  },
  mapContainer: {
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  staticMap: {
    width: '100%',
    height: 180,
  },
  ctaButton: {
    backgroundColor: semantic.actionPrimary,
    paddingVertical: spacing['4'],
    borderRadius: 30,
    borderCurve: 'continuous',
    alignItems: 'center',
    opacity: 0.5,
  },
  ctaText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 16,
    color: semantic.textInverse,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['4'],
    backgroundColor: semantic.bgPage,
  },
  errorText: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
  },
  backButtonFallback: {
    backgroundColor: semantic.actionPrimary,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['3'],
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  backButtonFallbackText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 15,
    color: semantic.textInverse,
  },
})
