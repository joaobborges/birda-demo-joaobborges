import { useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { semantic } from '@/theme/colors'
import { buttons } from '@/theme/components'
import { fontWeights } from '@/theme/typography'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const pressed = useSharedValue(0)
  const disabledProgress = useSharedValue(disabled ? 1 : 0)

  useEffect(() => {
    disabledProgress.set(withSpring(disabled ? 1 : 0, { duration: 200 }))
  }, [disabled, disabledProgress])

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 100 }))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 200 }))
    })
    .onEnd(() => {
      runOnJS(handlePress)()
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) },
    ],
    opacity: interpolate(disabledProgress.get(), [0, 1], [1, 0.4]),
  }))

  if (variant === 'link') {
    return (
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle} pointerEvents={disabled ? 'none' : 'auto'}>
          <Text style={styles.linkText}>{title}</Text>
        </Animated.View>
      </GestureDetector>
    )
  }

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        pointerEvents={disabled ? 'none' : 'auto'}
        style={[
          styles.button,
          variant === 'secondary'
            ? styles.secondary
            : variant === 'ghost'
              ? styles.ghost
              : styles.primary,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            variant === 'secondary'
              ? styles.secondaryText
              : variant === 'ghost'
                ? styles.ghostText
                : styles.primaryText,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  button: {
    ...buttons.default,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: semantic.actionPrimary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: semantic.actionPrimary,
  },
  text: {
    fontFamily: fontWeights.semiBold,
    fontSize: 15,
  },
  primaryText: {
    color: semantic.actionSecondaryText,
  },
  secondaryText: {
    color: semantic.actionPrimary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: semantic.textSecondary,
  },
  linkText: {
    fontFamily: fontWeights.regular,
    fontSize: 15,
    color: semantic.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
})
