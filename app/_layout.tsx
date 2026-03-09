import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
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

  if (!isHydrated || (!fontsLoaded && !fontError)) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      {DevPanel ? <DevPanel /> : null}
    </GestureHandlerRootView>
  )
}
