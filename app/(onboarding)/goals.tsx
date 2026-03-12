import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { AVATAR_VIDEOS } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'
import { borderRadius } from '@/theme/components'

const GOALS = [
  'Spend more time outside',
  'Discover birding locations',
  'Identify birds',
  'Track my sightings',
  'Connect with other birders',
] as const

export default function GoalsScreen() {
  const { push } = useRouter()
  const { top } = useSafeAreaInsets()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const player = useVideoPlayer(AVATAR_VIDEOS['goals'], (p) => {
    p.loop = true
    p.play()
  })

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = () => {
    useOnboardingStore.getState().setGoals(selectedGoals)
    push('/(onboarding)/reminders')
  }

  return (
    <OnboardingLayout
      illustration={
        <Animated.View entering={FadeIn.delay(100).duration(300)} style={[styles.illustrationContent, { paddingTop: top + spacing['14'] }]}>
          <View style={styles.avatarPlaceholder}>
            <VideoView
              player={player}
              style={styles.avatarImage}
              contentFit="contain"
              nativeControls={false}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
            />
          </View>
          <Text style={styles.heading}>What are your goals?</Text>
        </Animated.View>
      }
      header={<ProgressDots total={3} current={2} />}
      footer={<Button title="Continue" onPress={handleContinue} />}
    >
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
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{goal}</Text>
            </Pressable>
          )
        })}
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  illustrationContent: {
    paddingHorizontal: spacing['6'],
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 140,
    aspectRatio: 544 / 720,
    backgroundColor: semantic.bgTinted,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: spacing['6'],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  heading: {
    ...typography.h3,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  options: {
    gap: spacing['2'],
    marginTop: spacing['4'],
    marginHorizontal: -spacing['2'],
  },
  chip: {
    height: 44,
    paddingHorizontal: spacing['4'],
    borderRadius: borderRadius.full,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  chipDefault: {
    borderColor: semantic.borderDefault,
    backgroundColor: semantic.bgPage,
  },
  chipSelected: {
    borderColor: semantic.actionPrimary,
    backgroundColor: semantic.actionPrimary,
  },
  chipLabel: {
    ...typography.bodySmall,
    fontFamily: fontWeights.semiBold,
    color: semantic.textPrimary,
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
})
