import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'

export default function WelcomeScreen() {
  const { push } = useRouter()
  const termsAccepted = useOnboardingStore((s) => s.termsAccepted)
  const setTermsAccepted = useOnboardingStore((s) => s.setTermsAccepted)

  const handleNavigate = () => {
    if (termsAccepted) {
      push('/(onboarding)/ai-bird-id')
    }
  }

  return (
    <OnboardingLayout
      illustration={<View style={styles.illustration} />}
      footer={
        <View style={{ opacity: termsAccepted ? 1 : 0.5, gap: spacing['1'] }}>
          <Button title="Create Account" onPress={handleNavigate} />
          <Button title="Log in" variant="ghost" onPress={handleNavigate} />
        </View>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>Welcome to Birda</Text>
        <Text style={styles.description}>
          Discover, identify, and log birds around you
        </Text>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted ? styles.checkboxChecked : styles.checkboxUnchecked,
            ]}
          >
            {termsAccepted ? (
              <Text style={styles.checkmark}>{'✓'}</Text>
            ) : null}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </Pressable>
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
  content: {
    paddingTop: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: semantic.textPrimary,
  },
  description: {
    fontSize: 16,
    color: semantic.textSecondary,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: spacing['4'],
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    borderWidth: 1.5,
    borderColor: semantic.borderDefault,
  },
  checkboxChecked: {
    backgroundColor: semantic.actionPrimary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: semantic.textSecondary,
    flex: 1,
  },
})
