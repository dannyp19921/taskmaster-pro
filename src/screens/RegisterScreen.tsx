// /src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';

import { validateRegisterForm, type RegisterFormData } from '../shared/utils/validation';
import { getAuthErrorMessage } from '../shared/utils/authErrors';
import { showAlert } from '../shared/utils/platformAlert';

interface RegisterScreenProps {
  navigation: any;
}

const getPasswordStrength = (password: string): { label: string; color: string } => {
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

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof RegisterFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateRegisterForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showAlert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        const errorMessage = getAuthErrorMessage(error);
        showAlert('Feil', errorMessage);
        return;
      }

      showAlert(
        'Registrering vellykket!',
        'Du kan nå logge inn med din nye konto.',
        () => navigation.navigate('Login')
      );
      
    } catch (error) {
      console.error('Register error:', error);
      showAlert('Feil', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
              onPress={() => navigation.navigate('Login')}
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