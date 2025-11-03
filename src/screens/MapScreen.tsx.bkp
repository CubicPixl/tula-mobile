import { ComponentType, useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions, Text } from 'react-native'
import { fetchArtisans, fetchPlaces, Item } from '../api'

type MapImplementation = {
  MapView: ComponentType<any>
  Marker: ComponentType<any>
  source: 'expo-maps' | 'react-native-maps'
}

type MapsModule = {
  MapView?: ComponentType<any>
  Marker?: ComponentType<any>
  default?: {
    MapView?: ComponentType<any>
    Marker?: ComponentType<any>
  }
  GoogleMaps?: {
    View?: ComponentType<any>
    Marker?: ComponentType<any>
  }
  AppleMaps?: {
    View?: ComponentType<any>
    Marker?: ComponentType<any>
  }
}

type RNMapsModule = {
  default?: ComponentType<any>
  MapView?: ComponentType<any>
  Marker?: ComponentType<any>
}

let cachedImplementation: MapImplementation | null = null
let loadingImplementation: Promise<MapImplementation> | null = null

async function loadMapImplementation(): Promise<MapImplementation> {
  if (cachedImplementation) {
    return cachedImplementation
  }

  if (!loadingImplementation) {
    loadingImplementation = (async () => {
      try {
        const mapsModule = (await import('expo-maps')) as MapsModule
        const ExpoMapView =
          mapsModule?.MapView ||
          mapsModule?.default?.MapView ||
          mapsModule?.GoogleMaps?.View ||
          mapsModule?.AppleMaps?.View

        const ExpoMarker =
          mapsModule?.Marker ||
          mapsModule?.default?.Marker ||
          mapsModule?.GoogleMaps?.Marker ||
          mapsModule?.AppleMaps?.Marker

        if (ExpoMapView && ExpoMarker) {
          const MapComponent = ExpoMapView as ComponentType<any> & {
            isAvailableAsync?: () => Promise<boolean>
          }

          if (MapComponent?.isAvailableAsync) {
            const isAvailable = await MapComponent.isAvailableAsync()
            if (!isAvailable) {
              throw new Error('Expo maps native module unavailable')
            }
          }

          cachedImplementation = {
            MapView: ExpoMapView,
            Marker: ExpoMarker,
            source: 'expo-maps',
          }
          return cachedImplementation
        }
      } catch (error) {
        console.warn(
          '[MapScreen] expo-maps module unavailable. Attempting react-native-maps fallback.',
          error
        )
      }

      try {
        const rnMapsModule = (await import('react-native-maps')) as RNMapsModule
        const MapView = (rnMapsModule as any)?.default || (rnMapsModule as any)?.MapView
        const Marker = (rnMapsModule as any)?.Marker

        if (MapView && Marker) {
          cachedImplementation = {
            MapView,
            Marker,
            source: 'react-native-maps',
          }
          return cachedImplementation
        }
      } catch (error) {
        console.warn('[MapScreen] react-native-maps fallback unavailable.', error)
      }

      throw new Error('No map implementation available')
    })().finally(() => {
      loadingImplementation = null
    })
  }

  return loadingImplementation
}

export default function MapScreen(){
  const [mapImplementation, setMapImplementation] = useState<MapImplementation | null>(cachedImplementation)
  const [mapError, setMapError] = useState<string | null>(null)

  const [items, setItems] = useState<(Item & { kind: string })[] | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!mapImplementation) {
      loadMapImplementation()
        .then((implementation) => {
          if (!isMounted) {
            return
          }
          setMapImplementation(implementation)
          setMapError(null)
        })
        .catch((err) => {
          console.error('[MapScreen] Failed to load map implementation.', err)
          if (isMounted) {
            setMapError(
              'No pudimos cargar el módulo de mapas en este dispositivo. Asegúrate de tener una versión actualizada de la app.'
            )
          }
        })
    }

    return () => {
      isMounted = false
    }
  }, [mapImplementation])

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

  if (mapError) {
    return (
      <View style={[styles.container, styles.unavailableContainer]}>
        <Text style={styles.unavailableTitle}>Mapa no disponible</Text>
        <Text style={styles.unavailableSubtitle}>{mapError}</Text>
      </View>
    )
  }

  if (!mapImplementation) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if(error){
    return (
      <View style={[styles.container, styles.unavailableContainer]}>
        <Text style={styles.unavailableTitle}>Mapa no disponible</Text>
        <Text style={styles.unavailableSubtitle}>{error}</Text>
      </View>
    )
  }

  if(!items){
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  const { MapView, Marker, source } = mapImplementation

  return (
    <View style={styles.container}>
      {source === 'react-native-maps' ? (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>
            Mostrando mapa en modo compatible. Para una mejor experiencia instala la versión más reciente de la app.
          </Text>
        </View>
      ) : null}
      {usedFallback ? (
        <View
          style={[
            styles.fallbackBanner,
            source === 'react-native-maps' ? styles.dataFallbackBanner : null,
          ]}
        >
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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  unavailableContainer: { paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  unavailableTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  unavailableSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  fallbackBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(17,24,39,0.85)',
    padding: 12,
    borderRadius: 8,
  },
  dataFallbackBanner: {
    top: 72,
  },
  fallbackText: { color: '#fff', fontSize: 12, textAlign: 'center' }
})

