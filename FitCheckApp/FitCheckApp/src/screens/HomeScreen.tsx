import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const HomeScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitCheck</Text>
      <Text style={styles.subtitle}>Your AI Outfit Logger</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>Take Outfit Photo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Gallery')}
      >
        <Text style={styles.buttonText}>View Outfits</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;