import { create } from 'zustand'
import { Fish } from '../types/fish'
import { persist, PersistStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Aquarium = {
id: string
  name: string
  x: number // x座標（グリッド用）
  y: number // y座標（グリッド用）
  fishes: Fish[]
}

type AquariumState = {
  aquariums: Aquarium[]
  addAquarium: (aq: Aquarium) => void
  addFishToAquarium: (aquariumId: string, fish: Fish) => void
}

export const useAquariumStore = create<AquariumState>()(
    persist(
        (set, get) => ({
          aquariums: [
            // 上段（U）3つ
            { id: 'u1', name: '上-1', x: 1, y: 0, fishes: [] },
            { id: 'u2', name: '上-2', x: 2, y: 0, fishes: [] },
            { id: 'u3', name: '上-3', x: 3, y: 0, fishes: [] },
    
            // 左列（L）5つ
            { id: 'l1', name: '左-1', x: 1, y: 1, fishes: [] },
            { id: 'l2', name: '左-2', x: 1, y: 2, fishes: [] },
            { id: 'l3', name: '左-3', x: 1, y: 3, fishes: [] },
            { id: 'l4', name: '左-4', x: 1, y: 4, fishes: [] },
            { id: 'l5', name: '左-5', x: 1, y: 5, fishes: [] },
    
            // 右列（R）5つ
            { id: 'r1', name: '右-1', x: 3, y: 1, fishes: [] },
            { id: 'r2', name: '右-2', x: 3, y: 2, fishes: [] },
            { id: 'r3', name: '右-3', x: 3, y: 3, fishes: [] },
            { id: 'r4', name: '右-4', x: 3, y: 4, fishes: [] },
            { id: 'r5', name: '右-5', x: 3, y: 5, fishes: [] },
    
            // 大水槽（中央上）
            { id: 'large-1', name: '大水槽-1', x: 1, y: 0, fishes: [] },
          ],
          addAquarium: (aq) => set((state) => ({
            aquariums: [...state.aquariums, aq],
          })),
          addFishToAquarium: (aquariumId, fish) =>
            set((state) => ({
              aquariums: state.aquariums.map((aq) =>
                aq.id === aquariumId
                  ? { ...aq, fishes: [...aq.fishes, fish] }
                  : aq
              ),
            })),
        }),
        {
          name: 'aquarium-storage',
          storage: {
            getItem: async (name) => {
              const value = await AsyncStorage.getItem(name)
              return value ? JSON.parse(value) : null
            },
            setItem: (name, value) => AsyncStorage.setItem(name, JSON.stringify(value)),
            removeItem: (name) => AsyncStorage.removeItem(name),
          } satisfies PersistStorage<AquariumState>,
        }
    )
)