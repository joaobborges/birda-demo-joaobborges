import { useRef, useState, useCallback } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import BottomSheet from '@gorhom/bottom-sheet'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { AvatarPickerDrawer } from '@/components/onboarding/AvatarPickerDrawer'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { AVATAR_IMAGES } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { borderRadius } from '@/theme/components'

export default function NameScreen() {
  const { push } = useRouter()
  const [nameValue, setNameValue] = useState(useOnboardingStore.getState().name)
  const avatar = useOnboardingStore((s) => s.avatar)
  const setAvatar = useOnboardingStore((s) => s.setAvatar)

  const sheetRef = useRef<BottomSheet>(null)
  const animatedIndex = useSharedValue(-1)

  const handleContinue = () => {
    useOnboardingStore.getState().setName(nameValue.trim())
    push('/(onboarding)/birding-journey')
  }

  const handleSelectAvatar = useCallback(
    (key: string) => {
      setAvatar(key)
      sheetRef.current?.close()
    },
    [setAvatar]
  )

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, -0.5],
      [0, 1],
      Extrapolation.CLAMP,
    )
    return {
      opacity,
      pointerEvents: animatedIndex.value > -0.9 ? 'auto' : 'none',
    }
  })

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
            <Pressable
              onPress={() => sheetRef.current?.expand()}
              style={styles.avatarPressable}
            >
              <Image
                source={AVATAR_IMAGES[avatar]}
                style={styles.avatarPlaceholder}
                contentFit="cover"
              />
            </Pressable>
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
      </KeyboardAvoidingView>

      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => sheetRef.current?.close()}
        />
      </Animated.View>

      <AvatarPickerDrawer
        sheetRef={sheetRef}
        animatedIndex={animatedIndex}
        selectedAvatar={avatar}
        onSelect={handleSelectAvatar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  avatarPressable: {
    alignSelf: 'center',
    marginBottom: spacing['10'],
  },
  avatarPlaceholder: {
    height: 120,
    width: 120,
    backgroundColor: semantic.bgTinted,
    borderRadius: 60,
    borderCurve: 'continuous',
  },
  heading: {
    ...typography.h3,
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
})
