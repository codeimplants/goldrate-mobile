import AuthNavigator from './AuthNavigation';
import AppNavigation from './AppNavigation';
import { useAuth } from '../feature/auth/hooks/useAuth';
import React from 'react';

const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);
  
  return isAuthenticated ? <AppNavigation /> : <AuthNavigator />;
};

export default Navigation;
