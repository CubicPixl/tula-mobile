
import axios from 'axios'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const extra = (Constants?.expoConfig?.extra || {}) as any
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000'
const API_URL = extra.apiUrl || DEFAULT_API_URL

export type Item = {
  id: number
  name: string
  description?: string
  category?: string
  type?: string
  lat: number
  lng: number
  photo_url?: string
}

const FALLBACK_ARTISANS: Item[] = [
  {
    id: 1,
    name: 'Colectivo Textil Xochitla',
    description: 'Taller familiar dedicado al bordado tradicional otomí.',
    category: 'Textiles',
    lat: 20.0696,
    lng: -99.3367,
    photo_url: undefined,
  },
  {
    id: 2,
    name: 'Alfarería Rivera',
    description: 'Piezas de barro bruñido hechas a mano por artesanos locales.',
    category: 'Cerámica',
    lat: 20.0542,
    lng: -99.341,
    photo_url: undefined,
  },
]

const FALLBACK_PLACES: Item[] = [
  {
    id: 1,
    name: 'Mercado de Artesanías',
    description: 'Espacio comunitario donde podrás encontrar artesanías locales.',
    type: 'Mercado',
    lat: 20.0623,
    lng: -99.3351,
    photo_url: undefined,
  },
  {
    id: 2,
    name: 'Museo del Maguey',
    description: 'Centro cultural dedicado a la historia del maguey y el pulque.',
    type: 'Museo',
    lat: 20.0579,
    lng: -99.3458,
    photo_url: undefined,
  },
]

type FetchResult<T> = {
  data: T
  isFallback: boolean
}

async function withFallback<T>(request: () => Promise<T>, fallback: T): Promise<FetchResult<T>> {
  try {
    const data = await request()
    return { data, isFallback: false }
  } catch (error) {
    console.warn('[api] Falling back to bundled data due to request failure.', error)
    return { data: fallback, isFallback: true }
  }
}

export type ItemsFetchResult = FetchResult<Item[]>

export async function fetchArtisans(): Promise<ItemsFetchResult>{
  return withFallback(async () => {
    const { data } = await axios.get(`${API_URL}/artisans`)
    if(!Array.isArray(data)){
      throw new Error('Invalid artisans response payload')
    }
    return data
  }, FALLBACK_ARTISANS)
}

export async function fetchPlaces(): Promise<ItemsFetchResult>{
  return withFallback(async () => {
    const { data } = await axios.get(`${API_URL}/places`)
    if(!Array.isArray(data)){
      throw new Error('Invalid places response payload')
    }
    return data
  }, FALLBACK_PLACES)
}
