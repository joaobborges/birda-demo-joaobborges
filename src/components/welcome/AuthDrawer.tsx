import { StyleSheet, Text, View } from 'react-native'
import BottomSheet, {
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { SharedValue } from 'react-native-reanimated'

import { semantic } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { AuthOptionButton } from '@/components/welcome/AuthOptionButton'

interface AuthDrawerProps {
  sheetRef: React.RefObject<BottomSheet | null>
  animatedIndex: SharedValue<number>
  mode: 'login' | 'signup' | null
  onSelectOption: () => void
  onChange?: (index: number) => void
}

export function AuthDrawer({ sheetRef, animatedIndex, mode, onSelectOption, onChange }: AuthDrawerProps) {
  const title = mode === 'login' ? 'Log in' : 'Create Account'

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      containerStyle={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}
      animatedIndex={animatedIndex}
      onChange={onChange}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttons}>
          <AuthOptionButton icon="apple" onPress={onSelectOption} />
          <AuthOptionButton icon="google" onPress={onSelectOption} />
          <AuthOptionButton
            icon="email"
            onPress={onSelectOption}
            label="Continue with Email"
          />
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
