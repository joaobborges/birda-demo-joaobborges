import { StyleSheet, Dimensions } from 'react-native'
import { Text } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { ONBOARDING_IMAGES } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function DiscoverScreen() {
  const { push } = useRouter()

  return (
    <OnboardingLayout
      illustration={<Image source={ONBOARDING_IMAGES['discover']} style={styles.illustration} contentFit="cover" />}
      header={<ProgressDots total={4} current={2} />}
      footer={
        <Button
          title="Continue"
          onPress={() => push('/(onboarding)/community')}
        />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>Explore & Record</Text>
        <Text style={styles.description}>
          Find new species and birding spots near you.{'\n'}Log every sighting and track your life list.
        </Text>
      </Animated.View>
    </OnboardingLayout>
  )
}

const { height: screenHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  illustration: {
    height: screenHeight * 0.45,
    backgroundColor: semantic.bgTinted,
  },
  content: {},
  heading: {
    ...typography.h2,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: spacing['3'],
  },
})
