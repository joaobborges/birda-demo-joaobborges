import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

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
    gap: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  imagePlaceholder: {
    height: 200,
    width: 200,
    backgroundColor: semantic.bgTinted,
    borderRadius: 100,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginVertical: 40,
  },
})
