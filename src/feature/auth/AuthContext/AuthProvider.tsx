import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  requestOtpOnPhone,
  verifyOtpFromPhone,
  VerifiedUserResponse,
} from '../services/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  saveLoginSession,
  checkBiometricAuth,
} from '../../../shared/utils/biometricAuth';
import { clearDeviceToken, registerDeviceToken } from '../../../shared/services/notificationService';
import { OneSignal } from 'react-native-onesignal';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  // 🔹 Request OTP
  const requestOtp = async (phone: string) => {
    try {
      setLoadingApi(true);
      const response = await requestOtpOnPhone(phone);
      if (response) {
        setPhoneNumber(phone);
        setOtpSent(true);
        return response;
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
    } finally {
      setLoadingApi(false);
    }
  };

  // 🔹 Verify OTP
  const verifyOtp = async (otp: string) => {
    if (!phoneNumber) {
      console.error('Missing phoneNumber for OTP verification.');
      return undefined;
    }

    try {
      setLoadingApi(true);
      const response: VerifiedUserResponse | null = await verifyOtpFromPhone(phoneNumber, otp);

      if (response?.token) {
        // Save in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('role', response.user.role);
        await AsyncStorage.setItem('userId', response.user.id.toString());
        if (response.user.wholesalerId) {
          await AsyncStorage.setItem('wholesalerId', response.user.wholesalerId.toString());
        }

        // Save in EncryptedStorage (for biometrics)
        await saveLoginSession(response.token, response.user);

        // Update state
        setUser(response.user);
        setRole(response.user.role);
        setIsAuthenticated(true);

        // 🔹 Register device token after login
        try {
          await registerDeviceToken(Number(response.user.id));
          console.log('Device token registered after OTP verification');
        } catch (err) {
          console.error('Failed to register device token:', err);
        }

        return response;
      }
      return undefined;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return undefined;
    } finally {
      setLoadingApi(false);
    }
  };

  // 🔹 Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try biometric login
        const biometricData = await checkBiometricAuth();
        if (biometricData) {
          const { user, token } = biometricData;
          setUser(user);
          setRole(user.role);
          setIsAuthenticated(true);

          // Optionally re-register token here if needed
          try {
            await registerDeviceToken(user.id);
            console.log('Device token re-registered after biometric login');
          } catch (err) {
            console.error('Failed to re-register device token:', err);
          }

          return;
        }

        // Fallback to AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');

        if (storedUser && storedToken && storedRole) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(storedRole);
          setIsAuthenticated(true);

          try {
            await registerDeviceToken(parsedUser.id);
          } catch (err) {
            console.error('Failed to re-register device token:', err);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Logout
  const logout = async () => {
    try {
      if (user?.id) {
        await clearDeviceToken(user.id);
        console.log('Device token cleared on logout');
      }

      await AsyncStorage.multiRemove(['user', 'token', 'role', 'userId', 'wholesalerId']);
      await EncryptedStorage.clear();

      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        phoneNumber,
        otpSent,
        isAuthenticated,
        loadingApi,
        loadingAuth,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
