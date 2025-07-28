// /src/screens/HomeScreen.tsx - 100% MODERNE LANDING PAGE! 🏠

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

// 🎨 Modern atomic design imports!
import { Button, Text } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { StatCard } from '../shared/ui/organisms/DashboardComponents';
import { useTheme } from '../context/ThemeContext';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Check if user is logged in
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.log('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Navigation handlers
  const handleNavigateToTasks = () => {
    navigation.navigate('TaskList');
  };

  const handleNavigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Logout error:', error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text variant="body1" color="secondary" style={styles.loadingText}>
          Laster...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 📱 Header */}
        <Header 
          title={user ? `Hei igjen! 👋` : "TaskMaster Pro"}
          subtitle={user ? `Velkommen tilbake, ${user.email}` : "Din personlige oppgavebehandler"}
          showThemeToggle={true}
        />

        {/* 🎉 Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text variant="h3" color="primary" style={styles.welcomeTitle}>
            🚀 Velkommen til TaskMaster Pro!
          </Text>
          
          <Text variant="body1" color="secondary" style={styles.welcomeDescription}>
            Den ultimate appen for å organisere ditt liv og øke produktiviteten din.
          </Text>
        </View>

        {user ? (
          // 👤 LOGGED IN USER VIEW
          <>
            {/* 🎯 Quick Actions for Logged In Users */}
            <View style={styles.section}>
              <Text variant="h4" color="primary" style={styles.sectionTitle}>
                🎯 Kom i gang
              </Text>
              
              <View style={styles.actionGrid}>
                <Button
                  variant="primary"
                  size="large"
                  onPress={handleNavigateToTasks}
                  style={styles.primaryAction}
                  testID="navigate-to-tasks"
                >
                  📋 Mine oppgaver
                </Button>
                
                <Button
                  variant="info"
                  size="large"
                  onPress={handleNavigateToDashboard}
                  style={styles.secondaryAction}
                  testID="navigate-to-dashboard"
                >
                  📊 Dashboard
                </Button>
              </View>
            </View>

            {/* 📊 Quick Stats Preview */}
            <View style={styles.section}>
              <Text variant="h4" color="primary" style={styles.sectionTitle}>
                📊 Rask oversikt
              </Text>
              
              <View style={styles.statsGrid}>
                <StatCard
                  title="Dine oppgaver"
                  value="Se alle"
                  color="#007AFF"
                  icon="📝"
                />
                
                <StatCard
                  title="Dashboard"
                  value="Statistikk"
                  color="#4CAF50"
                  icon="📊"
                />
              </View>
            </View>

            {/* 🔓 Logout Section */}
            <View style={styles.section}>
              <Button
                variant="secondary"
                size="medium"
                onPress={handleLogout}
                style={styles.logoutButton}
                testID="logout-button"
              >
                🔓 Logg ut
              </Button>
            </View>
          </>
        ) : (
          // 🔐 NOT LOGGED IN VIEW
          <>
            {/* 🌟 Features Section */}
            <View style={styles.section}>
              <Text variant="h4" color="primary" style={styles.sectionTitle}>
                🌟 Hva kan du gjøre?
              </Text>
              
              <View style={[styles.featuresGrid, { borderColor: theme.border }]}>
                <View style={styles.featureItem}>
                  <Text variant="h2" style={styles.featureIcon}>📝</Text>
                  <Text variant="subtitle2" color="primary">Organiser oppgaver</Text>
                  <Text variant="caption" color="secondary">Hold oversikt over alt du må gjøre</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text variant="h2" style={styles.featureIcon}>📊</Text>
                  <Text variant="subtitle2" color="primary">Se din fremgang</Text>
                  <Text variant="caption" color="secondary">Detaljert statistikk og dashboard</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text variant="h2" style={styles.featureIcon}>🏷️</Text>
                  <Text variant="subtitle2" color="primary">Kategoriser</Text>
                  <Text variant="caption" color="secondary">Sorter etter jobb, helse, personlig</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text variant="h2" style={styles.featureIcon}>⚡</Text>
                  <Text variant="subtitle2" color="primary">Prioriter</Text>
                  <Text variant="caption" color="secondary">Fokuser på det som er viktigst</Text>
                </View>
              </View>
            </View>

            {/* 🚀 Call-to-Action Section */}
            <View style={styles.section}>
              <Text variant="h4" color="primary" style={styles.sectionTitle}>
                🚀 Kom i gang nå!
              </Text>
              
              <Button
                variant="primary"
                size="large"
                fullWidth
                onPress={handleNavigateToRegister}
                style={styles.ctaButton}
                testID="navigate-to-register"
              >
                🎉 Opprett gratis konto
              </Button>
              
              <Button
                variant="secondary"
                size="medium"
                fullWidth
                onPress={handleNavigateToLogin}
                style={styles.loginLinkButton}
                testID="navigate-to-login"
              >
                🔐 Har allerede konto? Logg inn
              </Button>
            </View>

            {/* 💡 Benefits Section */}
            <View style={[styles.benefitsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text variant="h5" color="primary" style={styles.benefitsTitle}>
                💡 Hvorfor TaskMaster Pro?
              </Text>
              
              <Text variant="body2" color="secondary" style={styles.benefitItem}>
                ✅ Helt gratis å bruke
              </Text>
              <Text variant="body2" color="secondary" style={styles.benefitItem}>
                📱 Fungerer på mobil og web
              </Text>
              <Text variant="body2" color="secondary" style={styles.benefitItem}>
                🌙 Støtter mørkt tema
              </Text>
              <Text variant="body2" color="secondary" style={styles.benefitItem}>
                🔒 Sikker lagring i skyen
              </Text>
              <Text variant="body2" color="secondary" style={styles.benefitItem}>
                📊 Detaljert fremgangsrapporter
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  welcomeSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionGrid: {
    gap: 12,
  },
  primaryAction: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryAction: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    marginBottom: 8,
  },
  ctaButton: {
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginLinkButton: {
    marginTop: 8,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  benefitsSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  benefitsTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitItem: {
    marginBottom: 6,
  },
});