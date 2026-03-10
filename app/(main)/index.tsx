import { useRef, useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { Marker, Region } from 'react-native-maps'
import Animated, { FadeIn } from 'react-native-reanimated'
import Supercluster from 'supercluster'
import Ionicons from '@expo/vector-icons/Ionicons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { birds, Bird } from '@/data/birds'
import { semantic, colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'
import { BirdMarker } from '@/components/map/BirdMarker'
import { BirdDrawerContent } from '@/components/map/BirdDrawerContent'
import { CaptureFAB } from '@/components/map/CaptureFAB'

const LISBON_REGION: Region = {
  latitude: 38.7223,
  longitude: -9.1393,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
}

const geoPoints: Supercluster.PointFeature<Bird>[] = birds.map((bird) => ({
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [bird.longitude, bird.latitude],
  },
  properties: bird,
}))

function getClustersForRegion(
  index: Supercluster<Bird, Supercluster.AnyProps>,
  region: Region,
) {
  const west = region.longitude - region.longitudeDelta / 2
  const south = region.latitude - region.latitudeDelta / 2
  const east = region.longitude + region.longitudeDelta / 2
  const north = region.latitude + region.latitudeDelta / 2
  const zoom = Math.round(Math.log2(360 / region.longitudeDelta))
  return index.getClusters([west, south, east, north], zoom)
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
  const router = useRouter()
  const { top } = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const sheetRef = useRef<BottomSheetModal>(null)
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null)

  const clusterIndex = useMemo(() => {
    const index = new Supercluster<Bird, Supercluster.AnyProps>({
      radius: 60,
      maxZoom: 16,
      minZoom: 0,
      minPoints: 2,
    })
    index.load(geoPoints)
    return index
  }, [])

  const [clusters, setClusters] = useState(() =>
    getClustersForRegion(clusterIndex, LISBON_REGION),
  )

  function handleRegionChange(region: Region) {
    setClusters(getClustersForRegion(clusterIndex, region))
  }

  function handleClusterPress(
    clusterId: number,
    latitude: number,
    longitude: number,
  ) {
    const expansionZoom = clusterIndex.getClusterExpansionZoom(clusterId)
    const latitudeDelta = 360 / Math.pow(2, expansionZoom + 1)
    const longitudeDelta = 360 / Math.pow(2, expansionZoom + 1)
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      350,
    )
  }

  function handleBirdPress(bird: Bird) {
    setSelectedBird(bird)
    sheetRef.current?.present()
  }

  const handleSheetClose = useCallback(() => {
    setSelectedBird(null)
  }, [])

  function handleBirdImagePress() {
    if (!selectedBird) return
    sheetRef.current?.dismiss()
    router.push({ pathname: '/bird-detail', params: { birdId: selectedBird.id } })
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={LISBON_REGION}
        onRegionChangeComplete={handleRegionChange}
        mapType="mutedStandard"
        showsPointsOfInterests={false}
        showsBuildings={false}
        showsUserLocation
        showsCompass={false}
      >
        {clusters.map((feature) => {
          const [lng, lat] = feature.geometry.coordinates
          if ('cluster' in feature.properties && feature.properties.cluster) {
            const clusterProps = feature.properties as Supercluster.ClusterProperties
            return (
              <Marker
                key={`cluster-${clusterProps.cluster_id}`}
                coordinate={{ latitude: lat, longitude: lng }}
                tracksViewChanges={false}
                anchor={{ x: 0.5, y: 0.5 }}
                onPress={() =>
                  handleClusterPress(clusterProps.cluster_id, lat, lng)
                }
              >
                <View style={styles.clusterMarker}>
                  <Text style={styles.clusterText}>
                    {clusterProps.point_count}
                  </Text>
                </View>
              </Marker>
            )
          }
          const bird = feature.properties as Bird
          return (
            <BirdMarker
              key={`bird-${bird.id}`}
              bird={bird}
              onPress={handleBirdPress}
            />
          )
        })}
      </MapView>

      {/* Floating top bar — Profile (left) and Notification (right) remain */}
      <Animated.View entering={FadeIn.delay(300)} style={[styles.topBar, { top: top + spacing['3'] }]}>
        <Pressable style={styles.iconButton} onPress={() => push('/profile')}>
          <Ionicons name="person-circle" size={24} color={colors.neutral400} />
        </Pressable>
        <View style={styles.iconButton}>
          <Ionicons name="notifications" size={22} color={colors.neutral400} />
          <View style={styles.notificationBadge} />
        </View>
      </Animated.View>

      <CaptureFAB />

      {/* Bottom sheet modal — renders via Portal above tab bar */}
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        onDismiss={handleSheetClose}
        handleIndicatorStyle={{ backgroundColor: colors.neutral300 }}
      >
        <BottomSheetView>
          {selectedBird ? (
            <BirdDrawerContent
              bird={selectedBird}
              onImagePress={handleBirdImagePress}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
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
    left: spacing['4'],
    right: spacing['4'],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing['2'],
    right: spacing['2'],
    width: spacing['2'],
    height: spacing['2'],
    borderRadius: spacing['1'],
    borderCurve: 'continuous',
    backgroundColor: semantic.statusError,
  },
  clusterMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: semantic.markerCluster,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    fontFamily: fontWeights.bold,
    fontSize: 13,
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
  retryButton: {
    backgroundColor: semantic.actionPrimary,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['3'],
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  retryText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 15,
    color: semantic.textInverse,
  },
})
