import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {StorageService} from '../services/StorageService';
import {Outfit} from '../types';

interface OutfitCardProps {
  item: Outfit;
  onPress: () => void;
  onWear: () => void;
  onDelete: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({item, onPress, onWear, onDelete}) => {
  const [thumbnailPath, setThumbnailPath] = useState<string>(item.imagePath);
  
  useEffect(() => {
    StorageService.getThumbnailPath(item.id).then(thumbPath => {
      if (thumbPath) {
        setThumbnailPath(thumbPath);
      }
    });
  }, [item.id]);
  
  return (
    <TouchableOpacity style={styles.outfitCard} onPress={onPress}>
      <Image 
        source={{uri: `file://${thumbnailPath}`}} 
        style={styles.outfitImage}
        resizeMode="cover"
      />
      <Text style={styles.outfitTitle}>{item.title}</Text>
      <Text style={styles.outfitDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.wearCount}>
        Worn {item.wearCount} times
      </Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.wearButton}
          onPress={onWear}
        >
          <Text style={styles.buttonText}>👔 Wear</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outfitCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outfitImage: {
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  wearButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  wearCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  outfitDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default OutfitCard;