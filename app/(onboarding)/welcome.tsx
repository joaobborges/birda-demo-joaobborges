import { useRef, useState, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
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
const MOSAIC_HEIGHT_RATIO = 0.45
const MOSAIC_FADE_HEIGHT_RATIO = 0.3
const MOSAIC_HEIGHT = screenHeight * MOSAIC_HEIGHT_RATIO
const MOSAIC_FADE_HEIGHT = MOSAIC_HEIGHT * MOSAIC_FADE_HEIGHT_RATIO

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const termsAccepted = useOnboardingStore((s) => s.termsAccepted)
  const setTermsAccepted = useOnboardingStore((s) => s.setTermsAccepted)

  const [drawerMode, setDrawerMode] = useState<'login' | 'signup' | null>(null)
  const sheetRef = useRef<BottomSheet>(null)
  const shouldNavigate = useRef(false)
  const [backdropVisible, setBackdropVisible] = useState(false)

  const handleCreateAccount = () => {
    if (!termsAccepted) return
    setDrawerMode('signup')
    setBackdropVisible(true)
    sheetRef.current?.expand()
  }

  const handleLogin = () => {
    if (!termsAccepted) return
    setDrawerMode('login')
    setBackdropVisible(true)
    sheetRef.current?.expand()
  }

  const handleSelectOption = useCallback(() => {
    shouldNavigate.current = true
    sheetRef.current?.close()
  }, [])

  const handleSheetAnimate = useCallback(
    (_from: number, to: number) => {
      if (to === -1) {
        setBackdropVisible(false)
      }
    },
    []
  )

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        setBackdropVisible(false)
        setDrawerMode(null)
        if (shouldNavigate.current) {
          shouldNavigate.current = false
          router.push('/(onboarding)/ai-bird-id')
        }
      }
    },
    [router]
  )

  return (
    <View style={styles.root}>
      <View style={styles.mosaicContainer}>
        <BirdMosaic height={MOSAIC_HEIGHT} />
        <View
          pointerEvents="none"
          style={[styles.mosaicFadeOverlay, { height: MOSAIC_FADE_HEIGHT }]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', '#FFFFFF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.mosaicFade}
          />
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.heading}>Welcome to Birda</Text>
        <Text style={styles.description}>
          Discover, identify, and log birds around you
        </Text>
      </View>

      <View style={[styles.bottomSection, { bottom: insets.bottom > 0 ? insets.bottom : spacing['4'] }]}>
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
      </View>

      {backdropVisible && (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setBackdropVisible(false)
            sheetRef.current?.close()
          }}
        />
      )}

      <AuthDrawer
        sheetRef={sheetRef}
        mode={drawerMode}
        onSelectOption={handleSelectOption}
        onChange={handleSheetChange}
        onAnimate={handleSheetAnimate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  mosaicContainer: {
    position: 'relative',
    height: MOSAIC_HEIGHT,
  },
  mosaicFadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  mosaicFade: {
    flex: 1,
  },
  textSection: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['6'],
    alignItems: 'center',
  },
  heading: {
    ...typography.h2,
    color: semantic.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: semantic.textSecondary,
    marginTop: spacing['2'],
    textAlign: 'center',
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing['4'],
  },
  buttons: {
    gap: spacing['1'],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
})
