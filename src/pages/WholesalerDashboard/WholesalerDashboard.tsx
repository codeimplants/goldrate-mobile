import React, { useState, useEffect, useCallback } from 'react';
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
  Spinner,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../feature/auth/hooks/useAuth';
import { Alert, TextInput, StyleSheet } from 'react-native';
import {
  broadcastRate,
  fetchCurrentRates,
  fetchRetailers,
} from '../../shared/services/goldrateService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

interface GoldRate {
  id: string;
  type: string;
  rate: number;
  timestamp: string;
}

interface Retailer {
  id: number | string;
  name: string;
  mobile: string;
  userCode: string;
  wholesalerName: string;
  linkedAt: string;
  status: 'active' | 'inactive';
}

interface User {
  name?: string;
  id: number;
  wholesalerId?: number;
  role?: string;
  token?: string;
}

const WholesalerDashboard: React.FC = () => {
  const { logout, user } = useAuth() as {
    logout: () => void;
    user: User | null;
  };

  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [newRate, setNewRate] = useState<string>('');
  const [loadingRates, setLoadingRates] = useState<boolean>(true);
  const [loadingRetailers, setLoadingRetailers] = useState<boolean>(true);

  const wholesalerId = user?.wholesalerId;
  const navigation = useNavigation();

  // 🔹 Fetch gold rates only
  const loadRates = async () => {
    setLoadingRates(true);
    try {
      const rates = await fetchCurrentRates(wholesalerId || 1);
      const mappedRates = rates.map((rate) => ({
        id: rate.id || '',
        type: `${rate.purity} Gold`,
        rate: rate.rate,
        timestamp: rate.date,
      }));

      // sort latest first
      const sorted = mappedRates.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setGoldRates(sorted.length ? sorted : []);
    } catch (error) {
      console.error('Failed to load rates:', error);
      Alert.alert('Error', 'Failed to load gold rates.');
      setGoldRates([
        {
          id: '1',
          type: '24K Gold',
          rate: 5555,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingRates(false);
    }
  };

  // 🔹 Fetch retailers only
  const loadRetailers = async () => {
    setLoadingRetailers(true);
    try {
      const retailerData = await fetchRetailers(wholesalerId || 1);
      setRetailers(
        retailerData.map((r) => ({
          ...r,
          status: 'active',
        }))
      );
    } catch (error) {
      console.error('Failed to load retailers:', error);
      Alert.alert('Error', 'Failed to load retailers.');
      setRetailers([
        {
          id: 1,
          name: 'NO Retailer',
          mobile: '1234567890',
          userCode: 'R001',
          wholesalerName: 'Wholesaler A',
          linkedAt: '2023-01-01',
          status: 'active',
        },
      ]);
    } finally {
      setLoadingRetailers(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRates();
    loadRetailers();
  }, [wholesalerId]);

  // Reload when screen comes back into focus (retailer added)
  useFocusEffect(
    useCallback(() => {
      loadRetailers();
    }, [wholesalerId])
  );

  // 🔹 Logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  // 🔹 Update rate
  const handleUpdateRate = async () => {
    const rateNumber = parseFloat(newRate);
    if (!newRate || isNaN(rateNumber)) {
      Alert.alert('Error', 'Please enter a valid rate');
      return;
    }

    setLoadingRates(true);
    try {
      await broadcastRate({
        rate: rateNumber,
        purity: '24K',
        wholesalerId: user?.wholesalerId || 1,
      });
      Alert.alert('Success', `Rate broadcasted: ₹${rateNumber}`);
      setNewRate('');

      // ✅ Refresh only rates
      await loadRates();
    } catch (err) {
      Alert.alert('Error', 'Failed to broadcast rate. Please try again.');
    } finally {
      setLoadingRates(false);
    }
  };

  // 🔹 Navigation
  const handleManageRetailers = () => {
    navigation.navigate('createUser' as never);
  };

  const handleViewReports = () => {
    Alert.alert('Reports', 'Loading reports...');
  };

  // 🔹 Utils
  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;
  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
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
                _web={{ borderWidth: 1, borderColor: 'white' }}
                _ios={{ borderWidth: 1, borderColor: 'white' }}
                _android={{ borderWidth: 1, borderColor: 'white' }}
                backgroundColor="transparent"
                _text={{ color: 'white' }}
                onPress={handleLogout}
                size="sm"
              >
                Logout
              </Button>
            </HStack>
          </LinearGradient>

          {/* Main Content */}
          <ScrollView
            flex={1}
            px={4}
            py={6}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
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
                    <TextInput
                      placeholder="Enter new rate"
                      value={newRate}
                      onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9.]/g, '');
                        const parts = formatted.split('.');
                        if (parts.length > 2) return;
                        setNewRate(formatted);
                      }}
                      keyboardType="decimal-pad"
                      style={styles.input}
                      placeholderTextColor="#718096"
                    />
                    <Button
                      bg="purple.600"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                      onPress={handleUpdateRate}
                      borderRadius="lg"
                      isDisabled={loadingRates}
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
                    {loadingRates ? (
                      <VStack
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Spinner size="lg" color="purple.600" />
                        <Text color="purple.800">Loading rates...</Text>
                      </VStack>
                    ) : (
                      goldRates.slice(0, 5).map((rate, index) => (
                        <Box key={rate.id}>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            py={2}
                          >
                            <VStack>
                              <Text fontWeight="bold" color="gray.800">
                                {rate.type}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Updated: {formatDateTime(rate.timestamp)}
                              </Text>
                            </VStack>
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="green.600"
                            >
                              {formatPrice(rate.rate)}
                            </Text>
                          </HStack>
                          {index <
                            Math.min(goldRates.length, 5) - 1 && <Divider />}
                        </Box>
                      ))
                    )}
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
                      <Text>
                        {retailers.filter((r) => r.status === 'active').length} Active
                      </Text>
                    </Badge>
                  </HStack>
                  <VStack space={2}>
                    {loadingRetailers ? (
                      <VStack
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Spinner size="lg" color="purple.600" />
                        <Text color="purple.800">Loading retailers...</Text>
                      </VStack>
                    ) : (
                      retailers.map((retailer, index) => (
                        <Box key={retailer.id}>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            py={2}
                          >
                            <VStack>
                              <Text fontWeight="bold" color="gray.800">
                                {retailer.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {retailer.mobile}
                              </Text>
                            </VStack>
                            <Badge
                              colorScheme={
                                retailer.status === 'active' ? 'green' : 'red'
                              }
                              variant="subtle"
                            >
                              {retailer.status}
                            </Badge>
                          </HStack>
                          <Divider />
                        </Box>
                      ))
                    )}
                  </VStack>
                  <Button
                    variant="outline"
                    _web={{ borderWidth: 1, borderColor: 'purple.600' }}
                    _ios={{ borderWidth: 1, borderColor: 'purple.600' }}
                    _android={{ borderWidth: 1, borderColor: 'purple.600' }}
                    backgroundColor="transparent"
                    _text={{ color: 'purple.600', fontWeight: 'bold' }}
                    onPress={handleManageRetailers}
                    borderRadius="lg"
                  >
                    Manage All Retailers
                  </Button>
                </VStack>
              </Card>

              {/* Quick Actions */}
              <VStack space={5}>
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
                    _web={{ borderWidth: 1, borderColor: 'purple.600' }}
                    _ios={{ borderWidth: 1, borderColor: 'purple.600' }}
                    _android={{ borderWidth: 1, borderColor: 'purple.600' }}
                    backgroundColor="transparent"
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

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: '#805AD5',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#1A202C',
    backgroundColor: '#FFFFFF',
  },
});

export default WholesalerDashboard;

