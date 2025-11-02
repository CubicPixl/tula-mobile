
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ListScreen from './src/screens/ListScreen'
import MapScreen from './src/screens/MapScreen'
import { StatusBar } from 'expo-status-bar'

const Tab = createBottomTabNavigator()

export default function App(){
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator>
        <Tab.Screen name="Listado" component={ListScreen} />
        <Tab.Screen name="Mapa" component={MapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
