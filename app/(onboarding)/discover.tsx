import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

export default function DiscoverScreen() {
  const { push } = useRouter()

  return (
    <OnboardingLayout
      header={<ProgressDots total={4} current={2} />}
      footer={
        <Button
          title="Continue"
          onPress={() => push('/(onboarding)/community')}
        />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <View style={styles.imagePlaceholder} />
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.description}>
          Discover nearby birds and locations
        </Text>
      </Animated.View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  imagePlaceholder: {
    height: 280,
    backgroundColor: semantic.bgTinted,
    borderRadius: 24,
    borderCurve: 'continuous',
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
})
