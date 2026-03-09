import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LegendList } from '@legendapp/list'
import Ionicons from '@expo/vector-icons/Ionicons'
import { semantic } from '@/theme/colors'

interface Sighting {
  id: string
  birdName: string
  species: string
  username: string
  location: string
  timestamp: string
  image: string
  likes: number
}

const SIGHTINGS: Sighting[] = [
  { id: '1', birdName: 'European Robin', species: 'Erithacus rubecula', username: 'Maria S.', location: 'Parque das Nações', timestamp: '2 hours ago', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/320px-Erithacus_rubecula_with_cocked_head.jpg', likes: 24 },
  { id: '2', birdName: 'Common Kingfisher', species: 'Alcedo atthis', username: 'Pedro L.', location: 'Monsanto Forest', timestamp: '4 hours ago', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Alcedo_atthis_-_Flickr_-_Lip_Kee.jpg/320px-Alcedo_atthis_-_Flickr_-_Lip_Kee.jpg', likes: 18 },
  { id: '3', birdName: 'White Stork', species: 'Ciconia ciconia', username: 'Ana R.', location: 'Belém Tower', timestamp: '5 hours ago', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/White_Stork-Mindaugas_Urbonas-1.jpg/320px-White_Stork-Mindaugas_Urbonas-1.jpg', likes: 31 },
  { id: '4', birdName: 'Hoopoe', species: 'Upupa epops', username: 'Tiago M.', location: 'Sintra National Park', timestamp: 'Yesterday', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Upupa_epops_1.jpg/320px-Upupa_epops_1.jpg', likes: 12 },
  { id: '5', birdName: 'Flamingo', species: 'Phoenicopterus roseus', username: 'Sofia C.', location: 'Tagus Estuary', timestamp: 'Yesterday', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Greater_flamingo_%28Phoenicopterus_roseus%29.jpg/320px-Greater_flamingo_%28Phoenicopterus_roseus%29.jpg', likes: 45 },
  { id: '6', birdName: 'Bee-eater', species: 'Merops apiaster', username: 'João B.', location: 'Alentejo', timestamp: '2 days ago', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Merops_apiaster.jpg/320px-Merops_apiaster.jpg', likes: 8 },
]

function SightingItem({ item }: { item: Sighting }) {
  return (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.birdImage} contentFit="cover" transition={200} />
      <View style={styles.itemContent}>
        <Text style={styles.birdName}>{item.birdName}</Text>
        <Text style={styles.species}>{item.species}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.username}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <View style={styles.likeRow}>
          <Ionicons name="heart-outline" size={14} color={semantic.textMuted} />
          <Text style={styles.likeCount}>{item.likes}</Text>
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
        estimatedItemSize={100}
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
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: semantic.bgPage,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  birdImage: {
    width: 90,
    height: 100,
  },
  itemContent: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  birdName: {
    fontSize: 16,
    fontWeight: '700',
    color: semantic.textPrimary,
  },
  species: {
    fontSize: 13,
    color: semantic.textSecondary,
    fontStyle: 'italic',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: semantic.textBody,
  },
  metaDot: {
    fontSize: 13,
    color: semantic.textMuted,
  },
  timestamp: {
    fontSize: 12,
    color: semantic.textMuted,
    marginTop: 2,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  likeCount: {
    fontSize: 12,
    color: semantic.textMuted,
  },
})
