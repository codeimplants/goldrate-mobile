import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  requestOtpOnPhone,
  verifyOtpFromPhone,
} from '../services/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingApi, setLoadingApi] = useState<boolean>(false); // API loading
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true); // Initial auth check
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  const requestOtp = async (phone: string) => {
    try {
      setLoadingApi(true);
      const response = await requestOtpOnPhone(phone);
      console.log(response);

      if (response) {
        setPhoneNumber(phone);
        setOtpSent(true);
        return response;
      } else {
        console.error('Failed to request OTP:', response);
      }
    } catch (error) {
      console.error('Error requesting phone OTP:', error);
    } finally {
      setLoadingApi(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!phoneNumber) {
      console.error('Missing phoneNumber for OTP verification.');
      return false;
    }

    try {
      setLoadingApi(true);
      const response = await verifyOtpFromPhone(phoneNumber, otp);

      if (response?.token) {
        // ✅ Save user & token in storage
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('role', response.user.role);
        await AsyncStorage.setItem('userId', response.user.id.toString());
        if (response.user.wholesalerId) {
          await AsyncStorage.setItem('wholesalerId', response.user.wholesalerId.toString());
        }

        setUser(response.user);
        setRole(response.user.role);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      return false;
    } finally {
      setLoadingApi(false);
    }
  };

  // ✅ Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');

        if (storedUser && storedToken && storedRole) {
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoadingAuth(false); // ✅ finished checking
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('wholesalerId');
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
        otpSent,
        isAuthenticated,
        loadingApi,
        loadingAuth,
        requestOtp,
        verifyOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
