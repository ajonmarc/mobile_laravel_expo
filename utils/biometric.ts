import * as LocalAuth from 'expo-local-authentication';

export async function canUseBiometrics() {
  const hasHardware = await LocalAuth.hasHardwareAsync();
  const isEnrolled = await LocalAuth.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticateBiometric() {
  return await LocalAuth.authenticateAsync({
    promptMessage: 'Unlock app',
    fallbackLabel: 'Use device passcode',
    cancelLabel: 'Cancel',
  });
}
