import { View, Text, StyleSheet } from 'react-native'
import { Image, ImageSource } from 'expo-image'
import { LegendList } from '@legendapp/list'
import Ionicons from '@expo/vector-icons/Ionicons'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

interface Sighting {
  id: string
  birdName: string
  species: string
  description: string
  username: string
  location: string
  timestamp: string
  image: ImageSource
  likes: number
}

const SIGHTINGS: Sighting[] = [
  { id: '1', birdName: 'European Robin', species: 'Erithacus rubecula', description: 'Spotted this little robin hopping around the park benches', username: 'Maria S.', location: 'Parque das Nações', timestamp: '2 hours ago', image: require('@/assets/birds/european-robin.jpg'), likes: 24 },
  { id: '2', birdName: 'Common Kingfisher', species: 'Alcedo atthis', description: 'Incredible flash of blue along the stream', username: 'Pedro L.', location: 'Monsanto Forest', timestamp: '4 hours ago', image: require('@/assets/birds/common-kingfisher.jpg'), likes: 18 },
  { id: '3', birdName: 'White Stork', species: 'Ciconia ciconia', description: 'Nesting pair right by the tower', username: 'Ana R.', location: 'Belém Tower', timestamp: '5 hours ago', image: require('@/assets/birds/white-stork.jpg'), likes: 31 },
  { id: '4', birdName: 'Hoopoe', species: 'Upupa epops', description: 'First time seeing a hoopoe in the wild!', username: 'Tiago M.', location: 'Sintra National Park', timestamp: 'Yesterday', image: require('@/assets/birds/hoopoe.jpg'), likes: 12 },
  { id: '5', birdName: 'Flamingo', species: 'Phoenicopterus roseus', description: 'Huge flock at sunset, amazing sight', username: 'Sofia C.', location: 'Tagus Estuary', timestamp: 'Yesterday', image: require('@/assets/birds/flamingo.jpg'), likes: 45 },
  { id: '6', birdName: 'Bee-eater', species: 'Merops apiaster', description: 'Caught this colorful visitor near the olive grove', username: 'João B.', location: 'Alentejo', timestamp: '2 days ago', image: require('@/assets/birds/bee-eater.jpg'), likes: 8 },
]

function SightingItem({ item }: { item: Sighting }) {
  return (
    <View style={styles.item}>
      <Image source={item.image} style={styles.birdImage} contentFit="cover" transition={200} />
      <View style={styles.itemContent}>
        <View style={styles.nameRow}>
          <Text style={styles.birdName}>{item.birdName}</Text>
          <Text style={styles.species}> {item.species}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={13} color={semantic.textMuted} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.userInfo}>
            <Text style={styles.metaText}>{item.username}</Text>
            <Text style={styles.metaDot}>{'\u00B7'}</Text>
            <Text style={styles.metaText}>{item.timestamp}</Text>
          </View>
          <View style={styles.likeRow}>
            <Ionicons name="heart-outline" size={14} color={semantic.textMuted} />
            <Text style={styles.likeCount}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <LegendList
        data={SIGHTINGS}
        renderItem={({ item }) => <SightingItem item={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={320}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  list: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['3'],
    gap: spacing['4'],
    paddingBottom: spacing['6'],
  },
  item: {
    backgroundColor: semantic.bgPage,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  birdImage: {
    width: '100%',
    height: 200,
  },
  itemContent: {
    padding: 14, // no exact token
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  birdName: {
    ...typography.bodySmall,
    fontFamily: fontWeights.bold,
    color: semantic.textPrimary,
  },
  species: {
    fontFamily: fontWeights.regular,
    fontSize: 13, // no exact token
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  description: {
    ...typography.caption,
    color: semantic.textBody,
    marginTop: 6, // no exact token
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    marginTop: 6, // no exact token
  },
  locationText: {
    fontFamily: fontWeights.regular,
    fontSize: 13, // no exact token
    color: semantic.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing['2'],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  metaText: {
    fontFamily: fontWeights.regular,
    fontSize: 13, // no exact token
    color: semantic.textBody,
  },
  metaDot: {
    fontFamily: fontWeights.regular,
    fontSize: 13, // no exact token
    color: semantic.textMuted,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  likeCount: {
    fontFamily: fontWeights.regular,
    fontSize: 12, // no exact token
    color: semantic.textMuted,
  },
})
