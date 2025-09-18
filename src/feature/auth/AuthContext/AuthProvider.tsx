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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingApi, setLoadingApi] = useState<boolean>(false); // API calls
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true); // Initial auth check
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
      const response: VerifiedUserResponse | null = await verifyOtpFromPhone(
        phoneNumber,
        otp,
      );

      if (response?.token) {
        // Save in AsyncStorage (normal login session)
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('role', response.user.role);
        await AsyncStorage.setItem('userId', response.user.id.toString());
        if (response.user.wholesalerId) {
          await AsyncStorage.setItem(
            'wholesalerId',
            response.user.wholesalerId.toString(),
          );
        }

        // Save in EncryptedStorage (for biometrics next time)
        await saveLoginSession(response.token, response.user);

        // Update state
        setUser(response.user);
        setRole(response.user.role);
        setIsAuthenticated(true);
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

  // 🔹 Load user on mount (biometric → fallback to storage)
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try biometric login first
        const biometricData = await checkBiometricAuth();
        if (biometricData) {
          const { user, token } = biometricData;
          setUser(user);
          setRole(user.role);
          setIsAuthenticated(true);
          return;
        }

        // Fallback to AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');

        if (storedUser && storedToken && storedRole) {
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        //   At this point, either logged in or not, role is settled
        setLoadingAuth(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Logout
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'user',
        'token',
        'role',
        'userId',
        'wholesalerId',
      ]);
      await EncryptedStorage.clear(); // clear biometrics too
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
