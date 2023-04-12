import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetflixViewingHistory from '../NetflixViewingHistory';
// replacing w/ a backend solution, util module of node.js not supported in RNative environment

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <NetflixViewingHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});