import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {Outfit} from '../types';

const OUTFITS_KEY = 'fitcheck_outfits';
const PHOTOS_DIR = `${RNFS.DocumentDirectoryPath}/FitCheckPhotos`;
const THUMBNAILS_DIR = `${RNFS.DocumentDirectoryPath}/FitCheckThumbnails`;

export class StorageService {
  static async initializeStorage() {
    try {
      // Create photos directory if it doesn't exist
      const dirExists = await RNFS.exists(PHOTOS_DIR);
      if (!dirExists) {
        await RNFS.mkdir(PHOTOS_DIR);
      }
      
      // Create thumbnails directory if it doesn't exist
      const thumbDirExists = await RNFS.exists(THUMBNAILS_DIR);
      if (!thumbDirExists) {
        await RNFS.mkdir(THUMBNAILS_DIR);
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  static async saveOutfit(outfit: Outfit): Promise<void> {
    try {
      const existingOutfits = await this.getOutfits();
      const updatedOutfits = [...existingOutfits, outfit];
      await AsyncStorage.setItem(OUTFITS_KEY, JSON.stringify(updatedOutfits));
    } catch (error) {
      console.error('Failed to save outfit:', error);
      throw error;
    }
  }

  static async getOutfits(): Promise<Outfit[]> {
    try {
      const outfitsJson = await AsyncStorage.getItem(OUTFITS_KEY);
      return outfitsJson ? JSON.parse(outfitsJson) : [];
    } catch (error) {
      console.error('Failed to get outfits:', error);
      return [];
    }
  }

  static async deleteOutfit(outfitId: string): Promise<void> {
    try {
      const outfits = await this.getOutfits();
      const outfit = outfits.find(o => o.id === outfitId);
      
      if (outfit) {
        // Delete the image file
        const fileExists = await RNFS.exists(outfit.imagePath);
        if (fileExists) {
          await RNFS.unlink(outfit.imagePath);
        }
        
        // Remove from outfits array
        const updatedOutfits = outfits.filter(o => o.id !== outfitId);
        await AsyncStorage.setItem(OUTFITS_KEY, JSON.stringify(updatedOutfits));
      }
    } catch (error) {
      console.error('Failed to delete outfit:', error);
      throw error;
    }
  }

  static async savePhotoToStorage(sourcePath: string, fileName: string): Promise<string> {
    try {
      await this.initializeStorage();
      const destinationPath = `${PHOTOS_DIR}/${fileName}`;
      await RNFS.copyFile(sourcePath, destinationPath);
      return destinationPath;
    } catch (error) {
      console.error('Failed to save photo:', error);
      throw error;
    }
  }

  static async updateOutfitWearCount(outfitId: string): Promise<void> {
    try {
      const outfits = await this.getOutfits();
      const outfitIndex = outfits.findIndex(o => o.id === outfitId);
      
      if (outfitIndex !== -1) {
        outfits[outfitIndex].wearCount += 1;
        outfits[outfitIndex].lastWorn = new Date().toISOString();
        await AsyncStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
      }
    } catch (error) {
      console.error('Failed to update wear count:', error);
      throw error;
    }
  }

  static async getOutfitsByDateRange(startDate: Date, endDate: Date): Promise<Outfit[]> {
    try {
      const outfits = await this.getOutfits();
      return outfits.filter(outfit => {
        const outfitDate = new Date(outfit.date);
        return outfitDate >= startDate && outfitDate <= endDate;
      });
    } catch (error) {
      console.error('Failed to get outfits by date range:', error);
      return [];
    }
  }

  static async generateThumbnail(imagePath: string, outfitId: string): Promise<string> {
    try {
      await this.initializeStorage();
      const thumbnailPath = `${THUMBNAILS_DIR}/thumb_${outfitId}.jpg`;
      
      // Check if thumbnail already exists
      const thumbExists = await RNFS.exists(thumbnailPath);
      if (thumbExists) {
        return thumbnailPath;
      }
      
      // For now, copy the original image as thumbnail
      // In a real app, you'd use a library like react-native-image-resizer
      await RNFS.copyFile(imagePath, thumbnailPath);
      return thumbnailPath;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return imagePath; // Fallback to original image
    }
  }

  static async getThumbnailPath(outfitId: string): Promise<string | null> {
    try {
      const thumbnailPath = `${THUMBNAILS_DIR}/thumb_${outfitId}.jpg`;
      const exists = await RNFS.exists(thumbnailPath);
      return exists ? thumbnailPath : null;
    } catch (error) {
      console.error('Failed to get thumbnail path:', error);
      return null;
    }
  }
}