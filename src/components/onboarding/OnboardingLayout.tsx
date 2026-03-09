import { type ReactNode } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { semantic } from '@/theme/colors'
import { containers } from '@/theme/components'
import { spacing } from '@/theme/spacing'

interface OnboardingLayoutProps {
  illustration?: ReactNode
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function OnboardingLayout({ illustration, header, children, footer }: OnboardingLayoutProps) {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      {illustration ? (
        <View style={styles.illustrationZone}>
          {illustration}
          {header ? (
            <View style={[styles.headerOverlay, { top: top + spacing['3'] }]}>
              {header}
            </View>
          ) : null}
        </View>
      ) : header ? (
        <View style={{ paddingTop: top + spacing['5'], paddingHorizontal: spacing['6'] }}>
          {header}
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {footer ? (
        <View style={[styles.footer, { paddingBottom: bottom + containers.fixedBottomCTA.paddingBottom }]}>
          {footer}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  illustrationZone: {
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['6'],
  },
  footer: {
    paddingHorizontal: containers.fixedBottomCTA.paddingHorizontal,
    gap: containers.fixedBottomCTA.gap,
  },
})
