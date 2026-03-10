import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors, semantic } from '@/theme/colors'

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: semantic.actionPrimary,
        tabBarInactiveTintColor: colors.neutral400,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          headerShown: true,
          title: 'Community',
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: 'Logbook',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
