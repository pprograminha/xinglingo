import { create } from 'zustand'

interface PronunciationState {
  isOpen: boolean
  openPronunciation: () => void
  closePronunciation: () => void
}

export const usePronunciation = create<PronunciationState>((set) => ({
  isOpen: false,
  openPronunciation: () =>
    set(() => ({
      isOpen: true,
    })),
  closePronunciation: () =>
    set(() => ({
      isOpen: false,
    })),
}))
