import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
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

const ITEM_SIZE = 44
const FAB_SIZE = 56
const ITEM_SPACING = 12
const ITEM_STEP = ITEM_SIZE + ITEM_SPACING

function MenuItem({
  config,
  index,
  progress,
  onPress,
}: {
  config: MenuItemConfig
  index: number
  progress: SharedValue<number>
  onPress: () => void
}) {
  const finalY = -((index + 1) * ITEM_STEP + (FAB_SIZE - ITEM_SIZE) / 2)

  const animStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [0, finalY],
      Extrapolation.CLAMP,
    )
    const scale = interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP)
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP)
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    }
  })

  return (
    <Animated.View style={[styles.menuItemContainer, animStyle]}>
      <Text style={styles.menuItemLabel}>{config.label}</Text>
      <Pressable style={styles.menuItemCircle} onPress={onPress}>
        <Ionicons name={config.icon} size={20} color={semantic.actionPrimary} />
      </Pressable>
    </Animated.View>
  )
}

export function CaptureFAB(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const progress = useSharedValue(0)

  function toggleMenu() {
    const next = isOpen ? 0 : 1
    setIsOpen(!isOpen)
    progress.value = withSpring(next, { damping: 15, stiffness: 200 })
  }

  function closeMenu() {
    setIsOpen(false)
    progress.value = withSpring(0, { damping: 15, stiffness: 200 })
  }

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }))

  const iconRotateStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [0, 45], Extrapolation.CLAMP)
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  return (
    <>
      {/* Overlay behind menu items but above map */}
      <Animated.View style={[StyleSheet.absoluteFillObject, styles.overlay, overlayStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeMenu} />
      </Animated.View>

      {/* FAB and menu items container */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        {/* Menu items */}
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={item.icon}
            config={item}
            index={index}
            progress={progress}
            onPress={closeMenu}
          />
        ))}

        {/* Main FAB button */}
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
  fabContainer: {
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
  menuItemContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  menuItemCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  menuItemLabel: {
    ...typography.caption,
    color: semantic.textPrimary,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: 6,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
})
