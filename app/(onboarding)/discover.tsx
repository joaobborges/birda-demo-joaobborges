import { View, Text, StyleSheet, Dimensions } from 'react-native'
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
      illustration={<View style={styles.illustration} />}
      header={<ProgressDots total={4} current={2} />}
      footer={
        <Button
          title="Continue"
          onPress={() => push('/(onboarding)/community')}
        />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.description}>
          Discover nearby birds and locations
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
    paddingTop: 24,
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
