export { Colors, Gradients } from './colors';
export { Typography } from './typography';
export { Spacing, BorderRadius, Shadows } from './spacing';

// Theme configuration
export const Theme = {
  // Animation durations
  animations: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Common dimensions
  dimensions: {
    headerHeight: 88,
    tabBarHeight: 83,
    buttonHeight: 48,
    inputHeight: 48,
    cardMinHeight: 120,
  },
  
  // Breakpoints (for responsive design)
  breakpoints: {
    small: 320,
    medium: 375,
    large: 414,
    tablet: 768,
  },
  
  // Z-index layers
  zIndex: {
    base: 1,
    modal: 1000,
    overlay: 1100,
    tooltip: 1200,
    toast: 1300,
  }
};