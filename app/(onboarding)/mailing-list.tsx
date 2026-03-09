import { useState } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useOnboardingStore } from '@/stores/onboarding'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { semantic } from '@/theme/colors'

export default function MailingListScreen() {
  const { replace } = useRouter()
  const { completeOnboarding } = useOnboardingStore()
  const [mailingList, setMailingList] = useState(false)

  const handleSave = () => {
    completeOnboarding()
    replace('/(main)')
  }

  const handleMaybeLater = () => {
    completeOnboarding()
    replace('/(main)')
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
    gap: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  imagePlaceholder: {
    height: 200,
    width: 200,
    backgroundColor: semantic.bgTinted,
    borderRadius: 100,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginVertical: 40,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    width: '100%',
  },
  toggleLabel: {
    fontSize: 16,
    color: semantic.textPrimary,
  },
})
