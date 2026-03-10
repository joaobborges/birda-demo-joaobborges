import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function LogbookScreen() {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      <Ionicons name="book-outline" size={48} color={semantic.textMuted} />
      <Text style={styles.title}>Logbook</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['3'],
  },
  title: {
    ...typography.h2,
    color: semantic.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
  },
})
