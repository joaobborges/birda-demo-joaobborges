import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        animation: 'fade',
      }}
    />
  )
}
