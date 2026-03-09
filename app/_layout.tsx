import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import { useOnboardingStore } from '@/stores/onboarding'

SplashScreen.preventAutoHideAsync()

const DevPanel = __DEV__ ? require('@/components/dev/DevPanel').default : null

export default function RootLayout() {
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
    if (isHydrated) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isHydrated])

  if (!isHydrated) {
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
