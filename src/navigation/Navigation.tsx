import AuthNavigator from './AuthNavigation';
import AppNavigation from './AppNavigation';
import { useAuth } from '../feature/auth/hooks/useAuth';
import React from 'react';
import { Box, Spinner, Text } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Navigation: React.FC = () => {
  const { isAuthenticated, loadingAuth } = useAuth();

  console.log('Auth state:', { isAuthenticated, loadingAuth });
  
  // Show loading screen while checking authentication
  if (loadingAuth) {
    return (
      <SafeAreaProvider>
        <Box flex={1} justifyContent="center" alignItems="center" bg="purple.50">
          <Spinner size="lg" color="purple.600" />
          <Text mt={4} color="purple.600" fontSize="md">
            Loading...
          </Text>
        </Box>
      </SafeAreaProvider>
    );
  }
  
  return isAuthenticated ? <AppNavigation /> : <AuthNavigator />;
};

export default Navigation;
