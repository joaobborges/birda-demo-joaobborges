import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useRef } from 'react'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

export default function LocationScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const locationRef = useRef('')

  const handleContinue = () => {
    useOnboardingStore.getState().setLocation(locationRef.current)
    push('/(onboarding)/skill-level')
  }

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={2} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>Where do you go birding?</Text>
        <Text style={styles.subtitle}>
          Enter your city or region to get local bird recommendations.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lisbon, Portugal"
          placeholderTextColor={semantic.textMuted}
          defaultValue={locationRef.current}
          onChangeText={(text) => {
            locationRef.current = text
          }}
          autoFocus
          returnKeyType="done"
        />
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={handleContinue} />
        <Button
          title="Skip"
          variant="link"
          onPress={() => push('/(onboarding)/skill-level')}
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
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: semantic.textSecondary,
    lineHeight: 24,
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
