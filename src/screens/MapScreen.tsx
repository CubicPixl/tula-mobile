import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import { MapView, Marker } from 'expo-maps'
import { fetchArtisans, fetchPlaces, Item } from '../api'

export default function MapScreen(){
  const [items, setItems] = useState<(Item & { kind: string })[] | null>(null)

  useEffect(() => {
    Promise.all([fetchArtisans(), fetchPlaces()]).then(([a,p]) => {
      setItems([
        ...a.map(x => ({...x, kind: 'Artesano'})),
        ...p.map(x => ({...x, kind: 'Lugar'}))
      ])
    }).catch(console.error)
  }, [])

  if(!items){
    return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.0617,
          longitude: -99.3389,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {items.map((it) => (
          <Marker
            key={`${it.kind}-${it.id}`}
            coordinate={{ latitude: it.lat, longitude: it.lng }}
            title={it.name}
            description={it.kind}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height }
})

