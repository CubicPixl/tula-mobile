
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

export async function fetchArtisans(): Promise<Item[]>{
  const { data } = await axios.get(`${API_URL}/artisans`)
  return data
}

export async function fetchPlaces(): Promise<Item[]>{
  const { data } = await axios.get(`${API_URL}/places`)
  return data
}
