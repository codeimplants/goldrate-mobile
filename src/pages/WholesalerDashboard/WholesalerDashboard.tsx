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
  Input,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../feature/auth/hooks/useAuth';
import { Alert } from 'react-native';

interface GoldRate {
  id: string;
  type: string;
  rate: number;
  timestamp: string;
}

interface Retailer {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
}

const WholesalerDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [newRate, setNewRate] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRates: GoldRate[] = [
      {
        id: '1',
        type: '24K Gold',
        rate: 65000,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: '22K Gold',
        rate: 62000,
        timestamp: new Date().toISOString(),
      },
    ];

    const mockRetailers: Retailer[] = [
      { id: '1', name: 'ABC Jewellers', phone: '9876543210', status: 'active' },
      { id: '2', name: 'XYZ Gold', phone: '9876543211', status: 'active' },
      { id: '3', name: 'DEF Store', phone: '9876543212', status: 'inactive' },
    ];

    setGoldRates(mockRates);
    setRetailers(mockRetailers);
  }, []);

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

  const handleUpdateRate = () => {
    if (!newRate) {
      Alert.alert('Error', 'Please enter a valid rate');
      return;
    }
    Alert.alert('Update Rate', `Rate updated to ₹${newRate}`);
    setNewRate('');
  };

  const handleManageRetailers = () => {
    Alert.alert('Manage Retailers', 'Opening retailer management...');
  };

  const handleViewReports = () => {
    Alert.alert('Reports', 'Loading reports...');
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
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
                  Wholesaler Dashboard
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
                Welcome, {user?.name || 'Wholesaler'}
              </Heading>

              {/* Rate Management */}
              <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                <VStack space={3}>
                  <Heading size="sm" color="purple.800">
                    Update Gold Rates
                  </Heading>
                  
                  <VStack space={2}>
                    <Text fontSize="sm" color="gray.600">
                      New Rate (₹ per gram)
                    </Text>
                    <Input
                      placeholder="Enter new rate"
                      value={newRate}
                      onChangeText={setNewRate}
                      keyboardType="numeric"
                      borderRadius="lg"
                    />
                    <Button
                      bg="purple.600"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                      onPress={handleUpdateRate}
                      borderRadius="lg"
                    >
                      Update Rate
                    </Button>
                  </VStack>
                </VStack>
              </Card>

              {/* Current Rates */}
              <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                <VStack space={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Heading size="sm" color="purple.800">
                      Current Gold Rates
                    </Heading>
                    <Badge colorScheme="green" variant="subtle">
                      Live
                    </Badge>
                  </HStack>
                  
                  <VStack space={2}>
                    {goldRates.map((rate, index) => (
                      <Box key={rate.id}>
                        <HStack justifyContent="space-between" alignItems="center" py={2}>
                          <VStack>
                            <Text fontWeight="bold" color="gray.800">
                              {rate.type}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Updated: {formatTime(rate.timestamp)}
                            </Text>
                          </VStack>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {formatPrice(rate.rate)}
                          </Text>
                        </HStack>
                        {index < goldRates.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </Card>

              {/* Retailer Management */}
              <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                <VStack space={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Heading size="sm" color="purple.800">
                      My Retailers
                    </Heading>
                    <Badge colorScheme="blue" variant="subtle">
                      {retailers.filter(r => r.status === 'active').length} Active
                    </Badge>
                  </HStack>
                  
                  <VStack space={2}>
                    {retailers.slice(0, 3).map((retailer, index) => (
                      <Box key={retailer.id}>
                        <HStack justifyContent="space-between" alignItems="center" py={2}>
                          <VStack>
                            <Text fontWeight="bold" color="gray.800">
                              {retailer.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {retailer.phone}
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={retailer.status === 'active' ? 'green' : 'red'}
                            variant="subtle"
                          >
                            {retailer.status}
                          </Badge>
                        </HStack>
                        {index < Math.min(retailers.length, 3) - 1 && <Divider />}
                      </Box>
                    ))}
                  </VStack>
                  
                  <Button
                    variant="outline"
                    borderColor="purple.600"
                    _text={{ color: 'purple.600', fontWeight: 'bold' }}
                    onPress={handleManageRetailers}
                    borderRadius="lg"
                  >
                    Manage All Retailers
                  </Button>
                </VStack>
              </Card>

              {/* Quick Actions */}
              <VStack space={3}>
                <Heading size="sm" color="purple.800">
                  Quick Actions
                </Heading>
                
                <HStack space={3}>
                  <Button
                    flex={1}
                    bg="purple.600"
                    _text={{ color: 'white', fontWeight: 'bold' }}
                    onPress={handleManageRetailers}
                    borderRadius="lg"
                    py={3}
                  >
                    Manage Retailers
                  </Button>
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor="purple.600"
                    _text={{ color: 'purple.600', fontWeight: 'bold' }}
                    onPress={handleViewReports}
                    borderRadius="lg"
                    py={3}
                  >
                    View Reports
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default WholesalerDashboard;
