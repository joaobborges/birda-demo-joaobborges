import { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'
import { typography, fontWeights } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { borderRadius } from '@/theme/components'

export default function NameScreen() {
  const { push } = useRouter()
  const [nameValue, setNameValue] = useState(useOnboardingStore.getState().name)

  const handleContinue = () => {
    useOnboardingStore.getState().setName(nameValue.trim())
    push('/(onboarding)/birding-journey')
  }

  return (
    <OnboardingLayout
      header={<ProgressDots total={3} current={0} />}
      footer={
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!nameValue.trim()}
        />
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.heading}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={semantic.textMuted}
          value={nameValue}
          onChangeText={setNameValue}
          autoCapitalize="words"
          returnKeyType="done"
        />
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
    marginBottom: spacing['10'],
  },
  heading: {
    ...typography.subheading,
    fontFamily: fontWeights.bold,
    fontSize: 24,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  input: {
    ...typography.bodySmall,
    backgroundColor: semantic.bgSurface,
    borderRadius: borderRadius.xl,
    borderCurve: 'continuous',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['4'],
    color: semantic.textPrimary,
    marginTop: spacing['5'],
  },
})
