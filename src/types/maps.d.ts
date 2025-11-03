declare module 'expo-maps' {
  import type { ComponentType } from 'react'

  export const MapView: (ComponentType<any> & {
    isAvailableAsync?: () => Promise<boolean>
  }) | undefined
  export const Marker: ComponentType<any> | undefined
  export const GoogleMaps: {
    View?: ComponentType<any>
    Marker?: ComponentType<any>
  }
  export const AppleMaps: {
    View?: ComponentType<any>
    Marker?: ComponentType<any>
  }
  const defaultExport: {
    MapView?: ComponentType<any>
    Marker?: ComponentType<any>
  }
  export default defaultExport
}

declare module 'react-native-maps' {
  import type { ComponentType } from 'react'

  export const MapView: ComponentType<any>
  export const Marker: ComponentType<any>
  const defaultExport: ComponentType<any>
  export default defaultExport
}
