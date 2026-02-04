import { Button, View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';


export default function ProfileScreen() {
  const { logout, user } = useAuth();

  return (
  <View style={styles.container}>
  {user && (
    <View style={styles.userInfo}>
      <ThemedText style={styles.name}>{user.name}</ThemedText>
      <ThemedText style={styles.email}>{user.email}</ThemedText>
    </View>
  )}

  <Button title="Logout" onPress={logout} color="#ef4444" />
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});