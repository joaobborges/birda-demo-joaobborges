import { useRef } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

export default function NameScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const nameRef = useRef('')

  const handleContinue = () => {
    useOnboardingStore.getState().setName(nameRef.current)
    push('/(onboarding)/location')
  }

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={1} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={semantic.textMuted}
          defaultValue={nameRef.current}
          onChangeText={(text) => {
            nameRef.current = text
          }}
          autoFocus
          autoCapitalize="words"
          returnKeyType="done"
        />
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={handleContinue} />
        <Button
          title="Skip"
          variant="link"
          onPress={() => push('/(onboarding)/location')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: semantic.textPrimary,
    paddingVertical: 12,
    color: semantic.textInput,
  },
  actions: {
    gap: 8,
  },
})
