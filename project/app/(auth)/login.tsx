import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Logo Component (remote image)
const GrapeLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={{ uri: 'https://img-majestic-live.mncdn.com/Content/Images/Thumbs/0035438.png' }}
      style={styles.logoImage}
      resizeMode="contain"
      accessible
      accessibilityLabel="Company logo"
    />
  </View>
);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoSection}>
            <GrapeLogo />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && <ErrorMessage message={error} />}
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="EMAIL"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="PASSWORD"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!email || !password || isLoading}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity style={styles.registerLink}>
              <Text style={styles.registerText}>Register here </Text>
              <ChevronLeft size={16} color="#9CA3AF" style={styles.registerArrow} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // Dark background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FCD34D', // Yellow border
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 1,
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6B7280',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 40,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  registerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  registerArrow: {
    transform: [{ rotate: '180deg' }],
    marginLeft: 4,
  },
});