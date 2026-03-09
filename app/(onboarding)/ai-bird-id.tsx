import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function AIBirdIdScreen() {
  const { push } = useRouter()

  return (
    <OnboardingLayout
      illustration={<View style={styles.illustration} />}
      header={<ProgressDots total={4} current={0} />}
      footer={
        <Button
          title="Continue"
          onPress={() => push('/(onboarding)/green-time')}
        />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>AI Bird ID</Text>
        <Text style={styles.description}>
          Identify birds with AI photo recognition
        </Text>
      </Animated.View>
    </OnboardingLayout>
  )
}

const { height: screenHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  illustration: {
    height: screenHeight * 0.5,
    backgroundColor: semantic.bgTinted,
  },
  content: {
    paddingTop: spacing['6'],
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
