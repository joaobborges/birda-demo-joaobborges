import { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'

import { semantic } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { AuthOptionButton } from '@/components/welcome/AuthOptionButton'

interface AuthDrawerProps {
  sheetRef: React.RefObject<BottomSheet | null>
  mode: 'login' | 'signup' | null
  onSelectOption: () => void
  onChange?: (index: number) => void
}

export function AuthDrawer({ sheetRef, mode, onSelectOption, onChange }: AuthDrawerProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, StyleSheet.absoluteFillObject]}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  )

  const title = mode === 'login' ? 'Log in' : 'Create Account'

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      containerStyle={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}
      onChange={onChange}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttons}>
          <AuthOptionButton icon="apple" onPress={onSelectOption} />
          <AuthOptionButton icon="google" onPress={onSelectOption} />
          {mode !== 'login' && (
            <AuthOptionButton
              icon="email"
              onPress={onSelectOption}
              label="Continue with Email"
            />
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 24,
    borderCurve: 'continuous',
  },
  handleIndicator: {
    backgroundColor: '#D9D9D9',
    width: 40,
  },
  content: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['5'],
    paddingBottom: spacing['8'],
  },
  title: {
    ...typography.h3,
    color: semantic.textPrimary,
    marginBottom: spacing['5'],
  },
  buttons: {
    gap: spacing['3'],
  },
})
