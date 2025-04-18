import { create } from 'zustand'
import { Fish } from '../types/fish'

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

export const useAquariumStore = create<AquariumState>((set) => ({
    aquariums: [
    // 🐋 大水槽-1（x: 1, y: 0）を起点に 3x2 サイズで描画
    {
      id: 'large-1',
      name: '大水槽-1',
      x: 1,
      y: 0,
      fishes: [],
    },

    // 左列（大水槽と重複しないもの）
    { id: 'l2', name: '左-2', x: 1, y: 2, fishes: [] },
    { id: 'l3', name: '左-3', x: 1, y: 3, fishes: [] },
    { id: 'l4', name: '左-4', x: 1, y: 4, fishes: [] },
    { id: 'l5', name: '左-5', x: 1, y: 5, fishes: [] },

    // 右列（大水槽と重複しないもの）
    { id: 'r2', name: '右-2', x: 3, y: 2, fishes: [] },
    { id: 'r3', name: '右-3', x: 3, y: 3, fishes: [] },
    { id: 'r4', name: '右-4', x: 3, y: 4, fishes: [] },
    { id: 'r5', name: '右-5', x: 3, y: 5, fishes: [] },
  ],
  addAquarium: (aq) =>
    set((state) => ({
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
}))
