import { useRef } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'

export default function NameScreen() {
  const { push } = useRouter()
  const nameRef = useRef('')

  const handleContinue = () => {
    useOnboardingStore.getState().setName(nameRef.current)
    push('/(onboarding)/birding-journey')
  }

  return (
    <OnboardingLayout
      header={<ProgressDots total={3} current={0} />}
      footer={
        <>
          <Button title="Continue" onPress={handleContinue} />
          <Button
            title="Skip"
            variant="link"
            onPress={() => push('/(onboarding)/birding-journey')}
          />
        </>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.heading}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={semantic.textMuted}
          defaultValue={useOnboardingStore.getState().name}
          onChangeText={(text) => {
            nameRef.current = text
          }}
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
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  input: {
    backgroundColor: semantic.bgSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: semantic.textPrimary,
    marginTop: 20,
  },
})
