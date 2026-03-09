import { useState } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Button } from '@/components/ui/Button'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { semantic } from '@/theme/colors'

const NOTIFICATION_OPTIONS = [
  { key: 'rare', label: 'Rare bird alerts', description: 'Get notified when rare species are spotted nearby' },
  { key: 'community', label: 'Community activity', description: 'Updates from birders in your area' },
  { key: 'tips', label: 'Birding tips', description: 'Weekly tips to improve your skills' },
]

export default function NotificationsScreen() {
  const { push } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    rare: true,
    community: true,
    tips: false,
  })

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      <ProgressDots total={7} current={5} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.subtitle}>Choose which notifications you'd like to receive.</Text>

        <View style={styles.options}>
          {NOTIFICATION_OPTIONS.map((option) => (
            <View key={option.key} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{option.label}</Text>
                <Text style={styles.rowDescription}>{option.description}</Text>
              </View>
              <Switch
                value={enabled[option.key]}
                onValueChange={() => toggle(option.key)}
                trackColor={{ false: semantic.borderDefault, true: semantic.actionPrimary }}
                thumbColor={semantic.textInverse}
              />
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button title="Continue" onPress={() => push('/(onboarding)/summary')} />
        <Button
          title="Skip"
          variant="link"
          onPress={() => push('/(onboarding)/summary')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: semantic.textSecondary,
    lineHeight: 24,
  },
  options: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    gap: 16,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.textInput,
  },
  rowDescription: {
    fontSize: 13,
    color: semantic.textSecondary,
    lineHeight: 18,
  },
  actions: {
    gap: 8,
  },
})
