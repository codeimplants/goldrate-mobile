import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../feature/auth/components/Login/Login';
import OtpScreen from '../feature/auth/components/OtpScreen/OtpScreen';
import type { AuthStackParamList } from './Types/types';
import { useAuth } from '../feature/auth/hooks/useAuth';
import HomePage from '../pages/HomePage/HomePage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {

  const {role} = useAuth();

  if (role) {
    // If role is set, user should not be in Auth flow
    return null;
  }


  return (
    <Stack.Navigator
      initialRouteName="homepage"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="homepage" component={HomePage} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={OtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
