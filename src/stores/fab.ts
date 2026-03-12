import { create } from 'zustand'

interface FabStore {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useFabStore = create<FabStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}))
