# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitCheck is a React Native mobile app for outfit management and fashion intelligence. The app includes photo capture, AI-powered clothing analysis, outfit cataloging, and social sharing features.

## Technology Stack

- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation 6
- **State Management**: Zustand or Redux Toolkit
- **Camera**: react-native-vision-camera
- **Storage**: MMKV for fast local storage
- **Backend**: Firebase or Supabase for mobile-first BaaS

## Development Phases

### Phase 1: React Native Setup & Foundation
- Initialize React Native project with TypeScript
- Configure navigation (React Navigation 6)
- Set up state management (Redux Toolkit or Zustand)
- Configure dev tools and debugging
- Camera integration (react-native-vision-camera)
- Image picker and permissions
- Local storage (AsyncStorage/MMKV)
- Push notifications setup

### Phase 2: Camera & Photo Processing
- Full-length mirror selfie camera interface
- Image compression and optimization
- Local image gallery with thumbnails
- Basic photo editing tools
- AI Integration (Mobile-Optimized)
- Background removal API integration
- On-device image processing where possible
- Clothing item detection and auto-tagging
- Color correction and cropping

### Phase 3: Core App Features
- Grid-based outfit gallery
- Swipe gestures and mobile interactions
- Search and filter functionality
- Outfit detail views with zoom
- Wear tracking with simple tap interface
- Cost-per-wear calculator
- Weather-based outfit suggestions
- Smart notifications for unworn items

### Phase 4: Social & Sharing
- Native sharing to Instagram Stories
- In-app friend system with mobile contacts integration
- Outfit rating system (swipe to rate)
- Monthly analytics dashboard

### Phase 5: Monetization & Polish
- In-app purchase integration (React Native IAP)
- Subscription management
- Premium feature gating
- Free trial implementation
- Image caching and optimization
- Offline functionality
- App store optimization
- Push notification system

## Repository Structure

- `FitCheckApp/` - Main React Native application directory

## Common Development Tasks

When setting up the project:
```bash
npx react-native init FitCheckApp --template react-native-template-typescript
cd FitCheckApp
npm install
```

When developing:
```bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm test           # Run tests
npm run lint       # Run ESLint
```