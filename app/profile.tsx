import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useOnboardingStore } from '@/stores/onboarding'
import { AVATAR_IMAGES } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

const ACHIEVEMENTS = [
  { icon: 'sunny-outline' as const, label: 'Early Bird', bg: semantic.rarityUncommonBg, unlocked: true },
  { icon: 'eye-outline' as const, label: 'Sharp Eye', bg: semantic.rarityCommonBg, unlocked: true },
  { icon: 'camera-outline' as const, label: 'Photographer', bg: semantic.rarityRareBg, unlocked: true },
  { icon: 'compass-outline' as const, label: 'Explorer', bg: semantic.statusSuccessBg, unlocked: true },
  { icon: 'lock-closed-outline' as const, label: 'Night Owl', bg: semantic.bgSurface, unlocked: false },
  { icon: 'lock-closed-outline' as const, label: 'Migration Tracker', bg: semantic.bgSurface, unlocked: false },
  { icon: 'lock-closed-outline' as const, label: 'Rare Finder', bg: semantic.bgSurface, unlocked: false },
]

export default function ProfileScreen() {
  const { name, avatar, birdingJourney } = useOnboardingStore()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={AVATAR_IMAGES[avatar]}
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.name}>{name || 'Birder'}</Text>
        {birdingJourney ? (
          <View style={styles.skillBadge}>
            <Text style={styles.badgeText}>
              {birdingJourney.charAt(0).toUpperCase() + birdingJourney.slice(1)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Birds spotted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Species</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Achievements</Text>
      <View style={styles.achievements}>
        {ACHIEVEMENTS.map((a) => (
          <View key={a.label} style={[styles.achievementRow, !a.unlocked && styles.achievementRowLocked]}>
            <View style={[styles.achievementIcon, { backgroundColor: a.bg }]}>
              <Ionicons name={a.icon} size={24} color={a.unlocked ? semantic.textPrimary : semantic.textMuted} />
            </View>
            <Text style={styles.achievementLabel}>{a.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: spacing['6'],
  },
  header: {
    alignItems: 'center',
    gap: spacing['3'],
    paddingVertical: spacing['6'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderCurve: 'continuous',
    backgroundColor: semantic.actionPrimaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    ...typography.h3,
    color: semantic.textPrimary,
  },
  skillBadge: {
    backgroundColor: semantic.statusSuccessBg,
    paddingHorizontal: 14, // no exact token
    paddingVertical: spacing['1'],
    borderRadius: 12, // no exact token
    borderCurve: 'continuous',
  },
  badgeText: {
    fontFamily: fontWeights.semiBold,
    fontSize: 13, // no exact token
    color: semantic.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: semantic.bgPage,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: spacing['5'],
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing['1'],
  },
  statNumber: {
    ...typography.h3,
    color: semantic.textPrimary,
  },
  statLabel: {
    fontFamily: fontWeights.regular,
    fontSize: 13, // no exact token
    color: semantic.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: semantic.borderDefault,
  },
  sectionTitle: {
    ...typography.navItem,
    color: semantic.textPrimary,
    textTransform: 'none',
    marginTop: 28, // no exact token
    marginBottom: 14, // no exact token
  },
  achievements: {
    gap: spacing['3'],
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: semantic.bgPage,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  achievementRowLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementLabel: {
    fontFamily: fontWeights.semiBold,
    fontSize: 14, // no exact token — slightly larger for row layout
    color: semantic.textBody,
  },
})
