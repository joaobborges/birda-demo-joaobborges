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
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="community"
        options={{
          headerShown: true,
          title: 'Community Sightings',
          headerBackTitle: '',
        }}
      />
    </Stack>
  )
}
