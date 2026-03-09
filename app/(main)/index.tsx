import { useState, memo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { Marker, Region } from 'react-native-maps'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { birds, Bird } from '@/data/birds'
import { semantic } from '@/theme/colors'

const LISBON_REGION: Region = {
  latitude: 38.7223,
  longitude: -9.1393,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
}

function getVisibleBirds(region: Region): Bird[] {
  const zoom = Math.log2(360 / region.longitudeDelta)
  return birds.filter((bird) => {
    if (bird.rarity === 'common') return true
    if (bird.rarity === 'uncommon') return zoom >= 13
    if (bird.rarity === 'rare') return zoom >= 15
    return false
  })
}

const BirdMarker = memo(function BirdMarker({
  bird,
  onPress,
}: {
  bird: Bird
  onPress: (bird: Bird) => void
}) {
  return (
    <Marker
      coordinate={{ latitude: bird.latitude, longitude: bird.longitude }}
      onPress={() => onPress(bird)}
      title={bird.name}
    />
  )
})

function BirdInfoCard({ bird, onClose }: { bird: Bird; onClose: () => void }) {
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
        <View style={[styles.rarityBadge, styles[`rarity_${bird.rarity}`]]}>
          <Text style={styles.rarityText}>{bird.rarity}</Text>
        </View>
      </View>
    </Animated.View>
  )
}

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Something went wrong loading the map.</Text>
      <Pressable style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>
  )
}

export default function MapScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const [region, setRegion] = useState(LISBON_REGION)
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null)

  const visibleBirds = getVisibleBirds(region)

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={LISBON_REGION}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsCompass={false}
      >
        {visibleBirds.map((bird) => (
          <BirdMarker key={bird.id} bird={bird} onPress={setSelectedBird} />
        ))}
      </MapView>

      {/* Floating top bar */}
      <Animated.View entering={FadeIn.delay(300)} style={[styles.topBar, { top: top + 12 }]}>
        <Pressable style={styles.iconButton} onPress={() => push('/profile')}>
          <Text style={styles.iconText}>👤</Text>
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable style={styles.iconButton} onPress={() => push('/community')}>
            <Text style={styles.iconText}>👥</Text>
          </Pressable>
          <View style={styles.iconButton}>
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.notificationBadge} />
          </View>
        </View>
      </Animated.View>

      {/* Floating bottom bar */}
      <Animated.View entering={FadeIn.delay(400)} style={[styles.bottomBar, { bottom: bottom + 20 }]}>
        <Pressable style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>📷 Capture</Text>
        </Pressable>
        <Pressable style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>📖 Logbook</Text>
        </Pressable>
      </Animated.View>

      {/* Bird info card */}
      {selectedBird ? (
        <BirdInfoCard bird={selectedBird} onClose={() => setSelectedBird(null)} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  iconText: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semantic.statusError,
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingVertical: 14,
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  bottomButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: semantic.textInput,
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: semantic.bgPage,
  },
  errorText: {
    fontSize: 16,
    color: semantic.textSecondary,
  },
  retryButton: {
    backgroundColor: semantic.actionPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  retryText: {
    color: semantic.textInverse,
    fontSize: 15,
    fontWeight: '600',
  },
})
