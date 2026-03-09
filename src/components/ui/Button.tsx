import { StyleSheet, Text } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { semantic } from '@/theme/colors'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'link'
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const pressed = useSharedValue(0)

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  const tap = Gesture.Tap()
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
  }))

  if (variant === 'link') {
    return (
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>
          <Text style={styles.linkText}>{title}</Text>
        </Animated.View>
      </GestureDetector>
    )
  }

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.button,
          variant === 'secondary' ? styles.secondary : styles.primary,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            variant === 'secondary' ? styles.secondaryText : styles.primaryText,
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: semantic.actionSecondary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: semantic.actionSecondary,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryText: {
    color: semantic.actionSecondaryText,
  },
  secondaryText: {
    color: semantic.actionSecondary,
  },
  linkText: {
    fontSize: 15,
    color: semantic.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
})
