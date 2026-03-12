import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface OnboardingState {
  name: string
  avatar: string
  birdingJourney: 'new' | 'garden' | 'intermediate' | 'expert' | null
  goals: string[]
  termsAccepted: boolean
  completed: boolean
  setName: (name: string) => void
  setAvatar: (avatar: string) => void
  setBirdingJourney: (journey: OnboardingState['birdingJourney']) => void
  setGoals: (goals: string[]) => void
  setTermsAccepted: (accepted: boolean) => void
  completeOnboarding: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      name: '',
      avatar: 'avatar-1',
      birdingJourney: null,
      goals: [],
      termsAccepted: false,
      completed: false,
      setName: (name) => set({ name }),
      setAvatar: (avatar) => set({ avatar }),
      setBirdingJourney: (birdingJourney) => set({ birdingJourney }),
      setGoals: (goals) => set({ goals }),
      setTermsAccepted: (termsAccepted) => set({ termsAccepted }),
      completeOnboarding: () => set({ completed: true }),
      reset: () =>
        set({
          name: '',
          avatar: 'avatar-1',
          birdingJourney: null,
          goals: [],
          termsAccepted: false,
          completed: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
