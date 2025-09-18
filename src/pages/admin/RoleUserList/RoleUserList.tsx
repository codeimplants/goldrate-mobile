import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Badge,
  Divider,
  Select,
  CheckIcon,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'WHOLESALER' | 'RETAILER';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

const RoleUserList: React.FC = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '9876543210',
        role: 'WHOLESALER',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20',
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '9876543211',
        role: 'RETAILER',
        status: 'active',
        createdAt: '2024-01-16',
        lastLogin: '2024-01-19',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        phone: '9876543212',
        role: 'RETAILER',
        status: 'pending',
        createdAt: '2024-01-17',
      },
      {
        id: '4',
        name: 'Alice Brown',
        phone: '9876543213',
        role: 'WHOLESALER',
        status: 'inactive',
        createdAt: '2024-01-18',
        lastLogin: '2024-01-15',
      },
      {
        id: '5',
        name: 'Charlie Wilson',
        phone: '9876543214',
        role: 'ADMIN',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-20',
      },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users by role
  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole));
    }
  }, [users, selectedRole]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUserAction = (userId: string, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Handle user action here
            Alert.alert('Success', `User ${action} successfully`);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'purple';
      case 'WHOLESALER':
        return 'blue';
      case 'RETAILER':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getRoleStats = () => {
    const stats = {
      ADMIN: users.filter(u => u.role === 'ADMIN').length,
      WHOLESALER: users.filter(u => u.role === 'WHOLESALER').length,
      RETAILER: users.filter(u => u.role === 'RETAILER').length,
    };
    return stats;
  };

  const stats = getRoleStats();

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
              <HStack alignItems="center" space={3}>
                <Button
                  variant="ghost"
                  _text={{ color: 'white' }}
                  onPress={handleBack}
                  size="sm"
                >
                  ← Back
                </Button>
                <VStack>
                  <Heading size="lg" color="white">
                    User List
                  </Heading>
                  <Text color="white" fontSize="sm">
                    {filteredUsers.length} users found
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </LinearGradient>

          {/* Role Stats */}
          <Box bg="white" mx={4} mt={-4} p={4} borderRadius="xl" shadow={2}>
            <VStack space={3}>
              <Text fontWeight="bold" color="gray.700">
                User Statistics
              </Text>
              <HStack justifyContent="space-around">
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {stats.ADMIN}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Admins
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {stats.WHOLESALER}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Wholesalers
                  </Text>
                </VStack>
                <VStack alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {stats.RETAILER}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Retailers
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Role Filter */}
          <Box bg="white" mx={4} mt={4} p={4} borderRadius="xl" shadow={2}>
            <VStack space={3}>
              <Text fontWeight="bold" color="gray.700">
                Filter by Role
              </Text>
              <Select
                selectedValue={selectedRole}
                minWidth="200"
                accessibilityLabel="Filter by role"
                placeholder="All Roles"
                _selectedItem={{
                  bg: 'purple.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={setSelectedRole}
              >
                <Select.Item label="All Roles" value="all" />
                <Select.Item label="Admin" value="ADMIN" />
                <Select.Item label="Wholesaler" value="WHOLESALER" />
                <Select.Item label="Retailer" value="RETAILER" />
              </Select>
            </VStack>
          </Box>

          {/* User List */}
          <ScrollView flex={1} px={4} py={4}>
            <VStack space={3}>
              {filteredUsers.map((user, index) => (
                <Card key={user.id} bg="white" p={4} borderRadius="xl" shadow={1}>
                  <VStack space={3}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack flex={1}>
                        <Text fontWeight="bold" fontSize="md" color="gray.800">
                          {user.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {user.phone}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                        {user.lastLogin && (
                          <Text fontSize="xs" color="gray.500">
                            Last Login: {new Date(user.lastLogin).toLocaleDateString()}
                          </Text>
                        )}
                      </VStack>
                      <VStack alignItems="flex-end" space={1}>
                        <Badge
                          colorScheme={getRoleColor(user.role)}
                          variant="subtle"
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          colorScheme={getStatusColor(user.status)}
                          variant="subtle"
                        >
                          {user.status}
                        </Badge>
                      </VStack>
                    </HStack>

                    <Divider />

                    <HStack space={2} justifyContent="flex-end">
                      {user.status === 'pending' && (
                        <Button
                          size="sm"
                          bg="green.600"
                          _text={{ color: 'white' }}
                          onPress={() => handleUserAction(user.id, 'approve')}
                        >
                          Approve
                        </Button>
                      )}
                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          borderColor="red.600"
                          _text={{ color: 'red.600' }}
                          onPress={() => handleUserAction(user.id, 'deactivate')}
                        >
                          Deactivate
                        </Button>
                      )}
                      {user.status === 'inactive' && (
                        <Button
                          size="sm"
                          bg="blue.600"
                          _text={{ color: 'white' }}
                          onPress={() => handleUserAction(user.id, 'activate')}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="purple.600"
                        _text={{ color: 'purple.600' }}
                        onPress={() => handleUserAction(user.id, 'edit')}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </VStack>
                </Card>
              ))}

              {filteredUsers.length === 0 && (
                <Card bg="white" p={8} borderRadius="xl" shadow={1}>
                  <Text textAlign="center" color="gray.500">
                    No users found for the selected role
                  </Text>
                </Card>
              )}
            </VStack>
          </ScrollView>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default RoleUserList;
