import { create } from 'zustand'

type VisitorState = {
  visitorCount: number
  setVisitorCount: (count: number) => void
}

export const useVisitorStore = create<VisitorState>((set) => ({
  visitorCount: 3, // 仮の人数
  setVisitorCount: (count) => set({ visitorCount: count }),
}))
