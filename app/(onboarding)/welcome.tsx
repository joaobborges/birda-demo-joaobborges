import { useRef, useState, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet from '@gorhom/bottom-sheet'
import { BirdMosaic } from '@/components/welcome/BirdMosaic'
import { AuthDrawer } from '@/components/welcome/AuthDrawer'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography, fontWeights } from '@/theme/typography'

const { height: screenHeight } = Dimensions.get('window')
const MOSAIC_HEIGHT = screenHeight * 0.55

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const termsAccepted = useOnboardingStore((s) => s.termsAccepted)
  const setTermsAccepted = useOnboardingStore((s) => s.setTermsAccepted)

  const [drawerMode, setDrawerMode] = useState<'login' | 'signup' | null>(null)
  const sheetRef = useRef<BottomSheet>(null)
  const shouldNavigate = useRef(false)

  const handleCreateAccount = () => {
    if (!termsAccepted) return
    setDrawerMode('signup')
    sheetRef.current?.expand()
  }

  const handleLogin = () => {
    if (!termsAccepted) return
    setDrawerMode('login')
    sheetRef.current?.expand()
  }

  const handleSelectOption = useCallback(() => {
    shouldNavigate.current = true
    sheetRef.current?.close()
  }, [])

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1 && shouldNavigate.current) {
        shouldNavigate.current = false
        router.push('/(onboarding)/ai-bird-id')
      }
    },
    [router]
  )

  return (
    <View style={styles.root}>
      <BirdMosaic height={MOSAIC_HEIGHT} />

      <View style={[styles.contentCard, { paddingBottom: insets.bottom + spacing['4'] }]}>
        <Text style={styles.heading}>Welcome to Birda</Text>
        <Text style={styles.description}>
          Discover, identify, and log birds around you
        </Text>

        <View style={[styles.buttons, { opacity: termsAccepted ? 1 : 0.5 }]}>
          <Button
            title="Create Account"
            onPress={handleCreateAccount}
            disabled={!termsAccepted}
          />
          <Button
            title="Log in"
            variant="ghost"
            onPress={handleLogin}
            disabled={!termsAccepted}
          />
        </View>

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted ? styles.checkboxChecked : styles.checkboxUnchecked,
            ]}
          >
            {termsAccepted ? (
              <Text style={styles.checkmark}>{'✓'}</Text>
            ) : null}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </Pressable>
      </View>

      <AuthDrawer
        sheetRef={sheetRef}
        mode={drawerMode}
        onSelectOption={handleSelectOption}
        onChange={handleSheetChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['5'],
  },
  heading: {
    ...typography.h2,
    color: semantic.textPrimary,
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    marginTop: spacing['2'],
  },
  buttons: {
    marginTop: spacing['5'],
    gap: spacing['1'],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['6'],
    marginBottom: spacing['4'],
    gap: spacing['3'],
  },
  checkbox: {
    width: spacing['5'],
    height: spacing['5'],
    borderRadius: 6,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    borderWidth: 1.5,
    borderColor: semantic.borderDefault,
  },
  checkboxChecked: {
    backgroundColor: semantic.actionPrimary,
  },
  checkmark: {
    color: semantic.textInverse,
    fontFamily: fontWeights.bold,
    fontSize: 12,
  },
  checkboxLabel: {
    ...typography.caption,
    color: semantic.textSecondary,
    flex: 1,
  },
})
