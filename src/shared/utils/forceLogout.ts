// shared/utils/forceLogout.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { OneSignal } from 'react-native-onesignal';

export const forceLogout = async () => {
  await AsyncStorage.multiRemove([
    'user',
    'token',
    'role',
    'userId',
    'wholesalerId',
  ]);

  await EncryptedStorage.clear();

  try {
    OneSignal.logout();
  } catch {}
};
