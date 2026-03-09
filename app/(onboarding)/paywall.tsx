import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

const FEATURES = [
  'Unlimited bird identifications',
  'Offline maps & field guides',
  'Rare bird alerts in your area',
  'Community sighting reports',
]

export default function PaywallScreen() {
  const { push } = useRouter()
  const { name } = useOnboardingStore()
  const params = useLocalSearchParams<{ variant?: string }>()
  const isNatureDay = params.variant === 'nature-day'

  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')

  const monthlyWidth = useSharedValue(0)
  const annualWidth = useSharedValue(0)
  const measured = useSharedValue(0)

  const indicatorStyle = useAnimatedStyle(() => ({
    width: withSpring(plan === 'monthly' ? monthlyWidth.get() : annualWidth.get(), { damping: 15 }),
    transform: [{ translateX: withSpring(plan === 'monthly' ? 0 : monthlyWidth.get(), { damping: 15 }) }],
    opacity: measured.get() >= 2 ? 1 : 0,
  }))

  const selectPlan = (p: 'monthly' | 'annual') => {
    setPlan(p)
  }

  const handleSubscribe = () => {
    push('/(onboarding)/reminders')
  }

  const handleFree = () => {
    push('/(onboarding)/reminders')
  }

  const monthlyPrice = isNatureDay ? '$3.99' : '$4.99'
  const annualPrice = isNatureDay ? '$31.99' : '$39.99'

  return (
    <OnboardingLayout>
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.scrollContent}>
        {/* Hero image placeholder */}
        <View
          style={[
            styles.hero,
            { backgroundColor: isNatureDay ? semantic.accent : semantic.bgTinted },
          ]}
        />

        {/* Nature Day promotional banner */}
        {isNatureDay ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>🌿 Nature Day — 20% off today only</Text>
          </View>
        ) : null}

        {/* Personalized headline */}
        <Text style={styles.title}>
          {name ? `${name}, unlock the full experience` : 'Unlock the full experience'}
        </Text>

        {/* Feature list */}
        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Adaptive-width toggle */}
        <View style={styles.toggle}>
          <Animated.View style={[styles.toggleIndicator, indicatorStyle]} />
          <Pressable
            style={styles.toggleOption}
            onPress={() => selectPlan('monthly')}
            onLayout={(e) => {
              monthlyWidth.set(e.nativeEvent.layout.width)
              measured.set(measured.get() + 1)
            }}
          >
            <Text style={[styles.toggleLabel, plan === 'monthly' ? styles.toggleLabelActive : null]}>
              Monthly
            </Text>
            <Text style={[styles.togglePrice, plan === 'monthly' ? styles.togglePriceActive : null]}>
              {monthlyPrice}/mo
            </Text>
          </Pressable>
          <Pressable
            style={styles.toggleOption}
            onPress={() => selectPlan('annual')}
            onLayout={(e) => {
              annualWidth.set(e.nativeEvent.layout.width)
              measured.set(measured.get() + 1)
            }}
          >
            <Text style={[styles.toggleLabel, plan === 'annual' ? styles.toggleLabelActive : null]}>
              Annual
            </Text>
            <Text style={[styles.togglePrice, plan === 'annual' ? styles.togglePriceActive : null]}>
              {annualPrice}/yr
            </Text>
            {plan === 'annual' ? <Text style={styles.valueBadge}>Best value</Text> : null}
          </Pressable>
        </View>

        {/* Action buttons */}
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
      </Animated.View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 24,
  },
  hero: {
    height: 220,
    marginHorizontal: -24,
    marginTop: -20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderCurve: 'continuous',
  },
  banner: {
    backgroundColor: semantic.statusSuccessBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginTop: -20,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: semantic.textPrimary,
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
    alignSelf: 'center',
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
    height: '100%',
    backgroundColor: semantic.bgPage,
    borderRadius: 12,
    borderCurve: 'continuous',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  toggleOption: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
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
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
})
