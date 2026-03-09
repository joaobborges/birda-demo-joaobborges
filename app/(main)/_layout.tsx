import { Stack } from 'expo-router'

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="community"
        options={{
          headerShown: true,
          title: 'Community Sightings',
        }}
      />
    </Stack>
  )
}
