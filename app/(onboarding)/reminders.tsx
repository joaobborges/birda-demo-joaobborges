import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
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
      footer={
        <>
          <Button title="Remind me" onPress={handleRemindMe} />
          <Button title="Maybe later" variant="link" onPress={handleMaybeLater} />
        </>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>Stay in the loop</Text>
        <Text style={styles.description}>
          Get reminders about nearby bird activity and seasonal migrations
        </Text>
        <View style={styles.imagePlaceholder} />
      </Animated.View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing['2'],
    flexShrink: 1,
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
  imagePlaceholder: {
    height: 200,
    width: 200,
    backgroundColor: semantic.bgTinted,
    borderRadius: 100,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginVertical: spacing['6'],
    flexShrink: 1,
  },
})
