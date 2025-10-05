// /src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-post er påkrevd';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ugyldig e-postformat';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Passord er påkrevd';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passord må være minst 6 tegn';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Bekreft passord er påkrevd';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passordene stemmer ikke overens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        let errorMessage = 'Registrering feilet';
        if (error.message.includes('User already registered')) {
          errorMessage = 'En bruker med denne e-posten eksisterer allerede';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Passordet er for svakt';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Ugyldig e-postadresse';
        }
        
        Alert.alert('Feil', errorMessage);
        return;
      }

      Alert.alert(
        'Registrering vellykket!',
        'Du kan nå logge inn med din nye konto.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  // Password strength indicator
  const getPasswordStrength = (): { label: string; color: string } => {
    const password = formData.password;
    
    if (!password) return { label: '', color: '' };
    
    if (password.length < 6) {
      return { label: 'Svakt', color: '#F44336' };
    }
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (hasLower && hasUpper && hasNumber) {
      return { label: 'Sterkt', color: '#4CAF50' };
    }
    
    if (hasLower && hasUpper) {
      return { label: 'Bra', color: '#4CAF50' };
    }
    
    return { label: 'Middels', color: '#FF9800' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header 
          title="Opprett ny konto"
          subtitle="Kom i gang med TaskMaster Pro"
          showThemeToggle={true}
        />

        <View style={styles.formContainer}>
          <Input
            label="E-post *"
            value={formData.email}
            onChangeText={updateField('email')}
            placeholder="din@epost.no"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            testID="register-email-input"
          />

          <Input
            label="Passord *"
            value={formData.password}
            onChangeText={updateField('password')}
            placeholder="Opprett et sikkert passord"
            secureTextEntry={true}
            error={errors.password}
            testID="register-password-input"
          />

          {formData.password && passwordStrength.label ? (
            <View style={[styles.strengthIndicator, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text variant="caption" color="secondary">
                Passordstyrke: 
              </Text>
              <Text variant="caption" style={{ color: passwordStrength.color, fontWeight: '600', marginLeft: 4 }}>
                {passwordStrength.label}
              </Text>
            </View>
          ) : (
            <Text variant="caption" color="secondary" style={styles.hintText}>
              Minst 6 tegn
            </Text>
          )}

          <Input
            label="Bekreft passord *"
            value={formData.confirmPassword}
            onChangeText={updateField('confirmPassword')}
            placeholder="Skriv inn passordet på nytt"
            secureTextEntry={true}
            error={errors.confirmPassword}
            testID="register-confirm-password-input"
          />

          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
            testID="register-submit-button"
          >
            {loading ? 'Oppretter konto...' : 'Opprett konto'}
          </Button>

          <View style={styles.loginSection}>
            <Text variant="body2" color="secondary" align="center">
              Har du allerede en konto?
            </Text>
            
            <Button
              variant="secondary"
              size="medium"
              onPress={handleNavigateToLogin}
              disabled={loading}
              style={styles.loginButton}
              testID="navigate-to-login-button"
            >
              Logg inn her
            </Button>
          </View>

          <View style={[styles.termsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text variant="caption" color="secondary" align="center">
              Ved å opprette en konto godtar du våre brukervilkår og personvernregler
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formContainer: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 20,
  },
  strengthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: -8,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 12,
    paddingHorizontal: 32,
  },
  termsSection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  hintText: {
    marginTop: 4,
    marginBottom: 16,
    marginLeft: 4,
  },
});