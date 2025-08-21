import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard';

// Navigation
import { NavigationStackParamList } from './Types/types';

// Custom hooks
import { useAuth } from '../feature/auth/hooks/useAuth';

const Stack = createNativeStackNavigator<NavigationStackParamList>();

const AuthNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'dashboard' : 'login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Dashboard */}
      <Stack.Screen name="dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
