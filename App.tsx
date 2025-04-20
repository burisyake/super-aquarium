import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import TabNavigator from './src/navigation/TabNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
