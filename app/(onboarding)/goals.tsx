import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'

const GOALS = [
  'Spend more time outside',
  'Discover birding locations',
  'Identify birds',
  'Track my sightings',
  'Connect with other birders',
] as const

export default function GoalsScreen() {
  const { push } = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = () => {
    useOnboardingStore.getState().setGoals(selectedGoals)
    push('/(onboarding)/paywall')
  }

  return (
    <OnboardingLayout
      illustration={<View style={styles.illustration} />}
      header={<ProgressDots total={3} current={2} />}
      footer={<Button title="Continue" onPress={handleContinue} />}
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>What are your goals?</Text>

        <View style={styles.options}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal)
            return (
              <Pressable
                key={goal}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipDefault,
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text style={styles.chipLabel}>{goal}</Text>
              </Pressable>
            )
          })}
        </View>
      </Animated.View>
    </OnboardingLayout>
  )
}

const { height: screenHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  illustration: {
    height: screenHeight * 0.4,
    backgroundColor: semantic.bgTinted,
  },
  content: {
    paddingTop: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  options: {
    gap: 12,
    marginTop: 24,
  },
  chip: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    alignItems: 'center',
  },
  chipDefault: {
    borderColor: semantic.borderDefault,
    backgroundColor: semantic.bgPage,
  },
  chipSelected: {
    borderColor: semantic.actionPrimary,
    backgroundColor: semantic.actionPrimaryBg,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.textPrimary,
  },
})
