import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { colors } from '@/theme/colors'

export default function MainLayout() {
  return (
    <NativeTabs
      iconColor={{
        default: colors.neutral400,
        selected: colors.neutral700,
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="map.fill" />
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="community">
        <NativeTabs.Trigger.Icon sf="person.2.fill" />
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="capture">
        <NativeTabs.Trigger.Icon sf="camera.fill" />
        <NativeTabs.Trigger.Label>Capture</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="logbook">
        <NativeTabs.Trigger.Icon sf="book.fill" />
        <NativeTabs.Trigger.Label>Logbook</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
