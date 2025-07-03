import { Platform } from 'react-native';

export const Typography = {
  // Font Families
  primary: Platform.select({
    ios: 'Inter',
    android: 'Inter-Regular',
    default: 'System',
  }),
  display: Platform.select({
    ios: 'Playfair Display',
    android: 'PlayfairDisplay-Regular',
    default: 'serif',
  }),
  
  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Text Styles
  styles: {
    // Display Text
    hero: {
      fontFamily: Platform.select({
        ios: 'Playfair Display',
        android: 'PlayfairDisplay-Bold',
        default: 'serif',
      }),
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    
    // Headers
    h1: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Bold',
        default: 'System',
      }),
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-SemiBold',
        default: 'System',
      }),
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-SemiBold',
        default: 'System',
      }),
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Medium',
        default: 'System',
      }),
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
    
    // Body Text
    body: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Regular',
        default: 'System',
      }),
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Regular',
        default: 'System',
      }),
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Regular',
        default: 'System',
      }),
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    
    // UI Elements
    button: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-SemiBold',
        default: 'System',
      }),
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.2,
    },
    buttonLarge: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-SemiBold',
        default: 'System',
      }),
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.2,
    },
    caption: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Regular',
        default: 'System',
      }),
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
    },
    overline: {
      fontFamily: Platform.select({
        ios: 'Inter',
        android: 'Inter-Medium',
        default: 'System',
      }),
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
  }
};