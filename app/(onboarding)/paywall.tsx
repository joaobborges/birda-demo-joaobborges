import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

const FEATURES = [
  'Unlimited bird identifications',
  'Offline maps & field guides',
  'Rare bird alerts in your area',
  'Community sighting reports',
]

export default function PaywallScreen() {
  const { replace } = useRouter()
  const { top, bottom } = useSafeAreaInsets()
  const { name, completeOnboarding } = useOnboardingStore()
  const params = useLocalSearchParams<{ variant?: string }>()
  const isNatureDay = params.variant === 'nature-day'

  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const togglePosition = useSharedValue(1)

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(togglePosition.get() * 148, { damping: 15 }) }],
  }))

  const selectPlan = (p: 'monthly' | 'annual') => {
    setPlan(p)
    togglePosition.set(p === 'monthly' ? 0 : 1)
  }

  const handleSubscribe = () => {
    completeOnboarding()
    replace('/(main)')
  }

  const handleFree = () => {
    completeOnboarding()
    replace('/(main)')
  }

  const monthlyPrice = isNatureDay ? '$3.99' : '$4.99'
  const annualPrice = isNatureDay ? '$31.99' : '$39.99'

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      {isNatureDay ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.banner}>
          <Text style={styles.bannerEmoji}>🌿</Text>
          <Text style={styles.bannerText}>Nature Day — 20% off today only</Text>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.content}>
        <Text style={styles.title}>
          {name ? `${name}, unlock` : 'Unlock'} the full experience
        </Text>

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.toggle}>
          <Animated.View style={[styles.toggleIndicator, toggleStyle]} />
          <Pressable style={styles.toggleOption} onPress={() => selectPlan('monthly')}>
            <Text style={[styles.toggleLabel, plan === 'monthly' ? styles.toggleLabelActive : null]}>
              Monthly
            </Text>
            <Text style={[styles.togglePrice, plan === 'monthly' ? styles.togglePriceActive : null]}>
              {monthlyPrice}/mo
            </Text>
          </Pressable>
          <Pressable style={styles.toggleOption} onPress={() => selectPlan('annual')}>
            <Text style={[styles.toggleLabel, plan === 'annual' ? styles.toggleLabelActive : null]}>
              Annual
            </Text>
            <Text style={[styles.togglePrice, plan === 'annual' ? styles.togglePriceActive : null]}>
              {annualPrice}/yr
            </Text>
            {plan === 'annual' ? <Text style={styles.valueBadge}>Best value</Text> : null}
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button
          title={isNatureDay ? 'Claim My Discount' : 'Start Free Trial'}
          onPress={handleSubscribe}
        />
        <Button
          title="Continue with free plan"
          variant="link"
          onPress={handleFree}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: semantic.statusSuccessBg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  bannerEmoji: {
    fontSize: 20,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: semantic.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: semantic.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    fontSize: 18,
    color: semantic.actionPrimary,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 16,
    color: semantic.textBody,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: semantic.bgSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 4,
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 148,
    height: '100%',
    backgroundColor: semantic.bgPage,
    borderRadius: 12,
    borderCurve: 'continuous',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 2,
    zIndex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semantic.textMuted,
  },
  toggleLabelActive: {
    color: semantic.textInput,
  },
  togglePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: semantic.textMuted,
  },
  togglePriceActive: {
    color: semantic.textPrimary,
  },
  valueBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: semantic.actionSecondaryText,
    backgroundColor: semantic.actionPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
})
