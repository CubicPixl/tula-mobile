import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 20.0522, longitude: -99.3419, // Tula de Allende aprox
          latitudeDelta: 0.05, longitudeDelta: 0.05
        }}
      >
        <Marker coordinate={{ latitude: 20.0522, longitude: -99.3419 }} title="Tula de Allende" />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 }});