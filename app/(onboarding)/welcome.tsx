import { View, Text, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Button } from '@/components/ui/Button'
import { semantic, colors } from '@/theme/colors'

const birdLogo = require('@/assets/bird-logo.png')

export default function WelcomeScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: top + 60, paddingBottom: bottom + 20 }]}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.logoContainer}>
        <Image source={birdLogo} style={styles.logo} />
        <Text style={styles.title}>Birda</Text>
        <Text style={styles.tagline}>Your bird watching companion</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.actions}>
        <Button title="Get Started" onPress={() => push('/(onboarding)/name')} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.neutral950,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: semantic.textStrong,
    opacity: 0.4,
    fontWeight: '400',
  },
  actions: {
    gap: 12,
  },
})
