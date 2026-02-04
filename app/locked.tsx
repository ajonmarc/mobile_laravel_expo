// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'expo-router';

// export default function LockedScreen() {
//   const { unlockBiometric } = useAuth();
//   const router = useRouter();

//   const unlock = async () => {
//     const success = await unlockBiometric();

//     if (success) {
//       router.replace('/'); // or '/(tabs)' if you use tabs
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.lock}>🔒</Text>
//       <Text style={styles.title}>App Locked</Text>
//       <Text style={styles.subtitle}>
//         Authenticate to continue
//       </Text>

//       <Button title="Unlock" onPress={unlock} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   lock: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     opacity: 0.7,
//     marginBottom: 24,
//   },
// });
