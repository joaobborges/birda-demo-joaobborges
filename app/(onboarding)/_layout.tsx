import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="dark" translucent />
      <Stack
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          animation: 'fade',
          statusBarTranslucent: true,
        }}
      />
    </>
  )
}
