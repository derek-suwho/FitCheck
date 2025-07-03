import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {StorageService} from '../services/StorageService';
import {Outfit} from '../types';

const {width: screenWidth} = Dimensions.get('window');

const OutfitDetailScreen = ({
  route,
  navigation,
}: any) => {
  const [outfit, setOutfit] = useState<Outfit>(route.params.outfit);
  const [loading, setLoading] = useState(false);

  const handleWearOutfit = async () => {
    setLoading(true);
    try {
      await StorageService.updateOutfitWearCount(outfit.id);
      const updatedOutfit = {...outfit, wearCount: outfit.wearCount + 1};
      setOutfit(updatedOutfit);
      Alert.alert('Outfit Logged!', `Wear count: ${updatedOutfit.wearCount}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log outfit wear');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutfit = () => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteOutfit(outfit.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete outfit');
            }
          },
        },
      ]
    );
  };

  const getCostPerWear = () => {
    if (!outfit.cost || outfit.wearCount === 0) return null;
    return (outfit.cost / outfit.wearCount).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => navigation.navigate('AIAnalysis', {outfit})}>
            <Text style={styles.aiButtonText}>🤖 AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteOutfit}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{uri: `file://${outfit.imagePath}`}}
        style={styles.outfitImage}
        resizeMode="contain"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{outfit.title}</Text>
        <Text style={styles.date}>
          Taken on {new Date(outfit.date).toLocaleDateString()}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{outfit.wearCount}</Text>
            <Text style={styles.statLabel}>Times Worn</Text>
          </View>
          {outfit.cost && (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${outfit.cost}</Text>
              <Text style={styles.statLabel}>Total Cost</Text>
            </View>
          )}
          {getCostPerWear() && (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${getCostPerWear()}</Text>
              <Text style={styles.statLabel}>Cost per Wear</Text>
            </View>
          )}
        </View>

        {outfit.lastWorn && (
          <Text style={styles.lastWorn}>
            Last worn: {new Date(outfit.lastWorn).toLocaleDateString()}
          </Text>
        )}

        {outfit.tags && outfit.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags:</Text>
            <View style={styles.tagsList}>
              {outfit.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.wearButton, loading && styles.wearButtonDisabled]}
          onPress={handleWearOutfit}
          disabled={loading}>
          <Text style={styles.wearButtonText}>
            {loading ? 'Logging...' : '👔 Wear This Outfit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  aiButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  outfitImage: {
    width: screenWidth,
    height: screenWidth * 1.3,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  lastWorn: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  wearButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  wearButtonDisabled: {
    backgroundColor: '#ccc',
  },
  wearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OutfitDetailScreen;