import AuthNavigator from './AuthNavigation';
import AppNavigation from './AppNavigation';
import { useAuth } from '../feature/auth/hooks/useAuth';
import React from 'react';
import SplashScreen from '../pages/Splash/SplashScreen';
import BiometricRetry from '../components/BiometricRetry';

const Navigation: React.FC = () => {
  const { isAuthenticated, loadingAuth, hasLoggedOut, biometricFailed, biometricLoading } = useAuth();

  // Initial auth still loading
  // if (loadingAuth || biometricLoading) return <SplashScreen />;
if (loadingAuth) return <SplashScreen />;
  // If biometric failed → retry
  // if (biometricFailed && !isAuthenticated) return <BiometricRetry />;

  // If authenticated → straight to app
  if (isAuthenticated) return <AppNavigation />;

  // Otherwise → login/signup
  if (hasLoggedOut || !isAuthenticated) return <AuthNavigator />;

  return <SplashScreen />;
};


export default Navigation;
