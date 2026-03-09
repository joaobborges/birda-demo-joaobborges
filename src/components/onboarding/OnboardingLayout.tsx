import { type ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { semantic } from '@/theme/colors'

interface OnboardingLayoutProps {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function OnboardingLayout({ header, children, footer }: OnboardingLayoutProps) {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
      {header ? header : null}
      <View style={styles.content}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.bgPage,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    gap: 8,
  },
})
