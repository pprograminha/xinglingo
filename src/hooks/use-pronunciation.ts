import { create } from 'zustand'

interface PronunciationState {
  isOpen: boolean
  openPronunciation: () => void
  closePronunciation: () => void
}

export const usePronunciation = create<PronunciationState>((set) => ({
  isOpen: false,
  openPronunciation: () =>
    set((state) => ({
      isOpen: true
    })),
  closePronunciation: () =>
    set((state) => ({
      isOpen: false
    })),
}))
