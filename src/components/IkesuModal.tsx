import React, { useRef } from 'react'
import { Text, Modal, StyleSheet, View, TouchableOpacity } from 'react-native'
import { useFishBagStore } from '../store/useFishBagStore'
import { Fish } from '../types/fish'

export default function IkesuModal({ visible, onClose, onSelectFish }: {
  visible: boolean
  onClose: () => void
  onSelectFish: (fish: Fish, touchX: number, touchY: number) => void
}) {
  const fishes = useFishBagStore((state) => state.fishes)
  const touchPosition = useRef<{ x: number, y: number } | null>(null)

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.title}>いけす</Text>
        {fishes.map((fish) => (
          <TouchableOpacity
            key={fish.id}
            style={styles.fishBox}
            onPressIn={(e) => {
                const { pageX, pageY } = e.nativeEvent
                touchPosition.current = { x: pageX, y: pageY }
            }}
            onLongPress={() => {
                const pos = touchPosition.current
                if (pos) {
                    onSelectFish(fish, pos.x, pos.y)
                    onClose()
                }
            }}
          >
            <Text>{fish.name}（Lv.{fish.level}）</Text>
          </TouchableOpacity>
        ))}
        <Text onPress={onClose} style={styles.closeText}>閉じる</Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: '#ffffffee',
      paddingTop: 100,
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    fishBox: {
      backgroundColor: '#e6f0ff',
      padding: 15,
      marginVertical: 5,
      borderRadius: 8,
    },
    closeText: {
      textAlign: 'center',
      marginTop: 30,
      color: '#007AFF',
      fontSize: 18,
    },
})
