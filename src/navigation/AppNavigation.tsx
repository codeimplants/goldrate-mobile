import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import RetailerDashboard from '../pages/RetailerDashboard/RetailerDashboard';
import WholesalerDashboard from '../pages/WholesalerDashboard/WholesalerDashboard';
import ManageUsers from '../pages/admin/ManageUsers/ManageUsers';
import CreateUserForm from '../pages/admin/CreateUserForm/CreateUserForm';
import RoleUserList from '../pages/admin/RoleUserList/RoleUserList';

// Navigation
import { AppStackParamList } from './Types/types';

// Custom hooks
import { useAuth } from '../feature/auth/hooks/useAuth';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigation: React.FC = () => {
  const { role } = useAuth();

  const getInitialRoute = () => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'adminDashboard';
      case 'RETAILER':
        return 'retailerDashboard';
      case 'WHOLESALER':
        return 'wholesalerDashboard';
      default:
        return 'adminDashboard';
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="adminDashboard" component={AdminDashboard} />
      <Stack.Screen name="retailerDashboard" component={RetailerDashboard} />
      <Stack.Screen name="wholesalerDashboard" component={WholesalerDashboard} />
      <Stack.Screen name="manageUsers" component={ManageUsers} />
      <Stack.Screen name="createUser" component={CreateUserForm} />
      <Stack.Screen name="roleUserList" component={RoleUserList} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
