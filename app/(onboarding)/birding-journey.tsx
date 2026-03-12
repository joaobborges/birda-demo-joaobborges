import { useState, useRef, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
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

const LEVELS = [
  { key: 'new', label: 'New', description: "I'm new to birding" },
  { key: 'garden', label: 'Garden', description: 'I know a few garden birds' },
  { key: 'intermediate', label: 'Intermediate', description: 'I go birding regularly' },
  { key: 'expert', label: 'Expert', description: "I'm an experienced birder" },
] as const

type LevelKey = (typeof LEVELS)[number]['key']

export default function BirdingJourneyScreen() {
  const { push } = useRouter()
  const [selected, setSelected] = useState<LevelKey>('new')
  const lastSelected = useRef<LevelKey>('new')

  const player = useVideoPlayer(AVATAR_VIDEOS['new'], (p) => {
    p.loop = false
    p.play()
  })

  const handleSelect = useCallback(async (key: LevelKey) => {
    if (key === lastSelected.current) {
      player.currentTime = 0
      player.play()
    } else {
      await player.replaceAsync(AVATAR_VIDEOS[key])
      player.play()
    }

    lastSelected.current = key
    setSelected(key)
  }, [player])

  const handleContinue = () => {
    useOnboardingStore.getState().setBirdingJourney(selected)
    push('/(onboarding)/goals')
  }

  return (
    <OnboardingLayout
      header={<ProgressDots total={3} current={1} />}
      footer={
        <Button title="Continue" onPress={handleContinue} />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
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
              onPress={() => handleSelect(level.key)}
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
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderRadius: borderRadius.full,
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
