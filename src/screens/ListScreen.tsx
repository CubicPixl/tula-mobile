
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { fetchArtisans, fetchPlaces, Item } from '../api'

export default function ListScreen(){
  const [items, setItems] = useState<(Item & { kind: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

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
          setError('No fue posible cargar la información. Intenta de nuevo más tarde.')
          setItems([])
        }
      } finally {
        if(isMounted){
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  if(loading){
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={[styles.banner, styles.errorBanner]}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}
      {!error && usedFallback ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Mostrando datos sin conexión. La información puede no estar actualizada.
          </Text>
        </View>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={(it) => `${it.kind}-${it.id}`}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.badge}>{item.kind}</Text>
            </View>
            <Text style={styles.subtitle}>{item.category || item.type}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  card: { padding: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
  title: { fontWeight: '600', fontSize: 16 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#efefef', borderRadius: 999 },
  subtitle: { color: '#666', fontSize: 12, marginTop: 2 },
  desc: { fontSize: 12, marginTop: 4},
  banner: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f3f4f6', borderBottomColor: '#e5e7eb', borderBottomWidth: StyleSheet.hairlineWidth },
  bannerText: { fontSize: 12, color: '#374151', textAlign: 'center' },
  errorBanner: { backgroundColor: '#fee2e2', borderBottomColor: '#fecaca' }
})
