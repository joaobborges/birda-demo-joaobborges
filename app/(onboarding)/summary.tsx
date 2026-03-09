import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

export default function SummaryScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const { name, location, skillLevel, interests } = useOnboardingStore()

  const items = [
    { label: 'Name', value: name || 'Not set' },
    { label: 'Location', value: location || 'Not set' },
    { label: 'Skill level', value: skillLevel ? skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1) : 'Not set' },
    { label: 'Interests', value: interests.length > 0 ? interests.join(', ') : 'None selected' },
  ]

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={6} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.subtitle}>Here's what we know about you so far.</Text>

        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={() => push('/(onboarding)/paywall')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: semantic.textSecondary,
  },
  card: {
    backgroundColor: semantic.bgPage,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    gap: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    color: semantic.textSecondary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 15,
    color: semantic.textInput,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
})
