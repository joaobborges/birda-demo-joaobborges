import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'

const ACHIEVEMENTS = [
  { emoji: '🌅', label: 'Early Bird' },
  { emoji: '🔭', label: 'Sharp Eye' },
  { emoji: '📸', label: 'Photographer' },
  { emoji: '🗺️', label: 'Explorer' },
]

export default function ProfileScreen() {
  const { top } = useSafeAreaInsets()
  const { name, birdingJourney } = useOnboardingStore()

  return (
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=birda' }}
          style={styles.avatar}
          contentFit="cover"
        />
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
          <View key={a.label} style={styles.achievement}>
            <Text style={styles.achievementEmoji}>{a.emoji}</Text>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderCurve: 'continuous',
    backgroundColor: semantic.borderDefault,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
  },
  skillBadge: {
    backgroundColor: semantic.statusSuccessBg,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: semantic.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: semantic.bgPage,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    color: semantic.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: semantic.borderDefault,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.textPrimary,
    marginTop: 28,
    marginBottom: 14,
  },
  achievements: {
    flexDirection: 'row',
    gap: 12,
  },
  achievement: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: semantic.bgPage,
    padding: 16,
    borderRadius: 16,
    borderCurve: 'continuous',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: semantic.textBody,
  },
})
