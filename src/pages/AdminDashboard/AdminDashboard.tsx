import React from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../feature/auth/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

//adminDashboard
const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const handleManageUsers = () => {
    navigation.navigate('manageUsers' as never);
  };

  const handleViewReports = () => {
    Alert.alert('System Reports', 'Loading system reports and analytics...');
  };

  const handleManagePenalties = () => {
    Alert.alert('Penalty Management', 'Opening penalty management system...');
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#f3e8ff', '#fdf2f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Box flex={1}>
          {/* Header */}
          <LinearGradient
            colors={['#a855f7', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingTop: 50,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Heading size="lg" color="white">
                  Gold Rate Broadcast
                </Heading>
                <Text color="white" fontSize="sm">
                  Admin Dashboard
                </Text>
              </VStack>
              <Button
                variant="outline"
                borderColor="white"
                _text={{ color: 'white' }}
                onPress={handleLogout}
                size="sm"
              >
                Logout
              </Button>
            </HStack>
          </LinearGradient>

          {/* Main Content */}
          <ScrollView flex={1} px={4} py={6}>
            <VStack space={4}>
              <Heading size="md" color="purple.800" mb={2}>
                Welcome, {user?.name || 'Admin'}
              </Heading>

              {/* Dashboard Cards */}
              <VStack space={4}>
                {/* User Management Card */}
                <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                  <VStack space={3}>
                    <Heading size="sm" color="purple.800">
                      User Management
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Approve new wholesalers and manage existing ones.
                    </Text>
                    <Button
                      bg="purple.600"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                      onPress={handleManageUsers}
                      borderRadius="lg"
                    >
                      Manage Users
                    </Button>
                  </VStack>
                </Card>

                {/* System Reports Card */}
                <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                  <VStack space={3}>
                    <Heading size="sm" color="purple.800">
                      System Reports
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      View system-wide reports and analytics.
                    </Text>
                    <Button
                      bg="purple.600"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                      onPress={handleViewReports}
                      borderRadius="lg"
                    >
                      View Reports
                    </Button>
                  </VStack>
                </Card>

                {/* Penalty Management Card */}
                <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                  <VStack space={3}>
                    <Heading size="sm" color="purple.800">
                      Penalty Management
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Review and waive penalties for retailers.
                    </Text>
                    <Button
                      bg="purple.600"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                      onPress={handleManagePenalties}
                      borderRadius="lg"
                    >
                      Manage Penalties
                    </Button>
                  </VStack>
                </Card>
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default AdminDashboard;
