import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return false;

    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < exp * 1000;
  } catch (err) {
    return false;
  }
};

export const hasRole = async (expectedRole: string): Promise<boolean> => {
  try {
    const storedRole = await AsyncStorage.getItem('role');
    return storedRole === expectedRole;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

export const getUserRole = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('role');
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('wholesalerId');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};


function atob(arg0: string): string {
  throw new Error('Function not implemented.');
}

