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

const RetailerDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API call
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
      {
        id: '3',
        type: '18K Gold',
        rate: 58000,
        timestamp: new Date().toISOString(),
      },
    ];
    setGoldRates(mockRates);
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

  const handlePlaceBooking = () => {
    Alert.alert('Place Booking', 'Booking functionality coming soon...');
  };

  const handleViewHistory = () => {
    Alert.alert('Booking History', 'Viewing your booking history...');
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
                  Retailer Dashboard
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
                Welcome, {user?.name || 'Retailer'}
              </Heading>

              {/* Current Gold Rates */}
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
                    onPress={handlePlaceBooking}
                    borderRadius="lg"
                    py={3}
                  >
                    Place Booking
                  </Button>
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor="purple.600"
                    _text={{ color: 'purple.600', fontWeight: 'bold' }}
                    onPress={handleViewHistory}
                    borderRadius="lg"
                    py={3}
                  >
                    View History
                  </Button>
                </HStack>
              </VStack>

              {/* Recent Activity */}
              <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                <VStack space={3}>
                  <Heading size="sm" color="purple.800">
                    Recent Activity
                  </Heading>
                  <Text color="gray.600" fontSize="sm" textAlign="center" py={4}>
                    No recent activity to display
                  </Text>
                </VStack>
              </Card>
            </VStack>
          </ScrollView>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default RetailerDashboard;
