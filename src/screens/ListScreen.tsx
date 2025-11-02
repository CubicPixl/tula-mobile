
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { fetchArtisans, fetchPlaces, Item } from '../api'

export default function ListScreen(){
  const [items, setItems] = useState<(Item & { kind: string })[]>([])

  useEffect(() => {
    Promise.all([fetchArtisans(), fetchPlaces()]).then(([a,p]) => {
      setItems([
        ...a.map(x => ({...x, kind: 'Artesano'})),
        ...p.map(x => ({...x, kind: 'Lugar'}))
      ])
    }).catch(console.error)
  }, [])

  return (
    <View style={styles.container}>
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
  card: { padding: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
  title: { fontWeight: '600', fontSize: 16 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#efefef', borderRadius: 999 },
  subtitle: { color: '#666', fontSize: 12, marginTop: 2 },
  desc: { fontSize: 12, marginTop: 4}
})
