constants/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/api', // Android Emulator
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

npm install axios
npx expo install expo-secure-store

app/(tabs)/index.tsx

import { useEffect, useState } from 'react';
import { api } from '@/constants/api';

export default function HomeScreen() {
  const [apiResult, setApiResult] = useState('Testing API...');

  useEffect(() => {
    api.get('/health')
      .then(res => {
        console.log('API RESPONSE:', res.data);
        setApiResult(JSON.stringify(res.data));
      })
      .catch(err => {
        console.error('API ERROR:', err.message);
        setApiResult(`Error: ${err.message}`);
      });
  }, []);

  return (


<ThemedView style={styles.stepContainer}>
  <ThemedText type="subtitle">Laravel API Status</ThemedText>
  <ThemedText>{apiResult}</ThemedText>
</ThemedView>


