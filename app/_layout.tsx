import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts, Rubik_300Light, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold, Rubik_700Bold } from '@expo-google-fonts/rubik'
import { useOnboardingStore } from '@/stores/onboarding'

SplashScreen.preventAutoHideAsync()

const DevPanel = __DEV__ ? require('@/components/dev/DevPanel').default : null

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  })

  const [isHydrated, setIsHydrated] = useState(
    useOnboardingStore.persist.hasHydrated()
  )

  const [devPanelVisible, setDevPanelVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (isHydrated && (fontsLoaded || fontError)) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isHydrated, fontsLoaded, fontError])

  const tripleTap = Gesture.Tap()
    .numberOfTaps(3)
    .maxDuration(500)
    .runOnJS(true)
    .onEnd(() => setDevPanelVisible(true))

  if (!isHydrated || (!fontsLoaded && !fontError)) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <GestureDetector gesture={tripleTap}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </GestureDetector>
      {DevPanel ? (
        <DevPanel
          visible={devPanelVisible}
          onClose={() => setDevPanelVisible(false)}
        />
      ) : null}
    </GestureHandlerRootView>
  )
}
