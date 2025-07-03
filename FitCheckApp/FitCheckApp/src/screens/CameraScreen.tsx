import React, {useState} from 'react';
import {View, StyleSheet, Alert, ActivityIndicator, Text} from 'react-native';
import CameraComponent from '../components/CameraComponent';
import PhotoEditor from '../components/PhotoEditor';
import {StorageService} from '../services/StorageService';
import {AIService} from '../services/AIService';
import {WeatherService} from '../services/WeatherService';
import {Outfit} from '../types';

const CameraScreen = ({navigation}: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [capturedPhotoPath, setCapturedPhotoPath] = useState('');

  const handlePhotoTaken = async (photoPath: string) => {
    // Show photo editor first
    setCapturedPhotoPath(photoPath);
    setShowPhotoEditor(true);
  };

  const handlePhotoEdited = async (editedPhotoPath: string) => {
    try {
      setShowPhotoEditor(false);
      setIsProcessing(true);
      setProcessingStep('Saving photo...');
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `outfit_${timestamp}.jpg`;
      
      // Save photo to app storage
      const savedPath = await StorageService.savePhotoToStorage(editedPhotoPath, fileName);
      
      setProcessingStep('Analyzing clothing...');
      
      // Analyze clothing with AI
      const aiAnalysis = await AIService.analyzeClothing(savedPath);
      const aiTags = AIService.generateTags(aiAnalysis);
      
      setProcessingStep('Getting weather data...');
      
      // Get current weather (mock location for now)
      const weather = await WeatherService.getCurrentWeather(37.7749, -122.4194);
      
      setProcessingStep('Creating outfit...');
      
      // Create outfit object with AI analysis
      const outfit: Outfit = {
        id: `outfit_${timestamp}`,
        title: `Outfit ${new Date().toLocaleDateString()}`,
        imagePath: savedPath,
        date: new Date().toISOString(),
        tags: aiTags,
        wearCount: 0,
        aiAnalysis: {
          clothingItems: aiAnalysis.clothingItems,
          dominantColors: aiAnalysis.dominantColors,
          occasion: aiAnalysis.occasion,
          style: aiAnalysis.style,
          confidence: AIService.getStyleConfidence(aiAnalysis)
        },
        weatherData: {
          temperature: weather.temperature,
          condition: weather.condition,
          location: weather.location
        }
      };
      
      // Save outfit to storage
      await StorageService.saveOutfit(outfit);
      
      setProcessingStep('Generating thumbnail...');
      
      // Generate thumbnail for gallery performance
      await StorageService.generateThumbnail(savedPath, outfit.id);
      
      setIsProcessing(false);
      
      // Show AI analysis results
      const confidence = outfit.aiAnalysis?.confidence || 0;
      const detectedItems = outfit.aiAnalysis?.clothingItems.length || 0;
      
      Alert.alert(
        'Outfit Analyzed! 🎯',
        `Detected ${detectedItems} clothing items with ${confidence}% confidence.\n\nTags: ${aiTags.slice(0, 3).join(', ')}`,
        [
          {
            text: 'Take Another',
            style: 'cancel',
          },
          {
            text: 'View Gallery',
            onPress: () => navigation.navigate('Gallery'),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save outfit:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to save your outfit. Please try again.');
    }
  };

  const handlePhotoEditCancel = () => {
    setShowPhotoEditor(false);
    setCapturedPhotoPath('');
  };

  return (
    <View style={styles.container}>
      <CameraComponent onPhotoTaken={handlePhotoTaken} />
      
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.processingText}>{processingStep}</Text>
            <Text style={styles.processingSubtext}>
              AI is analyzing your outfit...
            </Text>
          </View>
        </View>
      )}
      
      <PhotoEditor
        visible={showPhotoEditor}
        imagePath={capturedPhotoPath}
        onSave={handlePhotoEdited}
        onCancel={handlePhotoEditCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CameraScreen;