import { StyleSheet, Dimensions } from 'react-native'
import { Text } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { ONBOARDING_IMAGES } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function RemindersScreen() {
  const { push } = useRouter()

  const handleRemindMe = () => {
    push('/(onboarding)/mailing-list')
  }

  const handleMaybeLater = () => {
    push('/(onboarding)/mailing-list')
  }

  return (
    <OnboardingLayout
      illustration={<Image source={ONBOARDING_IMAGES['reminders']} style={styles.illustration} contentFit="cover" />}
      footer={
        <>
          <Button title="Remind me" onPress={handleRemindMe} />
          <Button title="Maybe later" variant="link" onPress={handleMaybeLater} />
        </>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <Text style={styles.heading}>Stay in the loop</Text>
        <Text style={styles.description}>
          Get reminders about nearby bird activity and seasonal migrations
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
