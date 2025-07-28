// /src/screens/RegisterScreen.tsx - 100% MODERNE ATOMIC DESIGN! 🚀

import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';

// 🎨 Modern atomic design imports!
import { Button, Input, Text } from '../shared/ui';
import { Header } from '../shared/ui/organisms/Header';
import { useTheme } from '../context/ThemeContext';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme } = useTheme();
  
  // 🎯 Form state - clean and simple
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🎯 Form handlers - super clean!
  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ✅ Enhanced form validation
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Passord må inneholde både store og små bokstaver';
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

  // 🔐 Register handler with enhanced error handling
  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Valideringsfeil', 'Vennligst rett opp feilene og prøv igjen');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Prøver å registrere ny bruker...');

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        console.log('❌ Registrering feilet:', error.message);
        
        // Better error messages
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

      console.log('✅ Registrering vellykket!');
      
      // Success message with next steps
      Alert.alert(
        'Registrering vellykket! 🎉',
        'Sjekk e-posten din for bekreftelseslenke, deretter kan du logge inn.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
    } catch (error) {
      console.log('💥 Uventet feil:', error);
      Alert.alert('Feil', 'En uventet feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  // 📱 Navigate to login
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  // 🎨 Password strength indicator
  const getPasswordStrength = (): { strength: string; color: string; message: string } => {
    const password = formData.password;
    
    if (!password) {
      return { strength: '', color: '', message: '' };
    }
    
    if (password.length < 6) {
      return { strength: 'Svakt', color: '#F44336', message: 'For kort' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return { strength: 'OK', color: '#FF9800', message: 'Legg til store bokstaver' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { strength: 'Bra', color: '#4CAF50', message: 'Vurder å legge til tall' };
    }
    
    return { strength: 'Sterkt', color: '#4CAF50', message: 'Godt passord!' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 📱 Header - Using organism! */}
        <Header 
          title="Opprett ny konto 🎉"
          subtitle="Kom i gang med TaskMaster Pro"
          showThemeToggle={true}
        />

        <View style={styles.formContainer}>
          {/* 📧 Email Input */}
          <Input
            label="E-post *"
            value={formData.email}
            onChangeText={updateField('email')}
            placeholder="din@epost.no"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="📧"
            error={errors.email}
            hint="Brukes for innlogging og viktige varsler"
            testID="register-email-input"
          />

          {/* 🔒 Password Input */}
          <Input
            label="Passord *"
            value={formData.password}
            onChangeText={updateField('password')}
            placeholder="Opprett et sikkert passord"
            secureTextEntry={true}
            leftIcon="🔒"
            error={errors.password}
            hint="Minst 6 tegn, med store og små bokstaver"
            testID="register-password-input"
          />

          {/* 💪 Password Strength Indicator */}
          {formData.password && (
            <View style={[styles.strengthIndicator, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Text variant="caption" color="secondary">
                Passordstyrke: 
              </Text>
              <Text variant="caption" style={{ color: passwordStrength.color, fontWeight: '600' }}>
                {passwordStrength.strength}
              </Text>
              <Text variant="caption" color="secondary">
                {passwordStrength.message && ` - ${passwordStrength.message}`}
              </Text>
            </View>
          )}

          {/* 🔒 Confirm Password Input */}
          <Input
            label="Bekreft passord *"
            value={formData.confirmPassword}
            onChangeText={updateField('confirmPassword')}
            placeholder="Skriv inn passordet på nytt"
            secureTextEntry={true}
            leftIcon="✅"
            error={errors.confirmPassword}
            testID="register-confirm-password-input"
          />

          {/* 🚀 Register Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
            testID="register-submit-button"
          >
            {loading ? '🔄 Oppretter konto...' : '🎉 Opprett konto'}
          </Button>

          {/* 📝 Login Link */}
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
              🔐 Logg inn her
            </Button>
          </View>

          {/* 📋 Terms Section */}
          <View style={[styles.termsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text variant="caption" color="secondary" align="center">
              📋 Ved å opprette en konto godtar du våre brukervilkår og personvernregler
            </Text>
          </View>

          {/* 💡 Benefits Section */}
          <View style={[styles.benefitsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text variant="subtitle2" color="primary" style={styles.benefitsTitle}>
              🌟 Med TaskMaster Pro får du:
            </Text>
            <Text variant="body2" color="secondary">
              ✅ Ubegrenset antall oppgaver
            </Text>
            <Text variant="body2" color="secondary">
              📊 Detaljert dashboard og statistikk
            </Text>
            <Text variant="body2" color="secondary">
              🏷️ Kategorisering og prioritering
            </Text>
            <Text variant="body2" color="secondary">
              🌙 Mørkt tema støtte
            </Text>
            <Text variant="body2" color="secondary">
              📱 Synkronisering på tvers av enheter
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
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  strengthIndicator: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: -12,
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
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 12,
    paddingHorizontal: 32,
  },
  termsSection: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  benefitsSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  benefitsTitle: {
    marginBottom: 8,
  },
});