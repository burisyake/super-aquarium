import React from 'react'
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native'
import { useAquariumStore } from '../store/useAquariumStore'
import { Fish } from '../types/fish'
import Header from '../components/Header'

export default function AquariumMapScreen() {
  const aquariums = useAquariumStore((state) => state.aquariums)
  const addFishToAquarium = useAquariumStore((state) => state.addFishToAquarium)

  const handleAddFish = (aquariumId: string) => {
    const newFish: Fish = {
      id: `fish-${Date.now()}`,
      name: '金魚',
      type: 'goldfish',
      level: 1,
    }
    addFishToAquarium(aquariumId, newFish)
  }

    // 水槽を画面中央に寄せるためのオフセット計算
    const screenWidth = Dimensions.get('window').width
    const blockSize = 100
    const mapWidth = 5 * blockSize // グリッド横幅（例: x: 0 ~ 4）
    const offsetX = (screenWidth - mapWidth) / 2

  return (
    <View style={styles.wrapper}>
        <Header />
        <View style={styles.container}>
            {aquariums.map((aq) => {
                const isLarge = aq.id === 'large-1'
                const aquariumStyle = {
                  width: isLarge ? screenWidth - 40 : blockSize,
                  height: isLarge ? blockSize * 2 : blockSize,
                }
                const left = (() => {
                  if (isLarge) return 20
                  if (aq.x === 1 && aq.id !== 'large-1') return 20 // 左列
                  if (aq.x === 3) return screenWidth - blockSize - 20 // 右列
                  return aq.x * blockSize + offsetX
                })()
                return (
                    <View
                        key={aq.id}
                        style={[
                            styles.aquarium,
                            aquariumStyle,
                            {
                                left,
                                top: aq.y * blockSize,
                            },
                        ]}
                    >
                    <Text style={styles.label}>{aq.name}</Text>
                    <Text>🐠: {aq.fishes.length}匹</Text>
                    <Button title="魚を追加" onPress={() => handleAddFish(aq.id)} />
                </View>
            )})}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
    },
  container: {
    flex: 1,
    backgroundColor: '#def',
    padding: 20,
    position: 'relative',
  },
  aquarium: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
