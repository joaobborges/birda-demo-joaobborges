import { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Marker } from 'react-native-maps'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Bird } from '@/data/birds'
import { semantic } from '@/theme/colors'

interface BirdMarkerProps {
  bird: Bird
  onPress: (bird: Bird) => void
}

export const BirdMarker = memo(function BirdMarker({ bird, onPress }: BirdMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: bird.latitude, longitude: bird.longitude }}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={() => onPress(bird)}
    >
      <View style={styles.hitArea}>
        {bird.rarity === 'common' ? (
          <View style={styles.commonMarker} />
        ) : bird.rarity === 'uncommon' ? (
          <View style={styles.uncommonMarker} />
        ) : (
          <View style={styles.rareMarker}>
            <Ionicons name="star" size={10} color={semantic.textInverse} />
          </View>
        )}
      </View>
    </Marker>
  )
})

const styles = StyleSheet.create({
  hitArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commonMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderCurve: 'continuous',
    backgroundColor: semantic.markerCommon,
    borderWidth: 1.5,
    borderColor: semantic.textInverse,
  },
  uncommonMarker: {
    width: 14,
    height: 14,
    backgroundColor: semantic.markerUncommon,
    borderWidth: 1.5,
    borderColor: semantic.textInverse,
    transform: [{ rotate: '45deg' }],
  },
  rareMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderCurve: 'continuous',
    backgroundColor: semantic.markerRare,
    borderWidth: 1.5,
    borderColor: semantic.textInverse,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
