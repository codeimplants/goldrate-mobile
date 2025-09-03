import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../feature/auth/components/Login/Login';
import OtpScreen from '../feature/auth/components/OtpScreen/OtpScreen';
import type { AuthStackParamList } from './Types/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={OtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
