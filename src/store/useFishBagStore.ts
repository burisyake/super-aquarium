import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fish } from '../types/fish'

type FishBagState = {
  fishes: Fish[]
  addFish: (fish: Fish) => void
  removeFish: (fishId: string) => void
}

export const useFishBagStore = create<FishBagState>()(
    persist(
      (set, get) => ({
        fishes: [],
        addFish: (fish) => set({ fishes: [...get().fishes, fish] }),
        removeFish: (fishId) => set({ fishes: get().fishes.filter(f => f.id !== fishId) }),
      }),
      {
        name: 'fish-bag-storage',
        storage: {
          getItem: async (key) => {
            const value = await AsyncStorage.getItem(key)
            return value ? JSON.parse(value) : null
          },
          setItem: (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
          removeItem: (key) => AsyncStorage.removeItem(key),
        },
      }
    )
  )
