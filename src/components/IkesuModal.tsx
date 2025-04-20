import React, { RefObject, useState } from 'react'
import { Text, Modal, StyleSheet, Dimensions, View } from 'react-native'
import { GestureHandlerRootView, PanGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring, runOnJS} from 'react-native-reanimated'

import { useFishBagStore } from '../store/useFishBagStore'
import { Fish } from '../types/fish'

const { width, height } = Dimensions.get('window')

type Props = {
  visible: boolean
  onClose: () => void
}

export default function IkesuModal({ visible, onClose, aquariumLayouts, addFishToAquarium,}: Props & {
    aquariumLayouts: RefObject<Record<string, Layout>>
    addFishToAquarium: (aquariumId: string, fish: Fish) => void
  }) {
  const fishes = useFishBagStore((state) => state.fishes)
  const removeFish = useFishBagStore((state) => state.removeFish)
  const [draggingFish, setDraggingFish] = useState<string | null>(null)

  return (
    <Modal visible={visible} transparent animationType="slide">
      <GestureHandlerRootView style={styles.modalContainer}>
        <Text style={styles.title}>いけす</Text>
            {fishes.map((fish) => {
            const translateX = useSharedValue(0)
            const translateY = useSharedValue(0)

            const panGesture = useAnimatedGestureHandler({
                onStart: (_, ctx: any) => {
                ctx.startX = translateX.value
                ctx.startY = translateY.value
                },
                onActive: (event, ctx: any) => {
                translateX.value = ctx.startX + event.translationX
                translateY.value = ctx.startY + event.translationY
                },
                onEnd: (event) => {
                    const { absoluteX, absoluteY } = event
                  
                    // 水槽エリアにヒットするか確認
                    if (!aquariumLayouts.current) return 
                    const matched = Object.entries(aquariumLayouts.current).find(
                      ([_, layout]) =>
                        absoluteX >= layout.x &&
                        absoluteX <= layout.x + layout.width &&
                        absoluteY >= layout.y &&
                        absoluteY <= layout.y + layout.height
                    )
                    if (matched) {
                      const [aquariumId] = matched
                  
                      // ✅ 水槽に追加 & いけすから削除
                      runOnJS(addFishToAquarium)(aquariumId, fish)
                      runOnJS(removeFish)(fish.id)
                    }
                  
                    // 元の位置に戻す
                    translateX.value = withSpring(0)
                    translateY.value = withSpring(0)
                  }
            })

            const animatedStyle = useAnimatedStyle(() => ({
                transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                ],
            }))

            return (
                <View key={fish.id}>
                    <PanGestureHandler onGestureEvent={panGesture}>
                    <Animated.View style={[styles.fishBox, animatedStyle]}>
                        <LongPressGestureHandler
                        onActivated={() => {
                            setDraggingFish(fish.id)
                            onClose() // ← いけす閉じる（次のステップ用）
                        }}
                        minDurationMs={200}
                        >
                        <Animated.View>
                            <Text>{fish.name}（Lv.{fish.level}）</Text>
                        </Animated.View>
                        </LongPressGestureHandler>
                    </Animated.View>
                    </PanGestureHandler>
                </View>
              )
            })}
        <Text onPress={onClose} style={styles.closeText}>閉じる</Text>
      </GestureHandlerRootView>
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
