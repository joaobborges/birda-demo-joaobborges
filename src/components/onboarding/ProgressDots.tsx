import { View, StyleSheet } from 'react-native'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'

interface ProgressDotsProps {
  total: number
  current: number
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === current ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing['2'],
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: spacing['4'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderCurve: 'continuous',
  },
  active: {
    backgroundColor: semantic.actionPrimary,
    width: 24,
  },
  inactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
})
