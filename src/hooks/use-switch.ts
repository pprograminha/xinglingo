import { create } from 'zustand'

interface SwitchState {
  mode: 'pronunciation' | 'chat'
  toggle: (modes: [SwitchState['mode'], SwitchState['mode']]) => void
}

export const useSwitch = create<SwitchState>((set) => ({
  mode: 'chat',
  toggle: ([m1, m2]: [SwitchState['mode'], SwitchState['mode']]) =>
    set((state) => ({
      mode: state.mode === m1 ? m2 : m1,
    })),
}))
