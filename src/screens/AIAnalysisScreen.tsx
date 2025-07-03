import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {AIService} from '../services/AIService';
import {WeatherService} from '../services/WeatherService';
import {Outfit} from '../types';

interface AIAnalysisScreenProps {
  route: {
    params: {
      outfit: Outfit;
    };
  };
  navigation: any;
}

const AIAnalysisScreen = ({route, navigation}: AIAnalysisScreenProps) => {
  const [outfit] = useState<Outfit>(route.params.outfit);
  const [weatherSuggestions, setWeatherSuggestions] = useState<any[]>([]);
  const [comfortLevel, setComfortLevel] = useState<any>(null);

  useEffect(() => {
    loadWeatherAnalysis();
  }, []);

  const loadWeatherAnalysis = async () => {
    if (outfit.weatherData) {
      const weather = {
        temperature: outfit.weatherData.temperature,
        condition: outfit.weatherData.condition,
        humidity: 50, // Default values for mock
        windSpeed: 8,
        description: outfit.weatherData.condition,
        icon: WeatherService.getWeatherEmoji(outfit.weatherData.condition),
        location: outfit.weatherData.location,
      };

      const suggestions = WeatherService.getOutfitSuggestions(weather);
      const comfort = WeatherService.getComfortLevel(weather, outfit.tags);
      
      setWeatherSuggestions(suggestions);
      setComfortLevel(comfort);
    }
  };

  const reanalyzeOutfit = async () => {
    try {
      Alert.alert(
        'Re-analyze Outfit',
        'This will run AI analysis again on your outfit. Continue?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Analyze',
            onPress: async () => {
              // In a real app, this would re-run the AI analysis
              Alert.alert('Analysis Complete', 'Your outfit has been re-analyzed!');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to re-analyze outfit');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#34C759';
    if (confidence >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const getComfortColor = (level: string) => {
    switch (level) {
      case 'excellent': return '#34C759';
      case 'good': return '#30D158';
      case 'fair': return '#FF9500';
      case 'poor': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Analysis</Text>
        <TouchableOpacity style={styles.reanalyzeButton} onPress={reanalyzeOutfit}>
          <Text style={styles.reanalyzeText}>Re-analyze</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{uri: `file://${outfit.imagePath}`}}
        style={styles.outfitImage}
        resizeMode="cover"
      />

      {/* AI Confidence Score */}
      {outfit.aiAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Confidence</Text>
          <View style={styles.confidenceContainer}>
            <View
              style={[
                styles.confidenceBar,
                {backgroundColor: getConfidenceColor(outfit.aiAnalysis.confidence)},
              ]}>
              <Text style={styles.confidenceText}>
                {outfit.aiAnalysis.confidence}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Detected Clothing Items */}
      {outfit.aiAnalysis?.clothingItems && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Items</Text>
          {outfit.aiAnalysis.clothingItems.map((item, index) => (
            <View key={index} style={styles.clothingItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemDetails}>
                  {item.color} • {Math.round(item.confidence * 100)}% confidence
                </Text>
                {item.style && (
                  <Text style={styles.itemStyle}>{item.style}</Text>
                )}
              </View>
              <View
                style={[
                  styles.confidenceDot,
                  {backgroundColor: getConfidenceColor(item.confidence * 100)},
                ]}
              />
            </View>
          ))}
        </View>
      )}

      {/* Style Analysis */}
      {outfit.aiAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Style Analysis</Text>
          <View style={styles.styleGrid}>
            {outfit.aiAnalysis.occasion && (
              <View style={styles.styleTag}>
                <Text style={styles.styleTagText}>
                  📅 {outfit.aiAnalysis.occasion}
                </Text>
              </View>
            )}
            {outfit.aiAnalysis.style && (
              <View style={styles.styleTag}>
                <Text style={styles.styleTagText}>
                  ✨ {outfit.aiAnalysis.style}
                </Text>
              </View>
            )}
            <View style={styles.styleTag}>
              <Text style={styles.styleTagText}>
                🎨 {AIService.getOutfitComplexity(outfit.aiAnalysis)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Color Palette */}
      {outfit.aiAnalysis?.dominantColors && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Palette</Text>
          <View style={styles.colorPalette}>
            {outfit.aiAnalysis.dominantColors.map((color, index) => (
              <View key={index} style={styles.colorItem}>
                <View
                  style={[
                    styles.colorSwatch,
                    {backgroundColor: color === 'mixed' ? '#ccc' : color},
                  ]}
                />
                <Text style={styles.colorName}>{color}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Weather Comfort */}
      {comfortLevel && outfit.weatherData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Comfort</Text>
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherTemp}>
                {outfit.weatherData.temperature}°F
              </Text>
              <Text style={styles.weatherCondition}>
                {WeatherService.getWeatherEmoji(outfit.weatherData.condition)}{' '}
                {outfit.weatherData.condition}
              </Text>
            </View>
            <View style={styles.comfortLevel}>
              <View
                style={[
                  styles.comfortBar,
                  {backgroundColor: getComfortColor(comfortLevel.level)},
                ]}>
                <Text style={styles.comfortText}>
                  {comfortLevel.level.toUpperCase()} ({comfortLevel.score}/100)
                </Text>
              </View>
              <Text style={styles.comfortFeedback}>{comfortLevel.feedback}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Weather Suggestions */}
      {weatherSuggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Suggestions</Text>
          {weatherSuggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestion}>
              <Text style={styles.suggestionType}>
                {suggestion.type === 'add' ? '➕' : suggestion.type === 'remove' ? '➖' : '🔄'}
              </Text>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionItem}>{suggestion.item}</Text>
                <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
              </View>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor:
                      suggestion.priority === 'high'
                        ? '#FF3B30'
                        : suggestion.priority === 'medium'
                        ? '#FF9500'
                        : '#8E8E93',
                  },
                ]}>
                <Text style={styles.priorityText}>{suggestion.priority}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto-Generated Tags</Text>
        <View style={styles.tagsContainer}>
          {outfit.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
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
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reanalyzeButton: {
    padding: 8,
  },
  reanalyzeText: {
    fontSize: 14,
    color: '#007AFF',
  },
  outfitImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  confidenceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clothingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  confidenceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  styleTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  styleTagText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 15,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorName: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  weatherCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
  },
  comfortLevel: {
    alignItems: 'center',
  },
  comfortBar: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  comfortText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  comfortFeedback: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionType: {
    fontSize: 20,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  suggestionReason: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tagsContainer: {
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
});

export default AIAnalysisScreen;