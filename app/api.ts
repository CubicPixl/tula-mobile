
import axios from 'axios'
import Constants from 'expo-constants'

const extra = (Constants?.expoConfig?.extra || {}) as any
const API_URL = extra.apiUrl || 'http://localhost:4000'

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
