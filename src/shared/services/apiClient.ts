import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../constant';
// import Config from 'react-native-config';


// const API_BASE = Config.API_BASE;
console.log("api link", API_BASE);


const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token to each request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors & token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect to login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('wholesalerId');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
