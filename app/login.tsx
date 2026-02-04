// app/login.tsx
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function LoginScreen() {
  const { login, loginError, loginLoading, clearLoginError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear error when user changes input (better UX)
  useEffect(() => {
    if (loginError) clearLoginError();
  }, [email, password]);

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      {loginError && (
        <Text style={styles.errorText}>{loginError}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loginLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loginLoading}
      />

      {loginLoading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={loginLoading}
          color="#0066cc"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
});