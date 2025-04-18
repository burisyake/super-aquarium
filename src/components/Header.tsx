import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useCoinStore } from '../store/useCoinStore'
import { useVisitorStore } from '../store/useVisitorStore'

export default function Header() {
  const coins = useCoinStore((state) => state.coins)
  const visitors = useVisitorStore((state) => state.visitorCount)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🪙 {coins} Coins</Text>
      <Text style={styles.text}>👥 {visitors} Guests</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: '#ffffffdd',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
