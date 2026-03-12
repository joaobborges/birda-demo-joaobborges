import { Redirect } from 'expo-router'
import { useOnboardingStore } from '@/stores/onboarding'

export default function Index() {
  const { completed } = useOnboardingStore()

  if (completed) {
    return <Redirect href="/(main)" />
  }

  return <Redirect href="/(onboarding)/welcome" />
}
