import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useAquariumStore } from '../store/useAquariumStore'
import { useFishBagStore } from '../store/useFishBagStore'
import { Fish } from '../types/fish'
import Header from '../components/Header'
import IkesuModal from '../components/IkesuModal'
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'

export default function AquariumMapScreen() {
  const aquariums = useAquariumStore((state) => state.aquariums);
  const addFishToAquarium = useAquariumStore((state) => state.addFishToAquarium);
  const removeFishFromBag = useFishBagStore((state) => state.removeFish);
  const [showModal, setShowModal] = useState(false);
  const [draggingFish, setDraggingFish] = useState<Fish | null>(null)
  const aquariumRefs = useRef<Record<string, View | null>>({})
  const aquariumLayouts = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({})

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const screenWidth = Dimensions.get('window').width
  const blockSize = 100
  const offsetX = (screenWidth - (5 * blockSize)) / 2

  useEffect(() => {
    Object.entries(aquariumRefs.current).forEach(([id, view]) => {
      if (view) {
        view.measureInWindow((x, y, width, height) => {
          aquariumLayouts.current[id] = { x, y, width, height }
        })
      }
    })
  }, [aquariums])

  const onDrop = (x: number, y: number) => {
    const matched = Object.entries(aquariumLayouts.current).find(
      ([_, layout]) =>
        x >= layout.x && x <= layout.x + layout.width &&
        y >= layout.y && y <= layout.y + layout.height
    )
    if (matched && draggingFish) {
      const [aquariumId] = matched
      addFishToAquarium(aquariumId, draggingFish)
      removeFishFromBag(draggingFish.id)
    }
    setDraggingFish(null)
    translateX.value = withSpring(0)
    translateY.value = withSpring(0)
  }

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
      runOnJS(onDrop)(event.absoluteX, event.absoluteY)
    }
  })

  const screenHeight = Dimensions.get('window').height
  const handleStartDraggingFish = (fish: Fish, x: number, y: number) => {
    // ドラッグ表示の初期位置を画面左下あたりに設定（適宜調整可能）
    translateX.value = withSpring(x-50)
    translateY.value = withSpring(y-50)
    setDraggingFish(fish)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    position: 'absolute',
    zIndex: 100,
  }))

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <Header />
      <View style={styles.container}>
        {aquariums.map((aq) => {
          const isLarge = aq.id === 'large-1'
          const aquariumStyle = {
            width: isLarge ? screenWidth - 40 : blockSize,
            height: isLarge ? blockSize * 2 : blockSize,
          }
          const left = isLarge ? 20 
            : aq.x === 1 ? 20 // 左列固定
            : aq.x === 3 ? screenWidth - blockSize - 20 // 右列固定
            : aq.x * blockSize + offsetX

          return (
            <View
              key={aq.id}
              ref={(ref) => (aquariumRefs.current[aq.id] = ref)}
              style={[styles.aquarium, aquariumStyle, { left, top: aq.y * blockSize }]}
            >
              <Text style={styles.label}>{aq.name}</Text>
              {aq.fishes.map((fish) => (
                <Text key={fish.id}>🐠 {fish.name}</Text>
              ))}
            </View>
          )
        })}

        {draggingFish && (
          <PanGestureHandler onGestureEvent={panGesture}>
            <Animated.View style={[styles.draggingFish, animatedStyle]}>
              <Text>🐟 {draggingFish.name}</Text>
            </Animated.View>
          </PanGestureHandler>
        )}

        <View style={styles.ikesuButtonContainer}>
          <TouchableOpacity onPress={() => setShowModal(true)} style={styles.ikesuButton}>
            <Text style={{ color: '#fff' }}>いけす</Text>
          </TouchableOpacity>
        </View>

        <IkesuModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSelectFish={(fish, x, y) => handleStartDraggingFish(fish, x, y)}
        />
      </View>
    </GestureHandlerRootView>
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
  ikesuButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    zIndex: 10,
  },
  ikesuButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  draggingFish: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
})
