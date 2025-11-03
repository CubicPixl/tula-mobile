import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions, Text } from 'react-native'
import { fetchArtisans, fetchPlaces, Item } from '../api'

type MapsModule = typeof import('expo-maps')

let mapsModule: MapsModule | null = null

try {
  mapsModule = require('expo-maps') as MapsModule
} catch (error) {
  console.warn(
    '[MapScreen] expo-maps native module is unavailable. Falling back to placeholder view.',
    error
  )
}

const MapView = mapsModule?.MapView
const Marker = mapsModule?.Marker

export default function MapScreen(){
  if(!MapView || !Marker){
    return (
      <View style={[styles.container, styles.unavailableContainer]}>
        <Text style={styles.unavailableTitle}>Mapa no disponible</Text>
        <Text style={styles.unavailableSubtitle}>
          Para ver el mapa necesitas ejecutar la app con un build que incluya el módulo nativo de mapas.
        </Text>
      </View>
    )
  }

  const [items, setItems] = useState<(Item & { kind: string })[] | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadData(){
      try {
        const [artisans, places] = await Promise.all([fetchArtisans(), fetchPlaces()])
        if(!isMounted){
          return
        }
        setItems([
          ...artisans.data.map(x => ({...x, kind: 'Artesano'})),
          ...places.data.map(x => ({...x, kind: 'Lugar'}))
        ])
        setUsedFallback(artisans.isFallback || places.isFallback)
        setError(null)
      } catch (err) {
        console.error(err)
        if(isMounted){
          setError('No fue posible cargar la información del mapa. Intenta de nuevo más tarde.')
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  if(error){
    return (
      <View style={[styles.container, styles.unavailableContainer]}>
        <Text style={styles.unavailableTitle}>Mapa no disponible</Text>
        <Text style={styles.unavailableSubtitle}>{error}</Text>
      </View>
    )
  }

  if(!items){
    return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><ActivityIndicator /></View>
  }

  return (
    <View style={styles.container}>
      {usedFallback ? (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>
            Mostrando ubicaciones sin conexión. La información puede no estar actualizada.
          </Text>
        </View>
      ) : null}
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
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  unavailableContainer: { paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  unavailableTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  unavailableSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  fallbackBanner: { position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1, backgroundColor: 'rgba(17,24,39,0.85)', padding: 12, borderRadius: 8 },
  fallbackText: { color: '#fff', fontSize: 12, textAlign: 'center' }
})

