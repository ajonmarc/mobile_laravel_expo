import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/api', // Android Emulator
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

//constants/api.ts

import * as SecureStore from 'expo-secure-store';

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
