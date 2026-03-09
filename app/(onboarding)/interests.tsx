import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

const BIRD_TYPES = [
  { key: 'raptors', label: 'Raptors', emoji: '🦅' },
  { key: 'songbirds', label: 'Songbirds', emoji: '🐦' },
  { key: 'waterbirds', label: 'Waterbirds', emoji: '🦆' },
  { key: 'shorebirds', label: 'Shorebirds', emoji: '🪶' },
  { key: 'owls', label: 'Owls', emoji: '🦉' },
  { key: 'woodpeckers', label: 'Woodpeckers', emoji: '🪺' },
]

export default function InterestsScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const { interests, setInterests } = useOnboardingStore()

  const toggleInterest = (key: string) => {
    const updated = interests.includes(key)
      ? interests.filter((i) => i !== key)
      : [...interests, key]
    setInterests(updated)
  }

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={4} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>What birds interest you?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.grid}>
          {BIRD_TYPES.map((bird) => {
            const selected = interests.includes(bird.key)
            return (
              <Pressable
                key={bird.key}
                style={[styles.chip, selected ? styles.chipSelected : null]}
                onPress={() => toggleInterest(bird.key)}
              >
                <Text style={styles.chipEmoji}>{bird.emoji}</Text>
                <Text
                  style={[styles.chipLabel, selected ? styles.chipLabelSelected : null]}
                >
                  {bird.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={() => push('/(onboarding)/notifications')} />
        <Button
          title="Skip"
          variant="link"
          onPress={() => push('/(onboarding)/notifications')}
        />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    borderWidth: 2,
    borderColor: semantic.borderDefault,
  },
  chipSelected: {
    borderColor: semantic.actionPrimary,
    backgroundColor: semantic.actionPrimaryBg,
  },
  chipEmoji: {
    fontSize: 20,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: semantic.textInput,
  },
  chipLabelSelected: {
    color: semantic.actionPrimary,
  },
  actions: {
    gap: 8,
  },
})
