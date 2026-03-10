import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'

interface DevPanelProps {
  visible: boolean
  onClose: () => void
}

export default function DevPanel({ visible, onClose }: DevPanelProps) {
  const { replace } = useRouter()

  const actions = [
    {
      label: 'Trigger Nature Day Paywall',
      onPress: () => {
        onClose()
        replace({ pathname: '/(onboarding)/paywall', params: { variant: 'nature-day' } })
      },
    },
    {
      label: 'Reset Onboarding',
      onPress: () => {
        useOnboardingStore.getState().reset()
        onClose()
        replace('/(onboarding)/welcome')
      },
    },
    {
      label: 'Go to Map',
      onPress: () => {
        onClose()
        replace('/(main)')
      },
    },
    {
      label: 'Show Zustand State',
      onPress: () => {
        const state = useOnboardingStore.getState()
        alert(JSON.stringify(state, null, 2))
      },
    },
    {
      label: 'Clear AsyncStorage',
      onPress: async () => {
        await AsyncStorage.clear()
        alert('AsyncStorage cleared')
      },
    },
  ]

  return (
    <Modal
      visible={visible}
      presentationStyle="formSheet"
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Dev Panel</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.panelContent}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              style={styles.action}
              onPress={action.onPress}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: semantic.bgPage,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semantic.borderDefault,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semantic.textInput,
  },
  closeButton: {
    fontSize: 17,
    color: semantic.actionPrimary,
    fontWeight: '600',
  },
  panelContent: {
    padding: 20,
  },
  action: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.bgSurface,
  },
  actionText: {
    fontSize: 16,
    color: semantic.textInput,
  },
})
