import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ShopScreen from '../screens/ShopScreen'
import FortuneScreen from '../screens/FortuneScreen'
import AquariumMapScreen from '../screens/AquariumMapScreen'
import BackroomScreen from '../screens/BackroomScreen'
import PokedexScreen from '../screens/PokedexScreen'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="ショップ" component={ShopScreen} />
      <Tab.Screen name="幸運" component={FortuneScreen} />
      <Tab.Screen name="水族館" component={AquariumMapScreen} />
      <Tab.Screen name="バックヤード" component={BackroomScreen} />
      <Tab.Screen name="図鑑" component={PokedexScreen} />
    </Tab.Navigator>
  )
}