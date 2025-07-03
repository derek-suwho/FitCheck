import React, {useState, useEffect, useCallback} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import {StorageService} from '../services/StorageService';
import {Outfit} from '../types';
import OutfitCard from '../components/OutfitCard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

const GalleryScreen = ({navigation}: any) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'most_worn'>('all');

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    try {
      const savedOutfits = await StorageService.getOutfits();
      setOutfits(savedOutfits.reverse()); // Show newest first
      setFilteredOutfits(savedOutfits);
    } catch (error) {
      console.error('Failed to load outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOutfits = useCallback(() => {
    let filtered = [...outfits];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(outfit =>
        outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outfit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting filter
    switch (filterBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'most_worn':
        filtered.sort((a, b) => b.wearCount - a.wearCount);
        break;
      default:
        break;
    }

    setFilteredOutfits(filtered);
  }, [outfits, searchQuery, filterBy]);

  useEffect(() => {
    filterOutfits();
  }, [filterOutfits]);

  const handleDeleteOutfit = (outfit: Outfit) => {
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
              await loadOutfits(); // Refresh the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete outfit');
            }
          },
        },
      ]
    );
  };

  const handleWearOutfit = async (outfit: Outfit) => {
    try {
      await StorageService.updateOutfitWearCount(outfit.id);
      await loadOutfits(); // Refresh to show updated wear count
      Alert.alert('Outfit Logged!', `Wear count: ${outfit.wearCount + 1}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log outfit wear');
    }
  };

  const renderOutfitItem = ({item}: {item: Outfit}) => (
    <OutfitCard
      item={item}
      onPress={() => navigation.navigate('OutfitDetail', {outfit: item})}
      onWear={() => handleWearOutfit(item)}
      onDelete={() => handleDeleteOutfit(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Outfits</Text>
        {outfits.length > 0 && (
          <Text style={styles.outfitCount}>{outfits.length} outfit{outfits.length !== 1 ? 's' : ''}</Text>
        )}
      </View>
      
      {outfits.length > 0 && (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search outfits..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {/* Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            <TouchableOpacity
              style={[styles.filterPill, filterBy === 'all' && styles.filterPillActive]}
              onPress={() => setFilterBy('all')}>
              <Text style={[styles.filterText, filterBy === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, filterBy === 'recent' && styles.filterPillActive]}
              onPress={() => setFilterBy('recent')}>
              <Text style={[styles.filterText, filterBy === 'recent' && styles.filterTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, filterBy === 'most_worn' && styles.filterPillActive]}
              onPress={() => setFilterBy('most_worn')}>
              <Text style={[styles.filterText, filterBy === 'most_worn' && styles.filterTextActive]}>
                Most Worn
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
      
      {/* Content */}
      {outfits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyText}>No outfits yet!</Text>
          <Text style={styles.emptySubtext}>
            Take your first outfit photo to start building your collection
          </Text>
          <TouchableOpacity 
            style={styles.emptyActionButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.emptyActionText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      ) : filteredOutfits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No outfits found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filter</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOutfits}
          renderItem={renderOutfitItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
  },
});

export default GalleryScreen;