export interface Outfit {
  id: string;
  title: string;
  imagePath: string;
  date: string;
  tags: string[];
  occasion?: string;
  weather?: string;
  cost?: number;
  wearCount: number;
  lastWorn?: string;
  aiAnalysis?: {
    clothingItems: ClothingItem[];
    dominantColors: string[];
    occasion?: string;
    style?: string;
    confidence: number;
  };
  processedImagePath?: string; // For background-removed version
  weatherData?: {
    temperature: number;
    condition: string;
    location: string;
  };
}

export interface ClothingItem {
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'dress' | 'unknown';
  confidence: number;
  color: string;
  style?: string;
  brand?: string;
}

export interface OutfitItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
  color: string;
  brand?: string;
  cost?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  outfitCount: number;
}