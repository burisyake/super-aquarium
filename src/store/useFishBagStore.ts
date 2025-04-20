import { create } from 'zustand'
import { Fish } from '../types/fish'

type FishBagState = {
  fishes: Fish[]
  addFish: (fish: Fish) => void
  removeFish: (fishId: string) => void
}

export const useFishBagStore = create<FishBagState>((set) => ({
  fishes: [
    { id: 'fish-1', name: '金魚1', type: 'goldfish', level: 1 },
    { id: 'fish-2', name: '金魚2', type: 'goldfish', level: 2 },
  ],
  addFish: (fish) => set((state) => ({ fishes: [...state.fishes, fish] })),
  removeFish: (fishId) =>
    set((state) => ({ fishes: state.fishes.filter((f) => f.id !== fishId) })),
}))
