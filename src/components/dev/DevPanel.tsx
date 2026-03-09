import { useState } from 'react'
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useOnboardingStore } from '@/stores/onboarding'
import { semantic } from '@/theme/colors'

export default function DevPanel() {
  const [visible, setVisible] = useState(false)
  const { replace } = useRouter()

  const actions = [
    {
      label: 'Trigger Nature Day Paywall',
      onPress: () => {
        setVisible(false)
        replace({ pathname: '/(onboarding)/paywall', params: { variant: 'nature-day' } })
      },
    },
    {
      label: 'Reset Onboarding',
      onPress: () => {
        useOnboardingStore.getState().reset()
        setVisible(false)
        replace('/(onboarding)/welcome')
      },
    },
    {
      label: 'Go to Map',
      onPress: () => {
        setVisible(false)
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
    <>
      <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>🛠</Text>
      </Pressable>

      <Modal
        visible={visible}
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Dev Panel</Text>
            <Pressable onPress={() => setVisible(false)}>
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
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  triggerText: {
    fontSize: 20,
  },
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
