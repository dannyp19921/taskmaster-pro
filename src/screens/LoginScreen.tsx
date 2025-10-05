// /src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email.trim()) {
      newErrors.email = 'E-post er påkrevd';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ugyldig e-postformat';
    }

    if (!formData.password) {
      newErrors.password = 'Passord er påkrevd';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passord må være minst 6 tegn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        let errorMessage = 'Innlogging feilet';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Ugyldig e-post eller passord';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'E-post ikke bekreftet. Sjekk innboksen din.';
        }
        
        Alert.alert('Feil', errorMessage);
        return;
      }

      Alert.alert('Velkommen!', 'Du er nå logget inn');
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Velkommen tilbake!"
        subtitle="Logg inn for å fortsette"
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
          testID="login-email-input"
        />

        <Input
          label="Passord *"
          value={formData.password}
          onChangeText={updateField('password')}
          placeholder="Skriv inn passordet ditt"
          secureTextEntry={true}
          error={errors.password}
          hint="Minst 6 tegn"
          testID="login-password-input"
        />

        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleLogin}
          disabled={loading}
          style={styles.loginButton}
          testID="login-submit-button"
        >
          {loading ? 'Logger inn...' : 'Logg inn'}
        </Button>

        <View style={styles.registerSection}>
          <Text variant="body2" color="secondary" align="center">
            Har du ikke konto ennå?
          </Text>
          
          <Button
            variant="secondary"
            size="medium"
            onPress={handleNavigateToRegister}
            disabled={loading}
            style={styles.registerButton}
            testID="navigate-to-register-button"
          >
            Opprett ny konto
          </Button>
        </View>

        <View style={[styles.helpSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text variant="caption" color="secondary" align="center">
            Tips: Bruk samme e-post og passord som du registrerte deg med
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  registerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 12,
    paddingHorizontal: 32,
  },
  helpSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});