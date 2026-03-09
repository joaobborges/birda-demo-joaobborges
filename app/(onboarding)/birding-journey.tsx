import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

const LEVELS = [
  { key: 'new', label: 'New', description: "I'm new to birding" },
  { key: 'garden', label: 'Garden', description: 'I know a few garden birds' },
  { key: 'intermediate', label: 'Intermediate', description: 'I go birding regularly' },
  { key: 'expert', label: 'Expert', description: "I'm an experienced birder" },
] as const

type LevelKey = (typeof LEVELS)[number]['key']

const AVATAR_MAP: Record<LevelKey, { emoji: string; size: number; bgColor: string }> = {
  new: { emoji: '\u{1F95A}', size: 48, bgColor: semantic.bgTinted },
  garden: { emoji: '\u{1F426}', size: 56, bgColor: semantic.bgTinted },
  intermediate: { emoji: '\u{1F985}', size: 72, bgColor: semantic.bgTinted },
  expert: { emoji: '\u{1F989}', size: 88, bgColor: semantic.bgTinted },
}

export default function BirdingJourneyScreen() {
  const { push } = useRouter()
  const [selected, setSelected] = useState<LevelKey | null>(null)

  const handleContinue = () => {
    if (selected) {
      useOnboardingStore.getState().setBirdingJourney(selected)
      push('/(onboarding)/goals')
    }
  }

  return (
    <OnboardingLayout
      header={<ProgressDots total={3} current={1} />}
      footer={
        <View style={{ opacity: selected ? 1 : 0.5 }}>
          <Button title="Continue" onPress={handleContinue} />
        </View>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <Animated.View
          key={selected ?? 'default'}
          entering={FadeIn.duration(200)}
          style={styles.avatarPlaceholder}
        >
          <Text style={[styles.avatarEmoji, { fontSize: selected ? AVATAR_MAP[selected].size : 48 }]}>
            {selected ? AVATAR_MAP[selected].emoji : '\u{1F95A}'}
          </Text>
        </Animated.View>
        <Text style={styles.heading}>Your birding journey</Text>
        <Text style={styles.description}>
          What best describes your experience?
        </Text>

        <View style={styles.options}>
          {LEVELS.map((level) => (
            <Pressable
              key={level.key}
              style={[
                styles.chip,
                selected === level.key ? styles.chipSelected : styles.chipDefault,
              ]}
              onPress={() => setSelected(level.key)}
            >
              <Text style={styles.chipLabel}>{level.label}</Text>
              <Text style={styles.chipDescription}>{level.description}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  avatarPlaceholder: {
    height: 120,
    width: 120,
    backgroundColor: semantic.bgTinted,
    borderRadius: 60,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginBottom: spacing['6'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    textAlign: 'center',
  },
  heading: {
    ...typography.h3,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: spacing['2'],
  },
  options: {
    gap: spacing['3'],
    marginTop: spacing['6'],
  },
  chip: {
    flexDirection: 'row',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['5'],
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    alignItems: 'center',
    gap: spacing['2'],
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
    ...typography.bodySmall,
    fontFamily: fontWeights.semiBold,
    color: semantic.textPrimary,
  },
  chipDescription: {
    ...typography.caption,
    color: semantic.textSecondary,
    flex: 1,
  },
})
