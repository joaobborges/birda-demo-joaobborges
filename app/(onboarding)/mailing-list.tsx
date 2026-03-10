import { useState } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function MailingListScreen() {
  const { push } = useRouter()
  const [mailingList, setMailingList] = useState(false)

  const handleSave = () => {
    push('/(onboarding)/paywall')
  }

  const handleMaybeLater = () => {
    push('/(onboarding)/paywall')
  }

  return (
    <OnboardingLayout
      footer={
        <>
          <Button title="Save" onPress={handleSave} />
          <Button title="Maybe later" variant="link" onPress={handleMaybeLater} />
        </>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.content}>
        <Text style={styles.heading}>Join our mailing list</Text>
        <Text style={styles.description}>
          Get weekly birding tips, species spotlights, and community highlights
        </Text>
        <View style={styles.imagePlaceholder} />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Subscribe to newsletter</Text>
          <Switch
            value={mailingList}
            onValueChange={setMailingList}
            trackColor={{ false: semantic.borderDefault, true: semantic.actionPrimary }}
            thumbColor={semantic.bgPage}
          />
        </View>
      </Animated.View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing['2'],
    flexShrink: 1,
  },
  heading: {
    ...typography.h3,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: spacing['2'],
  },
  imagePlaceholder: {
    height: 200,
    width: 200,
    backgroundColor: semantic.bgTinted,
    borderRadius: 100,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginVertical: spacing['6'],
    flexShrink: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['4'],
    width: '100%',
  },
  toggleLabel: {
    ...typography.bodySmall,
    color: semantic.textPrimary,
  },
})
