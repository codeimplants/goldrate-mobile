import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../feature/auth/components/Login/Login';
import type { NavigationStackParamList } from './Types/types'; // Adjust path if needed

const Stack = createNativeStackNavigator<NavigationStackParamList>();

const AuthNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
