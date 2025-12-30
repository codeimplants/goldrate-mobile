import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../constant';
import { forceLogout } from '../utils/forceLogout';

console.log('API BASE:', API_BASE);

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🔹 Logout callback (registered from AuthProvider)
 */
let logoutHandler: (() => void) | null = null;

/**
 * 🔹 Guard to prevent multiple logout calls
 */
let isLoggingOut = false;

/**
 * 🔹 Register logout handler from React side
 */
export const registerLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

/**
 * 🔹 Request Interceptor
 * Attach JWT token to every request
 */
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 *  Response Interceptor — FORCED LOGOUT CORE
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !isLoggingOut) {
  isLoggingOut = true;

  await forceLogout();
  logoutHandler?.();

  setTimeout(() => {
    isLoggingOut = false;
  }, 500);
}


    return Promise.reject(error);
  }
);

export default apiClient;
