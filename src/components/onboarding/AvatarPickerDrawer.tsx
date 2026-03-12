import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { SharedValue } from 'react-native-reanimated'

import { AVATAR_IMAGES } from '@/data/imageManifest'
import { semantic } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { spacing } from '@/theme/spacing'

const AVATAR_KEYS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4'] as const

interface AvatarPickerDrawerProps {
  sheetRef: React.RefObject<BottomSheet | null>
  animatedIndex: SharedValue<number>
  selectedAvatar: string
  onSelect: (key: string) => void
  onChange?: (index: number) => void
}

export function AvatarPickerDrawer({
  sheetRef,
  animatedIndex,
  selectedAvatar,
  onSelect,
  onChange,
}: AvatarPickerDrawerProps) {
  const { width } = useWindowDimensions()
  // 2 columns with padding and gap accounted for
  const gridPadding = spacing['6'] * 2
  const gap = spacing['5']
  const ringExtra = (3 + 3) * 2 // borderWidth + padding on each side
  const avatarSize = Math.floor((width - gridPadding - gap - ringExtra * 2) / 2)

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
        <Text style={styles.title}>Choose Your Avatar</Text>
        <View style={styles.grid}>
          {AVATAR_KEYS.map((key) => (
            <Pressable key={key} onPress={() => onSelect(key)}>
              <View
                style={[
                  styles.avatarRing,
                  selectedAvatar === key && styles.avatarRingSelected,
                ]}
              >
                <Image
                  source={AVATAR_IMAGES[key]}
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                  }}
                  contentFit="cover"
                />
              </View>
            </Pressable>
          ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing['5'],
  },
  avatarRing: {
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'transparent',
    padding: 3,
  },
  avatarRingSelected: {
    borderColor: semantic.actionPrimary,
  },
})
