export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
}

export interface OutfitSuggestion {
  type: 'add' | 'remove' | 'replace';
  item: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export class WeatherService {
  private static readonly API_KEY = 'YOUR_WEATHER_API_KEY'; // Replace with actual API key
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  /**
   * Get current weather for user's location
   */
  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Mock weather data for development
      return this.getMockWeatherData();
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      return this.getDefaultWeatherData();
    }
  }

  /**
   * Get weather-based outfit suggestions
   */
  static getOutfitSuggestions(weather: WeatherData): OutfitSuggestion[] {
    const suggestions: OutfitSuggestion[] = [];
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();

    // Temperature-based suggestions
    if (temp < 32) {
      suggestions.push({
        type: 'add',
        item: 'Heavy winter coat',
        reason: 'Freezing temperature',
        priority: 'high'
      });
      suggestions.push({
        type: 'add',
        item: 'Warm layers',
        reason: 'Very cold weather',
        priority: 'high'
      });
    } else if (temp < 50) {
      suggestions.push({
        type: 'add',
        item: 'Light jacket or sweater',
        reason: 'Cool temperature',
        priority: 'medium'
      });
    } else if (temp > 80) {
      suggestions.push({
        type: 'remove',
        item: 'Heavy layers',
        reason: 'Hot weather',
        priority: 'medium'
      });
      suggestions.push({
        type: 'add',
        item: 'Light, breathable fabrics',
        reason: 'High temperature',
        priority: 'medium'
      });
    }

    // Condition-based suggestions
    if (condition.includes('rain')) {
      suggestions.push({
        type: 'add',
        item: 'Waterproof jacket',
        reason: 'Rain expected',
        priority: 'high'
      });
      suggestions.push({
        type: 'add',
        item: 'Waterproof shoes',
        reason: 'Wet conditions',
        priority: 'medium'
      });
    }

    if (condition.includes('snow')) {
      suggestions.push({
        type: 'add',
        item: 'Winter boots',
        reason: 'Snow on ground',
        priority: 'high'
      });
      suggestions.push({
        type: 'add',
        item: 'Warm accessories (hat, gloves)',
        reason: 'Snowy conditions',
        priority: 'medium'
      });
    }

    if (condition.includes('wind') && weather.windSpeed > 15) {
      suggestions.push({
        type: 'add',
        item: 'Windbreaker',
        reason: 'Windy conditions',
        priority: 'medium'
      });
    }

    if (weather.humidity > 70 && temp > 70) {
      suggestions.push({
        type: 'add',
        item: 'Moisture-wicking fabrics',
        reason: 'High humidity',
        priority: 'low'
      });
    }

    return suggestions;
  }

  /**
   * Get comfort level for current outfit given weather
   */
  static getComfortLevel(weather: WeatherData, outfitTags: string[]): {
    level: 'poor' | 'fair' | 'good' | 'excellent';
    score: number;
    feedback: string;
  } {
    let score = 50; // Base score
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();

    // Check for weather-appropriate items
    const hasJacket = outfitTags.some(tag => 
      ['jacket', 'coat', 'outerwear', 'sweater'].includes(tag.toLowerCase())
    );
    const hasLightClothing = outfitTags.some(tag =>
      ['t-shirt', 'tank top', 'shorts', 'dress'].includes(tag.toLowerCase())
    );
    const hasWaterproof = outfitTags.some(tag =>
      ['waterproof', 'rain', 'umbrella'].includes(tag.toLowerCase())
    );

    // Temperature appropriateness
    if (temp < 50 && hasJacket) score += 20;
    if (temp < 50 && !hasJacket) score -= 30;
    if (temp > 75 && hasLightClothing) score += 15;
    if (temp > 75 && hasJacket) score -= 20;

    // Weather condition appropriateness
    if (condition.includes('rain') && hasWaterproof) score += 25;
    if (condition.includes('rain') && !hasWaterproof) score -= 25;

    // Determine level and feedback
    let level: 'poor' | 'fair' | 'good' | 'excellent';
    let feedback: string;

    if (score >= 80) {
      level = 'excellent';
      feedback = 'Perfect outfit for the weather!';
    } else if (score >= 65) {
      level = 'good';
      feedback = 'Great choice for the conditions';
    } else if (score >= 45) {
      level = 'fair';
      feedback = 'Decent outfit, might need minor adjustments';
    } else {
      level = 'poor';
      feedback = 'Consider changing outfit for better comfort';
    }

    return { level, score: Math.max(0, Math.min(100, score)), feedback };
  }

  /**
   * Get weather emoji for display
   */
  static getWeatherEmoji(condition: string): string {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
    if (lowerCondition.includes('wind')) return '💨';
    
    return '🌤️'; // Default partly cloudy
  }

  /**
   * Mock weather data for development
   */
  private static getMockWeatherData(): WeatherData {
    const conditions = [
      { condition: 'Clear sky', temp: 72, description: 'Sunny and pleasant' },
      { condition: 'Light rain', temp: 58, description: 'Light rain showers' },
      { condition: 'Partly cloudy', temp: 68, description: 'Partly cloudy skies' },
      { condition: 'Snow', temp: 28, description: 'Light snow falling' },
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: randomCondition.temp,
      condition: randomCondition.condition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      description: randomCondition.description,
      icon: this.getWeatherEmoji(randomCondition.condition),
      location: 'Your Location'
    };
  }

  /**
   * Default weather data fallback
   */
  private static getDefaultWeatherData(): WeatherData {
    return {
      temperature: 70,
      condition: 'Partly cloudy',
      humidity: 50,
      windSpeed: 8,
      description: 'Pleasant weather',
      icon: '🌤️',
      location: 'Unknown Location'
    };
  }

  /**
   * Check if weather data is recent (within last hour)
   */
  static isWeatherDataFresh(timestamp: number): boolean {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return timestamp > oneHourAgo;
  }

  /**
   * Get seasonal outfit recommendations
   */
  static getSeasonalTips(month: number): string[] {
    const tips: { [key: number]: string[] } = {
      0: ['Layer up for winter', 'Don\'t forget warm accessories'],  // January
      1: ['Still cold - keep layering', 'Waterproof boots recommended'], // February
      2: ['Spring layers are key', 'Light jacket for cool mornings'], // March
      3: ['Perfect for light jackets', 'Comfortable walking weather'], // April
      4: ['Great weather for most outfits', 'Light layers work well'], // May
      5: ['Summer is here', 'Light, breathable fabrics'], // June
      6: ['Stay cool and comfortable', 'Sun protection recommended'], // July
      7: ['Hot weather continues', 'Minimal layers needed'], // August
      8: ['Early fall transition', 'Light layers return'], // September
      9: ['Sweater weather begins', 'Perfect for layering'], // October
      10: ['Cool and crisp', 'Time for coats and jackets'], // November
      11: ['Winter prep time', 'Heavy layers and warm accessories'] // December
    };
    
    return tips[month] || ['Dress appropriately for the weather'];
  }
}