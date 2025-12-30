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
  Spinner,
} from 'native-base';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../feature/auth/hooks/useAuth';
import { 
  Alert, 
  StatusBar, 
  Modal, 
  Animated, 
  Dimensions, 
  View, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { connectSocket } from '../../shared/services/socket';
import { fetchCurrentRatesForRetailer } from '../../shared/services/goldrateService';
 import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../shared/services/apiClient';

const { width: screenWidth } = Dimensions.get('window');

interface GoldRate {
  id: string;
  type: string;
  rate: number;
  timestamp: string;
  wholesalerId: string;
  wholesalerName: string;
}

interface User {
  name?: string;
  wholesalerId?: number;
}

interface GroupedRates {
  [wholesalerId: string]: {
    wholesalerName: string;
    rates: GoldRate[];
  };
}

const RetailerDashboard: React.FC = () => {
  const { logout, user } = useAuth() as { logout: () => void; user: User | null };
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [groupedRates, setGroupedRates] = useState<GroupedRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showAllRates, setShowAllRates] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenWidth * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));

 

// useFocusEffect(
//   React.useCallback(() => {
//     apiClient.get('/api/user/me').catch(() => {});
//   }, [])
// );

  // Group rates by wholesaler
  const groupRatesByWholesaler = (rates: GoldRate[]): GroupedRates => {
    return rates.reduce((grouped: GroupedRates, rate: GoldRate) => {
      const { wholesalerId, wholesalerName } = rate;
      
      if (!grouped[wholesalerId]) {
        grouped[wholesalerId] = {
          wholesalerName,
          rates: []
        };
      }
      
      grouped[wholesalerId].rates.push(rate);
      return grouped;
    }, {});
  };

  // Update grouped rates whenever goldRates changes
  useEffect(() => {
    const grouped = groupRatesByWholesaler(goldRates);
    setGroupedRates(grouped);
  }, [goldRates]);

  // Sidebar functions
  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Close
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenWidth * 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setSidebarVisible(false));
    } else {
      // Open
      setSidebarVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenWidth * 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setSidebarVisible(false));
  };

  const getInitials = (name?: string) => {
    if (!name) return "RT";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Fetch initial rates
  useEffect(() => {
    const loadInitialRates = async () => {
      try {
        const rates = await fetchCurrentRatesForRetailer();
        console.log('Raw API response:', rates);
        
        const mappedRates = rates.map((rate: any) => {
          console.log('Processing rate:', rate);
          return {
            id: rate.id || '',
            type: `${rate.purity} Gold`,
            rate: rate.rate,
            timestamp: rate.date || rate.timestamp || new Date().toISOString(),
            wholesalerId: rate.wholesalerId?.toString() || rate.wholesaler_id?.toString() || 'unknown',
            wholesalerName: rate.wholesalerName || rate.wholesaler_name || rate.Wholesaler?.name || rate.wholesaler?.name || `Wholesaler ${rate.wholesalerId || rate.wholesaler_id || 'Unknown'}`
          };
        });
        console.log('Mapped rates:', mappedRates);
        setGoldRates(mappedRates);
      } catch (error) {
        console.error('Failed to fetch initial rates:', error);
        setGoldRates([]);
      }
    };
    loadInitialRates();
  }, [user?.wholesalerId]);

  // Set up WebSocket connection
    useEffect(() => {
      let isActive = true;
      let socket: any = null;

      (async () => {
        setLoading(true);
        console.log('User data:', user);

        try {
          socket = await connectSocket();
          console.log('Socket fully connected, ID:', socket.id);

          socket.on('rateUpdated', (data: any) => {
            console.log('📩 Received rateUpdated in RN:', data);
            if (!isActive) return;
          
            const item: GoldRate = {
              id: Date.now().toString(),
              type: `${data.purity} Gold`,
              rate: Number(data.rate),
              timestamp: new Date().toISOString(),
            wholesalerId: data.wholesalerId?.toString() || data.wholesaler_id?.toString() || 'unknown',
            wholesalerName: data.wholesalerName || data.wholesaler_name || data.Wholesaler?.name || data.wholesaler?.name || `Wholesaler ${data.wholesalerId || data.wholesaler_id || 'Unknown'}`
            };
          
          console.log('Mapped WebSocket item:', item);
            setGoldRates(prev => [item, ...prev]);
          });

          setLoading(false);
        } catch (error) {
          console.error('WebSocket setup error:', error);
          setLoading(false);
        }
      })();

      return () => {
        isActive = false;
        if (socket) {
          console.log('Cleaning up socket listeners and disconnecting');
          socket.off('rateUpdated');
          socket.off('connect');
          socket.off('connect_error');
          // socket.disconnect();
        }
      };
    }, [user?.wholesalerId]);

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
    closeSidebar();
    Alert.alert('Place Booking', 'Booking functionality coming soon...');
  };
  
  const handleViewHistory = () => {
    setShowAllRates(!showAllRates);
  };

  const handleWholesalerInfo = () => {
    closeSidebar();
    Alert.alert('Wholesaler Info', 'Wholesaler information functionality coming soon...');
  };

  const handleSettings = () => {
    closeSidebar();
    Alert.alert('Settings', 'Settings functionality coming soon...');
  };

  const handleSupport = () => {
    closeSidebar();
    Alert.alert('Support', 'Support functionality coming soon...');
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} ${time}`;
  };

  const renderSidebar = () => (
    <Modal
      visible={sidebarVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeSidebar}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalBackground,
            { opacity: overlayAnim },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeSidebar}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePicLarge}>
              <Text style={styles.profileInitialsLarge}>
                {getInitials(user?.name)}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || "Retailer"}</Text>
            <Text style={styles.userRole}>Retailer</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handlePlaceBooking}
            >
              <Text style={styles.menuText}>Place Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleWholesalerInfo}
            >
              <Text style={styles.menuText}>Wholesaler Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                handleViewHistory();
              }}
            >
              <Text style={styles.menuText}>
                {showAllRates ? 'Show Latest Rates' : 'View All Rates'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSettings}
            >
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSupport}
            >
              <Text style={styles.menuText}>Support</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutMenuItem]}
              onPress={() => {
                closeSidebar();
                handleLogout();
              }}
            >
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderWholesalerSection = (wholesalerId: string, wholesalerData: { wholesalerName: string; rates: GoldRate[] }) => {
    const ratesToShow = showAllRates ? wholesalerData.rates : wholesalerData.rates.slice(0, 3);
    
    return (
      <Card key={wholesalerId} bg="white" p={4} borderRadius="xl" shadow={2} mb={3}>
        <VStack space={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading size="sm" color="purple.800">
                {wholesalerData.wholesalerName}
              </Heading>
              <Text fontSize="xs" color="gray.500">
                {showAllRates ? `${wholesalerData.rates.length} rates` : `Latest ${Math.min(3, wholesalerData.rates.length)} rates`}
              </Text>
            </VStack>
            <Badge colorScheme="green" variant="subtle">
              Live
            </Badge>
          </HStack>
          
          <VStack space={2}>
            {ratesToShow.length > 0 ? (
              ratesToShow.map((rate, index, array) => (
                <Box key={rate.id}>
                  <HStack justifyContent="space-between" alignItems="center" py={2}>
                    <VStack>
                      <Text fontWeight="bold" color="gray.800">
                        {rate.type}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Updated: {formatDateTime(rate.timestamp)}
                      </Text>
                    </VStack>
                    <Text fontSize="lg" fontWeight="bold" color="green.600">
                      {formatPrice(rate.rate)}
                    </Text>
                  </HStack>
                  {index < array.length - 1 && <Divider />}
                </Box>
              ))
            ) : (
              <VStack justifyContent="center" alignItems="center" py={4}>
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  No rates available from this wholesaler
                </Text>
              </VStack>
            )}
          </VStack>
        </VStack>
      </Card>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
                paddingTop: 10,
                paddingBottom: 10,
                paddingHorizontal: 10,
                height: 80
              }}
            >
              <HStack justifyContent="space-between" alignItems="center"  px={4}>
                <VStack>
                  <Heading size="lg" color="white">
                    सोने भाव (Sone Bhav)
                  </Heading>
                  <Text color="white" fontSize="sm">
                    Retailer Dashboard
                  </Text>
                </VStack>
                <TouchableOpacity style={styles.profilePic} onPress={toggleSidebar}>
                  <Text style={styles.profileInitials}>
                    {getInitials(user?.name)}
                  </Text>
                </TouchableOpacity>
              </HStack>
            </LinearGradient>

              {/* Main Content */}
              <ScrollView flex={1} px={4} py={6}>
                {loading ? (
                  <VStack flex={1} justifyContent="center" alignItems="center" py={20}>
                    <Spinner size="lg" color="purple.600" />
                    <Text color="purple.800" mt={4}>
                      Loading retailer screen...
                    </Text>
                  </VStack>
                ) : (
                  <VStack space={4}>
                    <Heading size="md" color="purple.800" mb={2}>
                      Welcome, {user?.name || 'Retailer'}
                    </Heading>

                  {/* Current Gold Rates */}
                  <Card bg="white" p={4} borderRadius="xl" shadow={2}>
                    <VStack space={3}>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Heading size="sm" color="purple.800">
                          Current Gold Rates {showAllRates ? `(${goldRates.length})` : `(Latest 3)`}
                        </Heading>
                        <Badge colorScheme="green" variant="subtle">
                          Live
                        </Badge>
                      </HStack><VStack space={2}>
                        {goldRates.length > 0 ? (
                          (showAllRates ? goldRates : goldRates.slice(0, 3)).map((rate, index, array) => (
                            <Box key={rate.id}>
                              <HStack justifyContent="space-between" alignItems="center" py={2}>
                                <VStack>
                                  <Text fontWeight="bold" color="gray.800">
                                    {rate.type}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Updated: {formatDateTime(rate.timestamp)}
                                  </Text>
                                </VStack>
                                <Text fontSize="lg" fontWeight="bold" color="green.600">
                                  {formatPrice(rate.rate)}
                                </Text>
                              </HStack>
                              {index < array.length - 1 && <Divider />}
                            </Box>))
                        ) : (
                          <VStack
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                            py={4}
                          >
                            <Text color="gray.500" fontSize="sm" textAlign="center">
                              No gold rates available at the moment.{'\n'}
                              Please wait for your wholesaler to update rates.
                            </Text>
                          </VStack>
                        )}
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
                          variant="outline"
                          borderColor="purple.600"
                          _text={{ color: 'purple.600', fontWeight: 'bold' }}
                          onPress={handleViewHistory}
                          borderRadius="lg"
                          py={3}
                        >
                          {showAllRates ? 'Show Latest' : 'View All Rates'}
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
                )}
              </ScrollView>
            </Box>
          </LinearGradient>
        
        {/* Sidebar */}
        {renderSidebar()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ec4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInitials: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Sidebar styles
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: screenWidth * 0.8,
    backgroundColor: "#fff",
    height: "100%",
    elevation: 5,
    right: 0,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileSection: {
    backgroundColor: "#a855f7",
    padding: 20,
    alignItems: "center",
    paddingTop: 60,
  },
  profilePicLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ec4899",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInitialsLarge: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userRole: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 10,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#ef4444",
  },
});

export default RetailerDashboard;