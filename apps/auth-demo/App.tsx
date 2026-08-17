import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from './src/components/organisms/LoginForm';
import { RegisterForm } from './src/components/organisms/RegisterForm';
import { HomeScreen } from './src/components/organisms/HomeScreen';
import { useAuth } from './src/hooks/useAuth';
import { colors } from './src/theme';

type AuthScreen = 'login' | 'register';

export default function App() {
  const { user, isLoaded, register, login, logout } = useAuth();
  const [screen, setScreen] = useState<AuthScreen>('login');

  if (!isLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {user ? (
            <HomeScreen user={user} onLogout={logout} />
          ) : screen === 'login' ? (
            <LoginForm onLogin={login} onSwitchToRegister={() => setScreen('register')} />
          ) : (
            <RegisterForm onRegister={register} onSwitchToLogin={() => setScreen('login')} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
