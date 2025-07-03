import React from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuickStatsCard = () => (
  <View style={styles.statsCard}>
    <Text style={styles.statsTitle}>Your Style Stats</Text>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Outfits</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>This Week</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Favorites</Text>
      </View>
    </View>
  </View>
);

const ActionButton = ({ 
  title, 
  subtitle, 
  onPress, 
  primary = false,
  icon 
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  primary?: boolean;
  icon: string;
}) => (
  <TouchableOpacity 
    style={[styles.actionButton, primary && styles.primaryActionButton]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.actionButtonContent}>
      <Text style={styles.actionButtonIcon}>{icon}</Text>
      <View style={styles.actionButtonText}>
        <Text style={[styles.actionButtonTitle, primary && styles.primaryActionButtonTitle]}>
          {title}
        </Text>
        <Text style={[styles.actionButtonSubtitle, primary && styles.primaryActionButtonSubtitle]}>
          {subtitle}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.heroTitle}>FitCheck</Text>
          <Text style={styles.heroSubtitle}>Your AI-powered outfit companion</Text>
        </View>

        {/* Quick Stats */}
        <QuickStatsCard />

        {/* Main Actions */}
        <View style={styles.actionsSection}>
          <ActionButton
            title="Take Outfit Photo"
            subtitle="Capture and analyze your style"
            icon="📸"
            primary={true}
            onPress={() => navigation.navigate('Camera')}
          />
          
          <ActionButton
            title="Browse Gallery"
            subtitle="View your outfit collection"
            icon="🖼️"
            onPress={() => navigation.navigate('Gallery')}
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>✨</Text>
            <Text style={styles.quickActionTitle}>AI Insights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>🌤️</Text>
            <Text style={styles.quickActionTitle}>Weather</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionTitle}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>⚙️</Text>
            <Text style={styles.quickActionTitle}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  welcomeText: {
    ...Typography.styles.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    ...Typography.styles.hero,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.styles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  
  // Stats Card
  statsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screen.horizontal,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.card,
    ...Shadows.md,
  },
  statsTitle: {
    ...Typography.styles.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.styles.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Actions Section
  actionsSection: {
    paddingHorizontal: Spacing.screen.horizontal,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    ...Typography.styles.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  primaryActionButtonTitle: {
    color: Colors.surface,
  },
  actionButtonSubtitle: {
    ...Typography.styles.body,
    color: Colors.textSecondary,
  },
  primaryActionButtonSubtitle: {
    color: Colors.glass,
  },
  
  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.screen.horizontal,
    marginBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (screenWidth - Spacing.screen.horizontal * 2 - Spacing.md) / 2,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    ...Typography.styles.bodySmall,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Bottom spacing for tab bar
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },
});

export default HomeScreen;