import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { semantic } from '@/theme/colors'
import { fontWeights } from '@/theme/typography'
import { borderRadius } from '@/theme/components'

interface AuthOptionButtonProps {
  icon: 'apple' | 'google' | 'email'
  onPress: () => void
}

const AUTH_OPTIONS = {
  apple: {
    iconName: 'logo-apple' as const,
    label: 'Continue with Apple',
    bg: '#000000',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: undefined as string | undefined,
  },
  google: {
    iconName: 'logo-google' as const,
    label: 'Continue with Google',
    bg: '#FFFFFF',
    textColor: '#000000',
    iconColor: '#000000',
    borderColor: semantic.borderDefault,
  },
  email: {
    iconName: 'mail-outline' as const,
    label: 'Continue with Email',
    bg: semantic.actionPrimary,
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    borderColor: undefined as string | undefined,
  },
} as const

export function AuthOptionButton({ icon, onPress }: AuthOptionButtonProps) {
  const config = AUTH_OPTIONS[icon]

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: config.bg,
          opacity: pressed ? 0.85 : 1,
          borderColor: config.borderColor,
          borderWidth: config.borderColor ? 1 : 0,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={config.iconName}
          size={20}
          color={config.iconColor}
        />
      </View>
      <Text
        style={[
          styles.label,
          { color: config.textColor },
        ]}
      >
        {config.label}
      </Text>
      {/* Spacer to balance icon on left for centered text */}
      <View style={styles.iconContainer} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontWeights.medium,
    fontSize: 16,
    lineHeight: 22,
  },
})
