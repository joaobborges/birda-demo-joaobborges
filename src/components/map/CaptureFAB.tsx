import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type MenuItemConfig = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
}

const MENU_ITEMS: MenuItemConfig[] = [
  { icon: 'document-text', label: 'Notes' },
  { icon: 'mic', label: 'Microphone' },
  { icon: 'camera', label: 'Camera' },
]

const FAB_SIZE = 56
const ITEM_SPACING = 16
const FADE_DURATION = 200

export function CaptureFAB(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const progress = useSharedValue(0)

  function toggleMenu() {
    const next = isOpen ? 0 : 1
    setIsOpen(!isOpen)
    progress.value = withTiming(next, { duration: FADE_DURATION })
  }

  function closeMenu() {
    setIsOpen(false)
    progress.value = withTiming(0, { duration: FADE_DURATION })
  }

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }))

  const iconRotateStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [0, 45], Extrapolation.CLAMP)
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  const menuStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }))

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.overlay, overlayStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeMenu} />
      </Animated.View>

      {/* FAB + menu column */}
      <View style={styles.fabColumn} pointerEvents="box-none">
        {/* Menu items — fade in/out */}
        <Animated.View style={[styles.menuItems, menuStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
          {MENU_ITEMS.map((item) => (
            <View key={item.icon} style={styles.menuRow}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Pressable style={styles.menuCircle} onPress={closeMenu}>
                <Ionicons name={item.icon} size={24} color={semantic.actionPrimary} />
              </Pressable>
            </View>
          ))}
        </Animated.View>

        {/* Main FAB */}
        <Pressable style={styles.fab} onPress={toggleMenu}>
          <Animated.View style={iconRotateStyle}>
            <Ionicons name="add" size={28} color={semantic.textInverse} />
          </Animated.View>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  fabColumn: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderCurve: 'continuous',
    backgroundColor: semantic.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  },
  menuItems: {
    gap: ITEM_SPACING,
    marginBottom: ITEM_SPACING,
    alignItems: 'flex-end',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  menuLabel: {
    ...typography.caption,
    color: semantic.textPrimary,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: spacing['3'],
    paddingVertical: 6,
    borderRadius: 8,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  menuCircle: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
})
