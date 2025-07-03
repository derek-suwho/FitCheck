import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {StorageService} from '../services/StorageService';
import {Outfit} from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWearCountText = (count: number) => {
    if (count === 0) return 'Never worn';
    if (count === 1) return 'Worn once';
    return `Worn ${count} times`;
  };
  
  return (
    <TouchableOpacity 
      style={styles.outfitCard} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{uri: `file://${thumbnailPath}`}} 
          style={styles.outfitImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <View style={styles.wearCountBadge}>
            <Text style={styles.wearCountText}>{item.wearCount}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.outfitTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.outfitDate}>
          {formatDate(item.date)}
        </Text>
        <Text style={styles.wearCountDescription}>
          {getWearCountText(item.wearCount)}
        </Text>
        
        {/* AI Analysis Tags */}
        {item.aiAnalysis?.clothingItems && item.aiAnalysis.clothingItems.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.aiAnalysis.clothingItems.slice(0, 2).map((clothing, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{clothing.type}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={styles.wearButton}
          onPress={onWear}
          activeOpacity={0.8}
        >
          <Text style={styles.wearButtonText}>👔</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outfitCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.sm,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: {
    position: 'relative',
  },
  outfitImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  wearCountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.glass,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  wearCountText: {
    ...Typography.styles.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  cardContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  outfitTitle: {
    ...Typography.styles.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  outfitDate: {
    ...Typography.styles.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  wearCountDescription: {
    ...Typography.styles.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    ...Typography.styles.caption,
    color: Colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  wearButton: {
    backgroundColor: Colors.success,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  wearButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default OutfitCard;