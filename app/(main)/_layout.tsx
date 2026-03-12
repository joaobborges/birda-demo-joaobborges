import { Tabs } from 'expo-router'
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { View, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors, semantic } from '@/theme/colors'
import { useFabStore } from '@/stores/fab'

function CustomTabBar(props: BottomTabBarProps) {
  const isOpen = useFabStore((s) => s.isOpen)

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
  }))

  return (
    <View>
      <BottomTabBar {...props} />
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.tabBarOverlay, overlayStyle]}
        pointerEvents="none"
      />
    </View>
  )
}

export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
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

const styles = StyleSheet.create({
  tabBarOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
})
