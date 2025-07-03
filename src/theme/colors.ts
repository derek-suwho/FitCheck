export const Colors = {
  // Primary Color Palette (2024-2025 Trends)
  primary: '#6B4E3D',      // Deep Mocha - Pantone 2025 inspired
  secondary: '#8B7355',    // Cinnamon Slate - Benjamin Moore's choice
  accent: '#FFD700',       // Canary Yellow - Dulux Color of the Year 2025
  
  // Neutral Colors
  background: '#FAF9F7',   // Warm Off-White
  surface: '#FFFFFF',      // Clean White
  text: '#2D2D2D',         // Charcoal
  textSecondary: '#666666', // Medium Gray
  textTertiary: '#999999', // Light Gray
  
  // Status Colors
  success: '#87A96B',      // Sage Green
  error: '#FF6B6B',        // Coral Red
  warning: '#F7931E',      // Orange
  info: '#4A90E2',         // Blue
  
  // Glassmorphism & Modern Effects
  glass: 'rgba(255, 255, 255, 0.25)',
  glassDark: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Gradient Colors
  gradientPrimary: ['#6B4E3D', '#8B7355'],
  gradientAccent: ['#FFD700', '#FFA500'],
  gradientBackground: ['#FAF9F7', '#FFFFFF'],
  
  // Dark Mode Colors
  dark: {
    primary: '#8B7355',
    secondary: '#6B4E3D',
    accent: '#FFD700',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    glass: 'rgba(255, 255, 255, 0.15)',
    glassDark: 'rgba(0, 0, 0, 0.5)',
  }
};

export const Gradients = {
  primary: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.secondary} 100%)`,
  accent: `linear-gradient(135deg, ${Colors.accent} 0%, #FFA500 100%)`,
  glassmorphism: `linear-gradient(135deg, ${Colors.glass} 0%, rgba(255, 255, 255, 0.1) 100%)`,
  overlay: `linear-gradient(180deg, transparent 0%, ${Colors.overlay} 100%)`,
};