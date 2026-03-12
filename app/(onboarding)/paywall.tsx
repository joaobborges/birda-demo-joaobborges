import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '@/stores/onboarding'
import { PAYWALL_HERO, PAYWALL_HAPPY_BIRDERS, PAYWALL_STORE } from '@/data/imageManifest'
import { semantic, colors } from '@/theme/colors'
import { typography, fontWeights } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { buttons } from '@/theme/components'

const HERO_HEIGHT = Dimensions.get('window').height * 0.35

const FEATURES = [
  'Offline maps and field guides',
  'Rare bird alerts in your area',
  'AI sighting reports',
]

export default function PaywallScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding)

  const handleDismiss = () => {
    completeOnboarding()
    router.replace('/(main)')
  }

  return (
    <View style={styles.root}>
      {/* Zone 1 — Hero */}
      <View style={[styles.hero, { height: HERO_HEIGHT }]}>
        <Image
          source={PAYWALL_HERO}
          style={[StyleSheet.absoluteFillObject, styles.heroImage]}
          contentFit="cover"
        />

        {/* Close button */}
        <Pressable
          onPress={handleDismiss}
          style={[styles.closeButton, { top: insets.top + 12 }]}
        >
          {({ pressed }) => (
            <View style={[styles.closeCircle, { opacity: pressed ? 0.7 : 1 }]}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </View>
          )}
        </Pressable>

        {/* Nature Day banner */}
        <View style={styles.natureDayBanner}>
          <Text style={styles.natureDayText}>
            Nature Day Special — <Text style={styles.natureDayBold}>Save €4,00/year</Text>
          </Text>
        </View>
      </View>

      {/* Zone 2 — Body */}
      <View style={styles.body}>
        {/* Headline */}
        <Text style={styles.headline}>Unlock the full experience</Text>

        {/* Feature bullets */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Ionicons name="ribbon" size={18} color={semantic.actionPrimary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Social proof placeholders */}
        <View style={styles.socialRow}>
          <Image source={PAYWALL_HAPPY_BIRDERS} style={styles.socialBox} contentFit="contain" />
          <Image source={PAYWALL_STORE} style={styles.socialBox} contentFit="contain" />
        </View>

        {/* Unlock pill + Pricing */}
        <View style={styles.pricingSection}>
          <View style={styles.unlockPill}>
            <Ionicons name="flash" size={14} color={semantic.textSecondary} />
            <Text style={styles.unlockPillText}>Unlock all features</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>10% off</Text>
            </View>
          </View>

          <View style={styles.pricingBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.priceMain}>€3,00</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.priceAnnual}>€35,99 billed annually after trial</Text>
          </View>
        </View>

        {/* Trust line */}
        <View style={styles.trustLine}>
          <Ionicons name="shield-checkmark" size={16} color={colors.markerCommon} />
          <Text style={styles.trustText}>No payment required · Cancel anytime</Text>
        </View>
      </View>

      {/* Zone 3 — Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        {/* CTA — custom Pressable (not Button.tsx) for mixed-weight text */}
        <Pressable
          onPress={handleDismiss}
          style={({ pressed }) => [styles.ctaButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.ctaText}>
            Redeem your <Text style={styles.ctaTextBold}>FREE</Text> Week
          </Text>
        </Pressable>

        {/* Footer links */}
        <View style={styles.footerLinks}>
          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>Terms of Use</Text>
          </Pressable>
          <Text style={styles.footerDot}> · </Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>Restore Purchase</Text>
          </Pressable>
          <Text style={styles.footerDot}> · </Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },

  // ── Zone 1: Hero ──
  hero: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    // Placeholder tint while image loads; replaced by actual hero art when provided
    backgroundColor: semantic.bgTinted,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  natureDayBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  natureDayText: {
    fontFamily: fontWeights.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  natureDayBold: {
    fontFamily: fontWeights.bold,
  },

  // ── Zone 2: Body ──
  body: {
    flex: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['5'],
    justifyContent: 'space-evenly',
  },
  headline: {
    ...typography.h2,
    color: semantic.textPrimary,
    textAlign: 'left',
  },
  featuresContainer: {
    gap: 14, // no exact token
    alignItems: 'flex-start',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  featureText: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // no exact token
  },
  socialBox: {
    flex: 1,
    height: 50,
    borderRadius: 12, // no exact token
    borderCurve: 'continuous',
  },
  pricingSection: {
    alignItems: 'center',
    gap: 12,
  },
  unlockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // no exact token
    alignSelf: 'center',
    backgroundColor: semantic.bgSurface,
    paddingVertical: 6, // no exact token
    paddingHorizontal: 14, // no exact token
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  unlockPillText: {
    fontFamily: fontWeights.medium,
    fontSize: 13, // no exact token
    color: semantic.textSecondary,
  },
  discountBadge: {
    backgroundColor: colors.markerCommon,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  discountBadgeText: {
    fontFamily: fontWeights.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  pricingBlock: {
    alignItems: 'center',
    gap: 4, // no exact token
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceMain: {
    fontFamily: fontWeights.bold,
    fontSize: 32, // no exact token — non-standard size per project convention
    color: semantic.textPrimary,
  },
  pricePeriod: {
    fontFamily: fontWeights.regular,
    fontSize: 12, // no exact token — matches trustText
    color: semantic.textMuted,
  },
  priceAnnual: {
    ...typography.caption,
    color: semantic.textMuted,
  },
  trustLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // no exact token
    alignSelf: 'center',
  },
  trustText: {
    fontFamily: fontWeights.regular,
    fontSize: 14, // no exact token
    color: semantic.textSecondary,
  },

  // ── Zone 3: Footer ──
  footer: {
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  ctaButton: {
    ...buttons.cta,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 15, // no exact token — per project convention for CTA labels
    color: semantic.actionSecondaryText,
  },
  ctaTextBold: {
    fontFamily: fontWeights.bold,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    fontFamily: fontWeights.regular,
    fontSize: 14, // no exact token
    color: semantic.textSecondary,
  },
  footerDot: {
    fontFamily: fontWeights.regular,
    fontSize: 14, // no exact token
    color: semantic.textSecondary,
  },
})
