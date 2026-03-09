import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

const LEVELS = [
  { key: 'beginner' as const, label: 'Beginner', description: 'Just getting started' },
  { key: 'intermediate' as const, label: 'Intermediate', description: 'I know common species' },
  { key: 'advanced' as const, label: 'Advanced', description: 'Experienced birder' },
]

export default function SkillLevelScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const { skillLevel, setSkillLevel } = useOnboardingStore()

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={3} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>What's your birding level?</Text>

        <View style={styles.options}>
          {LEVELS.map((level) => (
            <Pressable
              key={level.key}
              style={[
                styles.option,
                skillLevel === level.key ? styles.optionSelected : null,
              ]}
              onPress={() => setSkillLevel(level.key)}
            >
              <Text
                style={[
                  styles.optionLabel,
                  skillLevel === level.key ? styles.optionLabelSelected : null,
                ]}
              >
                {level.label}
              </Text>
              <Text style={styles.optionDescription}>{level.description}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={() => push('/(onboarding)/interests')} />
        <Button
          title="Skip"
          variant="link"
          onPress={() => push('/(onboarding)/interests')}
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
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
  },
  options: {
    gap: 12,
  },
  option: {
    padding: 20,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    borderWidth: 2,
    borderColor: semantic.borderDefault,
    gap: 4,
  },
  optionSelected: {
    borderColor: semantic.actionPrimary,
    backgroundColor: semantic.actionPrimaryBg,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.textInput,
  },
  optionLabelSelected: {
    color: semantic.actionPrimary,
  },
  optionDescription: {
    fontSize: 14,
    color: semantic.textSecondary,
  },
  actions: {
    gap: 8,
  },
})
