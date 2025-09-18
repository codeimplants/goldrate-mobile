import AuthNavigator from './AuthNavigation';
import AppNavigation from './AppNavigation';
import { useAuth } from '../feature/auth/hooks/useAuth';
import React from 'react';
import SplashScreen from '../pages/Splash/SplashScreen';
import BiometricGate from '../components/BiometricGate';

const Navigation: React.FC = () => {
  const { isAuthenticated, loadingAuth } = useAuth();

  // Show splash only during initial auth bootstrap
  if (loadingAuth) {
    return <SplashScreen />;
  }

  return (
    <>
      {isAuthenticated ? <AppNavigation /> : <AuthNavigator />}
      {/* Biometric overlay placeholder; enable when wiring biometrics */}
     
    </>
  );
};

export default Navigation;
