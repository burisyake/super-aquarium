import { create } from 'zustand'

type CoinState = {
  coins: number
  setCoinCount: (coins: number) => void
}

export const useCoinStore = create<CoinState>((set) => ({
  coins: 4000, // 仮のコイン数
  setCoinCount: (coins) => set({ coins: coins }),
}))
