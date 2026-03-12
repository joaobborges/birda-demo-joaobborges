import { useState } from 'react'
import { View, Text, Switch, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/ui/Button'
import { ONBOARDING_IMAGES } from '@/data/imageManifest'
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
      illustration={<Image source={ONBOARDING_IMAGES['mailing-list']} style={styles.illustration} contentFit="cover" />}
      footer={
        <>
          <Button title="Save" onPress={handleSave} />
          <Button title="Maybe later" variant="link" onPress={handleMaybeLater} />
        </>
      }
    >
      <Animated.View entering={FadeIn.delay(100).duration(300)}>
        <Text style={styles.heading}>Join our mailing list</Text>
        <Text style={styles.description}>
          Get weekly birding tips, species spotlights, and community highlights
        </Text>
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

const { height: screenHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  illustration: {
    height: screenHeight * 0.45,
    backgroundColor: semantic.bgTinted,
  },
  heading: {
    ...typography.h2,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginTop: spacing['3'],
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
    color: semantic.textSecondary,
  },
})
